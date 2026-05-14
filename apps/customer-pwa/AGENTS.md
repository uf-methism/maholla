# Customer PWA — AI Agent Context

> **Owner: Member B**
> If you are Member A's AI agent, **STOP. Do not modify anything in this directory.**

## What This Is

Vite + React SPA for customers. Lets neighbourhood customers discover nearby vendors, browse products, and place orders via WhatsApp. Deployed to Firebase Hosting as static files. No app install required.

## Tech Stack

- **Framework:** Vite + React
- **Language:** TypeScript
- **Styling:** Vanilla CSS (CSS Modules)
- **Routing:** react-router-dom (client-side)
- **Maps:** Google Maps JavaScript API or Mapbox GL JS
- **HTTP:** fetch to call backend API on Render
- **Hosting:** Firebase Hosting (static files)

## Key Pages

1. **Home / Discovery** — Hero section + "find stores near you" + category grid
2. **Store Page** — Vendor profile, product catalogue, UPI QR, WhatsApp order button
3. **Search** — Search vendors by name, category, or product

## Patterns to Follow

- **Components go in `src/components/`** — reusable UI building blocks
- **Pages go in `src/pages/`** — one file per route
- **Routing in `src/App.tsx`** using react-router-dom
- **All API types** come from `packages/shared-types/`
- **Responsive:** Mobile-first design. Most customers will access from phones.

## Files You Must NEVER Touch

- Anything in `backend/` or `ai-services/` (Member A's domain)
- `packages/shared-types/` (requires coordination — ask the human first)
