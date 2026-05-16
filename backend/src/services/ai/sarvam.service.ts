import axios from 'axios';
import FormData from 'form-data';
import { env } from '../../config/env.config';
import { AppError } from '../../utils/appError.util';
import { logger } from '../../utils/logger.util';

export const sarvamService = {
  /**
   * Transcribes an audio buffer using Sarvam AI's speech-to-text API.
   * Assumes Hindi/Hinglish speech.
   */
  transcribeAudio: async (
    audioBuffer: Buffer,
    filename: string,
    mimetype: string
  ): Promise<string> => {
    try {
      const apiKey = process.env.SARVAM_API_KEY;
      if (!apiKey) {
        throw new AppError('SARVAM_API_KEY is not configured', 500);
      }

      const form = new FormData();
      form.append('file', audioBuffer, {
        filename,
        contentType: mimetype,
      });
      // Set parameters for Sarvam Speech-to-Text API
      // Reference: https://docs.sarvam.ai/api-reference/speech-to-text
      form.append('language_code', 'hi-IN'); // Hindi / Hinglish 

      logger.info('Sending audio to Sarvam AI for transcription', { filename });

      const response = await axios.post(
        'https://api.sarvam.ai/speech-to-text-translate', // Use speech-to-text if translation not needed, or standard endpoint
        form,
        {
          headers: {
            ...form.getHeaders(),
            'api-subscription-key': apiKey,
          },
        }
      );

      // Extract transcript
      // Depending on the exact endpoint, the response shape might be { transcript: string }
      if (response.data && response.data.transcript) {
        return response.data.transcript;
      }

      logger.error('Unexpected response structure from Sarvam', { data: response.data });
      throw new AppError('Failed to parse transcript from Sarvam AI', 500);
    } catch (error: any) {
      logger.error('Error in Sarvam AI transcription', { err: error.message });
      throw new AppError(
        `Speech-to-text failed: ${error.response?.data?.message || error.message}`,
        502
      );
    }
  },
};
