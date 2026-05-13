# Mohalla — Dev Roadmap (Sprint 0 → MVP)

> **Purpose:** Prevent both devs from colliding at the start by giving each person independent, parallelisable work from Day 1.

---

## Team Assignment

| Member | Owns | Focus |
|---|---|---|
| **Member A** | `backend/`, `ai-services/` | API, database, AI integrations, WhatsApp webhook |
| **Member B** | `apps/vendor/`, `apps/customer-pwa/` | Vendor mobile app, customer discovery PWA |

---

## Sprint 0 — Foundation (Days 1–3)

> **Goal:** Both devs set up their projects independently. Zero cross-dependency.

### Member A — Backend Setup

| # | Task | Branch | Output |
|---|---|---|---|
| A0.1 | Init Express + TypeScript in `backend/` | `feat/member-a/backend-init` | Running Express server on port 3000 |
| A0.2 | Set up PostgreSQL schema (vendors, products, orders, customers) | same branch | Prisma schema + initial migration |
| A0.3 | Create `.env.example` with placeholder keys | same branch | `.env.example` committed |
| A0.4 | Add health check endpoint `GET /api/health` | same branch | Returns `{ status: "ok" }` |

**PR → merge to main when done.**

### Member B — Frontend Setup

| # | Task | Branch | Output |
|---|---|---|---|
| B0.1 | Init Expo app in `apps/vendor/` | `feat/member-b/vendor-app-init` | Expo app running on phone via Expo Go |
| B0.2 | Init Next.js app in `apps/customer-pwa/` | `feat/member-b/pwa-init` | Next.js dev server running on port 3001 |
| B0.3 | Set up navigation structure (Expo Router) in vendor app | same branch as B0.1 | Tab navigator: Home, Inventory, Orders, Settings |
| B0.4 | Set up basic page structure in customer PWA | same branch as B0.2 | Pages: `/`, `/store/[id]`, `/search` |

**PRs → merge to main when done.**

> [!TIP]
> **No collision risk here.** Member A only touches `backend/`. Member B only touches `apps/`. They can work fully in parallel.

---

## Sprint 1 — Core Features (Days 4–7)

> **Goal:** Each dev builds their core feature independently. They communicate only about API contracts.

### 🤝 Sync Point (30 min call before Sprint 1 starts)

Agree on the API contract for the first endpoints. Update `packages/shared-types/` together on a `chore/shared-types/sprint-1-contracts` branch:

```
POST   /api/vendors          → Create vendor (onboarding)
GET    /api/vendors/:id      → Get vendor profile
POST   /api/products         → Add product
GET    /api/vendors/:id/products → List vendor's products
POST   /api/orders           → Create order
GET    /api/vendors/:id/orders   → List vendor's orders
```

### Member A — API Endpoints

| # | Task | Branch | Output |
|---|---|---|---|
| A1.1 | Firebase Auth middleware (verify OTP tokens) | `feat/member-a/auth-middleware` | Protected routes working |
| A1.2 | Vendor CRUD endpoints (create, read, update) | `feat/member-a/vendor-crud` | POST/GET/PATCH `/api/vendors` |
| A1.3 | Product CRUD endpoints | `feat/member-a/product-crud` | POST/GET/PATCH/DELETE `/api/products` |
| A1.4 | Order endpoints (create, list, update status) | `feat/member-a/order-endpoints` | POST/GET/PATCH `/api/orders` |

### Member B — App Screens

| # | Task | Branch | Output |
|---|---|---|---|
| B1.1 | Firebase Auth integration (phone OTP login screen) | `feat/member-b/auth-flow` | OTP login working on vendor app |
| B1.2 | Onboarding screen (store name, category, location) | `feat/member-b/onboarding` | Multi-step onboarding form |
| B1.3 | Inventory list screen (show products, add manually) | `feat/member-b/inventory-screen` | Product list with add button |
| B1.4 | Customer PWA: store discovery page with map | `feat/member-b/discovery-map` | Map with vendor pins |

> [!NOTE]
> **Member B can use mock data / a local JSON file** for screens until Member A's API is ready. Connect to real API in Sprint 2. This prevents blocking.

---

## Sprint 2 — Integration + AI (Days 8–12)

> **Goal:** Connect frontend ↔ backend. Add the voice AI differentiator.

### 🤝 Sync Point (30 min call before Sprint 2)

- Confirm API endpoints match the shared types
- Member B switches from mock data to real API calls
- Agree on the voice upload endpoint: `POST /api/ai/voice-inventory`

### Member A — AI Services

| # | Task | Branch | Output |
|---|---|---|---|
| A2.1 | Whisper integration in `ai-services/` (audio → text) | `feat/member-a/whisper-integration` | Transcribes Hindi/English audio |
| A2.2 | Claude inventory parser (text → structured delta) | `feat/member-a/inventory-parser` | Returns `InventoryDelta[]` JSON |
| A2.3 | Voice inventory endpoint: `POST /api/ai/voice-inventory` | `feat/member-a/voice-endpoint` | Accepts audio blob, returns parsed inventory |
| A2.4 | WhatsApp webhook: receive message → parse order → create | `feat/member-a/whatsapp-webhook` | End-to-end WhatsApp → Order flow |

### Member B — Connect + Voice UI

| # | Task | Branch | Output |
|---|---|---|---|
| B2.1 | Connect vendor app to real backend API | `feat/member-b/api-integration` | All screens use live data |
| B2.2 | Voice recording button on inventory screen | `feat/member-b/voice-recording` | Record → send to `/api/ai/voice-inventory` |
| B2.3 | Order inbox screen (show incoming orders, confirm/reject) | `feat/member-b/order-inbox` | Real-time order list with actions |
| B2.4 | Customer PWA: store page with product list + WhatsApp button | `feat/member-b/store-page` | Store detail page |

---

## Sprint 3 — Polish + Demo (Days 13–15)

> **Goal:** End-to-end demo working. Prepare pitch.

### Both Members — Together

| # | Task | Who | Branch |
|---|---|---|---|
| 3.1 | End-to-end test: onboard → add products by voice → WhatsApp order → confirm | Both | `feat/demo-test` |
| 3.2 | Fix bugs from integration testing | Each in own dirs | `fix/<owner>/<bug>` |
| 3.3 | Deploy backend to Railway.app | Member A | `chore/member-a/deploy` |
| 3.4 | Deploy customer PWA to Vercel | Member B | `chore/member-b/deploy` |
| 3.5 | Build APK / Expo preview for vendor app | Member B | same |
| 3.6 | Record 2-minute demo video | Both | — |
| 3.7 | Prepare pitch deck (6 slides from PRD §9) | Both | — |

---

## Collision Prevention Summary

```
Days 1-3:   Member A → backend/     Member B → apps/         NO OVERLAP
Days 4-7:   Member A → backend/     Member B → apps/         ONE SYNC (API contract)
Days 8-12:  Member A → ai-services/ Member B → apps/         ONE SYNC (voice endpoint)
Days 13-15: Both → testing + deploy                          PAIR WORK
```

The only moments both devs touch the same thing:
1. **Sprint 1 start** — agree on API contracts in `shared-types/`
2. **Sprint 2 start** — agree on voice upload endpoint
3. **Sprint 3** — integration testing together

Everything else is fully parallel.
