# Backend — AI Agent Context

> **Owner: Member A**
> If you are Member B's AI agent, **STOP. Do not modify anything in this directory.**

## What This Is

Express.js REST API server for Mohalla. Handles all server-side logic, database operations, and external API orchestration.

## Tech Stack

- **Runtime:** Node.js + Express
- **Language:** TypeScript (strict)
- **Database:** PostgreSQL (via Prisma ORM or raw queries with `pg`)
- **Cache:** Redis (sessions, inventory cache)
- **Auth:** Firebase Admin SDK (verify OTP tokens)
- **API Style:** RESTful with JSON request/response

## Directory Structure (Target)

```
backend/
├── src/
│   ├── routes/          → Express route handlers (thin — delegate to services)
│   ├── services/        → Business logic layer
│   ├── models/          → Database models / Prisma schema
│   ├── middleware/       → Auth, validation, error handling middleware
│   ├── utils/           → Helper functions
│   └── index.ts         → App entry point
├── prisma/
│   └── schema.prisma    → Database schema
├── tests/
├── package.json
├── tsconfig.json
└── .env.example
```

## Patterns to Follow

- **Routes are thin:** Routes extract params, call a service, return the response. No business logic in routes.
- **Services contain logic:** All DB queries, validations, and orchestration happen in services.
- **Middleware for cross-cutting:** Auth checking, request validation, error formatting.
- **Never return raw DB errors** to the client — wrap in a standard error response.
- **All endpoints** import request/response types from `packages/shared-types/`.

## Files You Must NEVER Touch

- Anything in `apps/` or `ai-services/` (different owners)
- `packages/shared-types/` (requires coordination — ask the human first)
