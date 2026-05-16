# WhatsApp Integration Guide

This document explains how to set up and test the WhatsApp messaging system for Mohalla using **Twilio's WhatsApp Sandbox**.

## Architecture

```
Customer (WhatsApp) → Twilio → Ngrok (dev) / Railway (prod) → Express Backend → Reply via Twilio → Customer
```

The backend exposes a webhook at `/api/v1/whatsapp/webhook` that Twilio calls whenever a customer sends a message to the sandbox number.

## Prerequisites

- Node.js 18+
- A [Twilio account](https://www.twilio.com/try-twilio) (free trial, no credit card needed)
- [Ngrok](https://ngrok.com/) installed (for local development only)

## Setup for New Developers

### 1. Pull & Install

```bash
git pull origin main
cd backend
npm install
```

### 2. Configure Environment Variables

Copy the example file and fill in the values:

```bash
cp .env.example .env
```

You need these Twilio-specific variables:

| Variable | Where to find it |
|---|---|
| `TWILIO_ACCOUNT_SID` | Twilio Console → Dashboard → Account SID |
| `TWILIO_AUTH_TOKEN` | Twilio Console → Dashboard → Auth Token (click "Show") |
| `TWILIO_WHATSAPP_NUMBER` | The Twilio Sandbox number, usually `+14155238886` |

### 3. Activate the WhatsApp Sandbox

1. Go to [Twilio Console](https://console.twilio.com/)
2. Navigate to **Messaging** → **Try it out** → **Send a WhatsApp message**
3. You'll see instructions like: *"Send `join <keyword>` to +1 (415) 523-8886"*
4. Open WhatsApp on your phone and send that exact message to the number
5. You'll get a confirmation reply — you're now connected to the sandbox

> **Note:** Each person who wants to test must send the `join` message from their WhatsApp first.

### 4. Start the Backend

```bash
npm run dev
```

The server starts on `http://localhost:5000`.

### 5. Expose with Ngrok (Development Only)

Open a **new terminal** and run:

```bash
ngrok http 5000
```

Copy the `https://...ngrok-free.app` URL.

### 6. Configure Twilio Webhook

1. Go to [Twilio Console](https://console.twilio.com/)
2. Navigate to **Messaging** → **Try it out** → **Send a WhatsApp message**
3. In the **Sandbox Configuration** section, set:
   - **When a message comes in**: `https://<your-ngrok-url>/api/v1/whatsapp/webhook`
   - **Method**: POST
4. Click **Save**

> **Important:** Ngrok URL changes every restart (free plan). Update the Twilio sandbox config each time.

### 7. Test It

Send any message from your WhatsApp to the Twilio sandbox number. You should:

1. See the message logged in your backend terminal
2. Receive an acknowledgment reply on WhatsApp
3. Find the message saved in your database (`WhatsAppMessage` table)

## File Structure

```
backend/src/
├── config/
│   └── env.config.ts          # Validates Twilio env vars
├── controllers/
│   └── whatsapp.controller.ts # Webhook handler (Twilio format)
├── routes/
│   └── whatsapp.routes.ts     # GET/POST /api/v1/whatsapp/webhook
└── services/
    └── whatsapp.service.ts    # Sends messages via Twilio SDK
```

## How It Works

1. **Customer sends WhatsApp message** to the Twilio sandbox number.
2. **Twilio forwards it** as a POST request (form-urlencoded) to our webhook with fields: `From`, `Body`, `ProfileName`, `MessageSid`.
3. **Our controller**:
   - Finds or creates a `Customer` record by phone number
   - Saves the message to the `WhatsAppMessage` table
   - Sends an acknowledgment reply back via the Twilio SDK
   - Saves the outbound message to the database

## Troubleshooting

| Problem | Solution |
|---|---|
| No reply from bot | Check that you sent `join <keyword>` to activate the sandbox first |
| Webhook not receiving messages | Verify the Ngrok URL is correct in Twilio's sandbox config |
| "Twilio credentials are required" | Fill in `TWILIO_ACCOUNT_SID` and `TWILIO_AUTH_TOKEN` in `.env` |
| Ngrok URL changed | Update it in Twilio's sandbox configuration |
| Message not saving to DB | Check the backend terminal for Prisma errors |

## Production Deployment

When deploying to Railway (or any host), replace the Ngrok URL with your actual server URL in Twilio's webhook config:

```
https://your-app.railway.app/api/v1/whatsapp/webhook
```

For production WhatsApp (your own number instead of sandbox), you'll need to upgrade to a Twilio paid plan and request a WhatsApp-enabled number.
