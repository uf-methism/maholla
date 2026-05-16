import { GoogleGenAI } from '@google/genai';
import { env } from '../config/env.config';
import { logger } from '../utils/logger.util';

const ai = env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: env.GEMINI_API_KEY }) : null;

export interface AIIntent {
  intent: 'UPDATE_CART' | 'CONFIRM_ORDER' | 'CHANGE_STORE' | 'CALL_STORE' | 'CHANGE_LOCATION' | 'SHOW_CART' | 'GENERAL_CHAT';
  payload?: any;
}

export const geminiService = {
  /**
   * Acts as the core conversational brain.
   * Classifies the user's intent and extracts required data.
   */
  classifyIntent: async (currentCart: any[], userMessage: string): Promise<AIIntent> => {
    if (!ai) throw new Error('GEMINI_API_KEY is missing');
    
    const prompt = `You are a highly intelligent intent router for an Indian grocery chatbot (Mohalla).
Your job is to understand what the user wants to do and output a STRICT JSON object representing their intent.

Available Intents:
1. UPDATE_CART: The user is listing items to buy, adding items, or removing items. 
   - You MUST provide a "payload" containing the FULL updated cart as an array of { name: string, quantity: number, unit: string }.
   - Fix any spelling mistakes in product names to standard spellings (e.g., "maggie" -> "Maggi", "aalo" -> "Aalu", "tamatar" -> "Tomato", "aam" -> "Mango").
   - Current Cart: ${JSON.stringify(currentCart)}
2. CONFIRM_ORDER: The user is confirming the order (e.g. "thik hai", "done", "place order", "okay").
3. CHANGE_STORE: The user wants to switch to a different shop or exit the current one.
4. CALL_STORE: The user is asking for the store's phone number or how to call them.
5. CHANGE_LOCATION: The user wants to change their delivery/browsing location.
6. SHOW_CART: The user is just asking what is currently in their cart.
7. GENERAL_CHAT: The user is saying hi, thanks, or something unrelated.

User Message: "${userMessage}"

Return ONLY a JSON object:
{
  "intent": "INTENT_NAME",
  "payload": { ... } // Optional, depending on intent
}`;

    try {
      const response = await ai.models.generateContent({
        model: env.GEMINI_MODEL,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.1, // Low temperature for deterministic routing
        }
      });
      
      const text = response.text;
      return JSON.parse(text || '{"intent": "GENERAL_CHAT"}');
    } catch (error) {
      logger.error('Gemini intent classification failed', error);
      throw new Error('Failed to classify intent with Gemini');
    }
  }
};
