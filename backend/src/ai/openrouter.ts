import axios, { AxiosError } from 'axios';
import { AppError } from '../utils/appError.util';
import { logger } from '../utils/logger.util';

// -----------------------------------------------------------------------------
// Generic OpenRouter Service
// -----------------------------------------------------------------------------

interface OpenRouterRequestOptions {
  model?: string;
  temperature?: number;
  retries?: number;
  timeoutMs?: number;
}

const DEFAULT_FREE_MODEL = 'meta-llama/llama-3-8b-instruct:free';
const DEFAULT_RETRIES = 3;
const DEFAULT_TIMEOUT = 10000; // 10 seconds

/**
 * A generic and reusable OpenRouter API client.
 */
class OpenRouterClient {
  private readonly baseUrl = 'https://openrouter.ai/api/v1/chat/completions';

  private getApiKey(): string {
    const key = process.env.OPENROUTER_API_KEY;
    if (!key) {
      throw new AppError('OPENROUTER_API_KEY is not configured in environment variables', 500);
    }
    return key;
  }

  /**
   * Generates a strict JSON structured output using OpenRouter models.
   * Includes exponential backoff retry logic and timeout handling.
   */
  async generateStructuredOutput<T>(
    systemPrompt: string,
    userPrompt: string,
    options: OpenRouterRequestOptions = {}
  ): Promise<T> {
    const model = options.model || DEFAULT_FREE_MODEL;
    const maxRetries = options.retries ?? DEFAULT_RETRIES;
    const timeout = options.timeoutMs ?? DEFAULT_TIMEOUT;
    const temperature = options.temperature ?? 0.0; // Strict parsing prefers low temperature

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        logger.debug(`Calling OpenRouter (Model: ${model}, Attempt: ${attempt})`);
        
        const response = await axios.post(
          this.baseUrl,
          {
            model,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt },
            ],
            temperature,
            // Fallback instruction for models that don't support response_format natively
            response_format: { type: 'json_object' },
          },
          {
            headers: {
              Authorization: `Bearer ${this.getApiKey()}`,
              'Content-Type': 'application/json',
            },
            timeout,
          }
        );

        const content = response.data?.choices?.[0]?.message?.content;
        if (!content) {
          throw new Error('Received empty response content from OpenRouter');
        }

        // Clean up markdown wrappers (```json ... ```) if the model ignored response_format
        const cleanedContent = content.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanedContent) as T;

      } catch (error: unknown) {
        const err = error as AxiosError | Error;
        const isLastAttempt = attempt === maxRetries;
        
        if (axios.isAxiosError(err)) {
          logger.warn(
            `OpenRouter API Error (Attempt ${attempt}/${maxRetries}): ${err.response?.data?.error?.message || err.message}`
          );
        } else {
          logger.warn(`OpenRouter Parsing Error (Attempt ${attempt}/${maxRetries}): ${err.message}`);
        }

        if (isLastAttempt) {
          logger.error('OpenRouter exhausted all retries', { error: err.message });
          throw new AppError(`OpenRouter generation failed after ${maxRetries} attempts`, 502);
        }

        // Exponential backoff
        await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
      }
    }
    throw new AppError('OpenRouter generation failed', 502);
  }
}

// Singleton instance
export const openRouterClient = new OpenRouterClient();

// -----------------------------------------------------------------------------
// Inventory Parsing Domain Logic
// -----------------------------------------------------------------------------

export interface ParsedInventoryItem {
  name: string;
  quantity_change: number; // positive for restock, negative for sale
  unit: string;
  confidence: number;
}

export interface InventoryIntentResponse {
  items: ParsedInventoryItem[];
  fallback_required: boolean;
  intent_summary: string;
}

export const openRouterService = {
  /**
   * Parses the Hindi/Hinglish transcript using an LLM to extract inventory intents.
   */
  parseInventoryIntent: async (transcript: string): Promise<InventoryIntentResponse> => {
    logger.info('Sending transcript to OpenRouter for intent parsing');

    const systemPrompt = `
You are an AI assistant for "Mohalla", a hyperlocal vendor platform in India.
Your task is to parse a Hindi/Hinglish transcription of a vendor's voice note into a strict JSON structure representing inventory changes.

Rules:
1. Identify all products mentioned.
2. Determine if it is a restock (aaya, kharida, add kiya -> positive quantity) or a sale (gaya, bika, de diya -> negative quantity).
3. Normalize Hindi numbers into digits (e.g. "bees" -> 20, "paanch" -> 5).
4. Assign a confidence score from 0.0 to 1.0 based on how clear the intent is.
5. Provide a short intent_summary in English.
6. If the intent is completely unclear or unrelated to inventory, set fallback_required to true.
7. ONLY output valid JSON. No markdown wrappers.

Expected JSON format:
{
  "items": [
    {
      "name": "atta",
      "quantity_change": 20,
      "unit": "kg",
      "confidence": 0.95
    }
  ],
  "fallback_required": false,
  "intent_summary": "Restocked 20kg of atta"
}
    `.trim();

    return await openRouterClient.generateStructuredOutput<InventoryIntentResponse>(
      systemPrompt,
      transcript,
      {
        model: 'google/gemma-7b-it:free', // Free model good at instruction following
        retries: 3,
        timeoutMs: 15000,
      }
    );
  },
};
