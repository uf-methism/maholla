import { GoogleGenAI } from '@google/genai';
import 'dotenv/config';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function run() {
  const models = [
    'gemini-2.0-flash',
    'gemini-1.5-flash',
    process.env.GEMINI_MODEL
  ];

  for (const model of models) {
    if (!model) continue;
    try {
      const response = await ai.models.generateContent({
        model: model,
        contents: 'Say hi',
      });
      console.log(`Success with ${model}:`, response.text);
      return; // Exit on first success
    } catch (e: any) {
      console.error(`Failed with ${model}:`, e.status, e.message);
    }
  }
}
run();
