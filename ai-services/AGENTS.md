# AI Services — AI Agent Context

> **Owner: Member A**
> If you are Member B's AI agent, **STOP. Do not modify anything in this directory.**

## What This Is

Isolated service modules that wrap external AI APIs (OpenAI Whisper, Anthropic Claude). The backend calls these services — they do NOT expose their own HTTP endpoints.

## Tech Stack

- **Language:** TypeScript
- **APIs:** OpenAI Whisper (speech-to-text), Anthropic Claude (intent parsing, order parsing, support triage)
- **Pattern:** Each AI feature is a standalone module with a clean function interface

## Directory Structure (Target)

```
ai-services/
├── src/
│   ├── voice-inventory/     → Whisper transcription + Claude inventory parsing
│   │   ├── transcribe.ts    → Audio → text via Whisper
│   │   └── parse.ts         → Text → structured inventory delta via Claude
│   ├── order-parser/        → WhatsApp message → structured order via Claude
│   │   └── parse.ts
│   ├── support-triage/      → Support message → category + resolution via Claude
│   │   └── triage.ts
│   └── index.ts             → Public API exports
├── prompts/                 → Claude prompt templates (version-controlled)
│   ├── inventory-parse.txt
│   ├── order-parse.txt
│   └── support-triage.txt
├── package.json
└── tsconfig.json
```

## Patterns to Follow

- **Prompts live in `prompts/`** as plain text files, not hardcoded in TypeScript. This makes them easy to iterate on.
- **Each module exports a single async function** with typed input/output.
- **Always return structured data** (typed interfaces from `shared-types`), never raw Claude output.
- **Handle AI failures gracefully** — if parsing fails, return a fallback object with `confidence: 'low'` so the UI can ask the vendor to confirm.

## Files You Must NEVER Touch

- Anything in `apps/` or `backend/` (different concerns/owners)
- `packages/shared-types/` (requires coordination — ask the human first)
