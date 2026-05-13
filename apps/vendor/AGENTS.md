# Vendor App — AI Agent Context

> **Owner: Member B**
> If you are Member A's AI agent, **STOP. Do not modify anything in this directory.**

## What This Is

React Native (Expo) mobile app for vendors — kirana store owners, street vendors, and service providers. This is their primary interface for managing their store, inventory, and orders.

## Tech Stack

- **Framework:** React Native with Expo (managed workflow)
- **Language:** TypeScript
- **Navigation:** Expo Router (file-based routing)
- **State:** React Context + AsyncStorage for offline persistence
- **Auth:** Firebase Auth (phone OTP)
- **Voice:** expo-av for audio recording
- **Maps:** react-native-maps
- **HTTP:** axios or fetch to call backend API

## Key Screens

1. **Onboarding** — Voice-guided store setup (name, location, category, products)
2. **Dashboard** — Overview of orders, inventory alerts, store status
3. **Inventory** — Product list with voice-add button
4. **Orders** — Incoming WhatsApp orders with confirm/reject
5. **Settings** — Store profile, UPI QR upload, notification preferences

## Patterns to Follow

- **Components go in `src/components/`** — reusable UI building blocks
- **Screens go in `app/`** (Expo Router file-based routing)
- **API calls go in `src/api/`** — one file per backend resource (vendors.ts, products.ts, orders.ts)
- **All API request/response types** come from `packages/shared-types/`
- **Offline-first:** Critical data (inventory, store profile) cached in AsyncStorage
- **Voice recording:** Use `expo-av` Audio.Recording, send blob to backend → ai-services pipeline

## Files You Must NEVER Touch

- Anything in `backend/` or `ai-services/` (Member A's domain)
- `packages/shared-types/` (requires coordination — ask the human first)
