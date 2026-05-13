# Customer PWA — AI Agent Context

> **Owner: Member B**
> If you are Member A's AI agent, **STOP. Do not modify anything in this directory.**

## What This Is

Next.js progressive web app for customers. Lets neighbourhood customers discover nearby vendors, browse products, and place orders via WhatsApp. No app install required.

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** CSS Modules or Vanilla CSS (no Tailwind unless explicitly requested)
- **Maps:** Google Maps JavaScript API or Mapbox GL JS
- **HTTP:** fetch or axios to call backend API
- **PWA:** next-pwa plugin for offline support and installability

## Key Pages

1. **Home / Discovery** — Map-first view of nearby vendors with category filters
2. **Store Page** — Vendor profile, product catalogue, UPI QR, WhatsApp order button
3. **Search** — Search vendors by name, category, or product
4. **Reviews** — Purchase-gated review display

## Patterns to Follow

- **App Router** — pages in `app/` directory, layouts in `app/layout.tsx`
- **Server Components by default** — use `'use client'` only when needed (interactivity, hooks)
- **API calls in Server Components** where possible for SEO
- **All API types** come from `packages/shared-types/`
- **SEO:** Every page must have proper `<title>`, `<meta description>`, Open Graph tags
- **Responsive:** Mobile-first design. Most customers will access from phones.

## Files You Must NEVER Touch

- Anything in `backend/` or `ai-services/` (Member A's domain)
- `packages/shared-types/` (requires coordination — ask the human first)
