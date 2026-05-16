import twilio from 'twilio';
import { env } from '../config/env.config';

const client = twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);

export const whatsappService = {
  /**
   * Sends a plain text WhatsApp message via Twilio.
   */
  async sendMessage(to: string, text: string): Promise<string> {
    // Twilio requires the whatsapp: prefix
    const fromNumber = `whatsapp:${env.TWILIO_WHATSAPP_NUMBER}`;
    const toNumber = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;

    const message = await client.messages.create({
      from: fromNumber,
      to: toNumber,
      body: text,
    });

    console.log(`✅ Message sent to ${to} (SID: ${message.sid})`);
    return message.sid;
  },
};
