# MOHALLA — AI Agent Rules (Global)

> **Read this file before making ANY changes to this repository.**
> This file is the single source of truth for all AI coding agents working in this repo.

## Project Overview

Mohalla is a hyperlocal vendor digitalisation platform for India's kirana stores and street vendors. It uses voice-first AI (Whisper + Claude) to let vendors manage inventory by speaking, takes orders via WhatsApp, and provides a customer-facing discovery PWA.

**Tech Stack:** React Native (Expo) · Next.js · Node.js/Express · PostgreSQL · Redis · Firebase Auth · WhatsApp Business API · Claude API · Whisper API

## Architecture Map

```
maholla/
├── apps/vendor/          → React Native (Expo) vendor mobile app
├── apps/customer-pwa/    → Next.js customer-facing progressive web app
├── backend/              → Express REST API + PostgreSQL + Redis
├── ai-services/          → AI service layer (Whisper, Claude integrations)
├── packages/shared-types/ → Shared TypeScript interfaces (API contracts)
└── docs/                 → Documentation
```

## 🚨 Ownership Rules — READ CAREFULLY

This repo is worked on by **two team members simultaneously**, each using AI agents. To prevent conflicts:

| Directory | Owner | The other person's AI must NEVER touch this |
|---|---|---|
| `backend/` | **Member A** | ✅ Member A only |
| `ai-services/` | **Member A** | ✅ Member A only |
| `apps/vendor/` | **Member B** | ✅ Member B only |
| `apps/customer-pwa/` | **Member B** | ✅ Member B only |
| `packages/shared-types/` | **Both** | ⚠️ Requires coordination (see rules below) |
| Root config files | **Both** | ⚠️ Discuss before modifying |

### Hard Rules

1. **NEVER modify files outside your ownership zone.** If you are working in `backend/`, do not create, edit, or delete anything in `apps/`. Period.
2. **NEVER modify `packages/shared-types/`** without the human explicitly asking you to. If you need a new shared type, tell the human — don't just add it.
3. **NEVER push directly to `main`.** Always work on a feature branch.
4. **NEVER modify the other person's `AGENTS.md`** or any context/config file in their directory.
5. **ALWAYS check which directory you are operating in** before making changes. If the human's workspace is `backend/`, stay in `backend/`.

## Git Rules

- **Branch naming:** `feat/<owner>/<short-description>` or `fix/<owner>/<short-description>`
  - Examples: `feat/member-a/vendor-crud-api`, `fix/member-b/onboarding-screen-crash`
- **Commits:** Use Conventional Commits format
  - `feat(backend): add vendor CRUD endpoints`
  - `fix(vendor-app): resolve OTP input crash on Android`
  - `chore(shared-types): add Order status enum`
- **Before starting work:** Always pull latest `main` and rebase your branch
- **PRs:** Must be reviewed by the other team member before merging

## Code Style

- **Language:** TypeScript (strict mode) everywhere except scripts
- **Formatting:** Prettier with default config
- **Linting:** ESLint with recommended rules
- **Naming:** camelCase for variables/functions, PascalCase for types/components, SCREAMING_SNAKE for constants
- **Exports:** Named exports preferred over default exports
- **Error handling:** Always handle errors explicitly — never silently swallow

## API Contracts

All API request/response shapes are defined in `packages/shared-types/`. Both frontend and backend import from here. This is the **contract layer** — if a type changes here, both sides must update.

**Workflow for changing a shared type:**
1. Discuss the change with your teammate
2. Create a branch: `chore/shared-types/<change-description>`
3. Update the types in `packages/shared-types/`
4. Open a PR and get approval from both members
5. Each member then updates their code against the new types

## What NOT To Do

- Do not install global dependencies or modify root `package.json` scripts without discussion
- Do not create new top-level directories
- Do not refactor or reorganise another person's code "for cleanliness"
- Do not add, modify, or remove database migrations unless you own `backend/`
- Do not create `.env` files with real API keys — use `.env.example` with placeholder values
