# MOHALLA

**Hyperlocal Vendor Digitalisation Platform**

---

**Product Requirements Document | v2.0**
**2nd Year B.Tech | Hackathon + MVP Edition**
**May 2026**

---

## 1. Executive Summary

Mohalla is a mobile-first SaaS platform that helps India's 13 million kirana stores, street vendors, and informal-sector service providers build a digital presence, manage inventory via voice, accept orders through WhatsApp, and access hyperlocal demand — all in under 5 minutes, without requiring a smartphone upgrade or tech literacy.

Unlike Dukaan (which targets e-commerce entrepreneurs) or Meesho (which is a reseller marketplace), Mohalla targets the genuinely informal, neighbourhood-level vendor who has never been onboarded by any digital platform. The key differentiator is an **AI-powered Hindi/regional-language voice assistant** that lets a vendor manage stock, orders, and customer messages by speaking — not typing.

> [!IMPORTANT]
> **Scope Boundaries (v2.0):** This PRD intentionally excludes integrated payment gateway processing (no Razorpay, Stripe, or any third-party payment orchestration) and identity-verification layers (no Aadhaar, selfie, or escrow systems). Payments are vendor-managed via their own UPI QR codes and cash-on-delivery.

---

## 2. Problem Statement & Competitor Gaps

### 2.1 The Unserved Market

India has **13 million kirana stores** generating **$800B in annual revenue**, yet fewer than 15,000 have any digital presence. Quick commerce (Blinkit, Zepto) is eroding their foot traffic. Existing platforms have failed to onboard them at scale because of the following gaps:

| Competitor Gap | What Went Wrong | Mohalla's Answer |
|---|---|---|
| English-only interfaces | All platforms default to English. 80% of target vendors are not English-literate. | Voice-first Hindi/regional language onboarding and management |
| Assumes tech literacy | Platforms require smartphone fluency. Most kirana owners use basic Android phones with slow internet. | Designed for sub-₹10K phones. Voice-driven, minimal typing. |
| No real support | Dukaan fired its entire support team (2025). Bots loop endlessly. Email takes 2+ days. | In-app WhatsApp support with AI triage. Human escalation SLA <2 hrs for paid tier. |
| Not built for informal vendors | Dukaan targets tech-savvy entrepreneurs. Meesho targets resellers. Neither serves the chai wala. | Designed for sub-₹10L/yr revenue vendors. No mandatory GST. Accepts COD natively. |
| Inventory = typing nightmare | Vendors must manually type product names, prices, quantities. Most give up. | Voice inventory: say *'ek kilo atta, do kilo chawal, teen packet namak'* and it auto-creates SKUs. |
| No hyperlocal discovery | Platforms are city or national scale. No neighbourhood-level search. | Locality-first discovery: customers find vendors within 500m–2km. Mohalla = your mohalla. |
| Fake listings / quality abuse | Meesho: 2,200+ consumer complaints; wrong products, fraud sellers rampant. | Community-driven moderation. Customer reviews gated to actual buyers only. |
| Scalability cliff | Vendors outgrow Dukaan quickly. No growth path. No analytics. | Freemium grows with vendor: Free → ₹299 Starter → ₹699 Growth. Analytics at scale. |

### 2.2 Root Cause Analysis

The two root causes that all competitors missed:

- **Root Cause 1 — Language barrier:** All platforms default to English interfaces. 80% of target vendors are not English-literate.
- **Root Cause 2 — Tech literacy gap:** Platforms assume smartphone fluency. Most kirana owners use basic Android phones with slow internet.

---

## 3. Product Overview

### 3.1 Target Users

| User Type | Profile | Primary Need |
|---|---|---|
| **Primary: Kirana Store Owner** | 30–55 yrs, Class 10–12 edu., semi-urban/urban, basic Android phone, UPI literate | Digital storefront + WhatsApp orders + inventory tracking |
| **Primary: Street Vendor / Hawker** | 25–50 yrs, mobile-only, no GST, cash-heavy, seasonal stock | Simple catalogue, QR display, order management |
| **Secondary: Neighbourhood Customer** | 18–45 yrs, locality-conscious, prefers to buy local vs Blinkit for trust | Discover nearby stores, order locally, track status |
| **Secondary: Service Provider** | Plumber, tailor, tutor, electrician. No product inventory. Time-based bookings. | Digital profile, booking calendar, contact collection |

### 3.2 Core Feature Set (MVP)

#### Feature 1: Voice-First Store Setup

- Onboarding via spoken Hindi/English — name, location, category, first 5 products
- AI transcribes and auto-fills store profile. Vendor confirms with a tap.
- WhatsApp OTP auth — no email required
- **Store live in under 5 minutes**

#### Feature 2: AI Inventory Assistant *(The Differentiator)*

- Voice commands: *'Aaj 20 kilo atta aaya, 5 kilo bika'* auto-updates stock
- Low-stock alerts via WhatsApp push notification
- Weekly demand prediction based on sales history
- Multilingual: Hindi, Hinglish, Telugu, Tamil, Marathi (Phase 2)

#### Feature 3: WhatsApp-Native Ordering

- Customers send orders via WhatsApp to vendor's Mohalla number
- AI parses natural language orders: *'Bhaiya 2 bread 1 butter bhejo'*
- Vendor confirms with one tap. Customer gets auto-update.
- No separate app install required for customers

#### Feature 4: Hyperlocal Discovery (Customer-Facing PWA)

- Map-first interface showing vendors within configurable radius (500m–5km)
- Category filters: Grocery, Vegetables, Dairy, Services, Food, Medicine
- Open/closed status synced from vendor app
- Real buyer reviews only (purchase-gated)

> [!NOTE]
> **Payments are vendor-managed.** Vendors use their own existing UPI QR codes (GPay, PhonePe, Paytm) for digital payments and accept cash-on-delivery. Mohalla displays the vendor's UPI QR on their store page and order confirmations but does **not** process, hold, or settle any funds. This keeps the platform lightweight, removes regulatory overhead, and leverages the UPI infrastructure vendors already trust.

---

## 4. Technical Architecture

### 4.1 Tech Stack

| Layer | Technology | Reason |
|---|---|---|
| Frontend (Vendor App) | React Native (Expo) | Single codebase for Android + iOS. Works on low-end devices. |
| Customer PWA | Next.js | No app install for customers. SEO-indexable store pages. |
| Backend API | Node.js + Express *or* FastAPI (Python) | FastAPI if AI features are primary. Express if speed of dev is priority. |
| Database | PostgreSQL (primary) + Redis (cache) | Relational for vendors/orders. Redis for session & inventory cache. |
| Voice AI | Whisper API (OpenAI) + Claude API | Whisper for speech-to-text. Claude for intent parsing + inventory updates. |
| WhatsApp Integration | WhatsApp Business Cloud API (Meta) | Free tier available. Native message parsing. |
| Maps | Google Maps API + Mapbox fallback | Locality-level geocoding. Store discovery pins. |
| Auth | Firebase Auth (OTP) | WhatsApp / phone OTP. No email dependency. |
| Hosting | Railway.app or Render (MVP) → AWS (scale) | Zero-config deploy for hackathon. Migrate on traction. |
| AI Infra | Claude API (Anthropic) | Inventory parsing, order understanding, support triage. |
| Analytics | PostHog (self-hosted) | Open-source. No cost. Vendor dashboard analytics. |

### 4.2 AI Features Specification

#### AI Feature 1: Voice Inventory Manager

- **Input:** Voice recording (via Whisper transcription) → **Output:** Structured inventory delta
- **Prompt:** *'Parse this vendor's spoken inventory update into a JSON delta with item name, quantity_change, unit. Infer units if not stated. Return only JSON.'*
- **Handles:** Natural numbers ('paanch packet'), brand names ('Maggi'), shorthand ('ek darz' = 12 pcs)
- **Fallback:** Shows parsed result for vendor to confirm before saving

#### AI Feature 2: WhatsApp Order Parser

- **Input:** Raw WhatsApp text from customer → **Output:** Structured order with items, quantities, delivery preference
- **Handles Hinglish:** *'bhaiya 2 bread aur ek amul butter chahiye, ghar pe de dena'*
- Multi-item order parsing with quantity normalisation
- **Ambiguity resolution:** Sends clarification message if item is unclear

#### AI Feature 3: Support Triage Bot

- **Input:** Vendor/customer support message → **Output:** Category + suggested resolution + escalation flag
- **Categories:** Order, Account, Product, Other
- Resolves common issues autonomously (order status updates, account help)
- Escalates to human agent if sentiment score is negative AND issue is unresolved
- *This directly solves Dukaan's most-cited failure: no human support*

---

## 5. Monetisation Model

> [!TIP]
> **Principle:** Trust before revenue. 90 days free for first vendors in any new locality.

### 5.1 Subscription Tiers

| Tier | Price | Features |
|---|---|---|
| **Free Forever** | ₹0/month | 1 store, 20 products, WhatsApp ordering, basic analytics, Mohalla discovery listing |
| **Starter** | ₹299/month | Unlimited products, voice inventory, low-stock alerts, priority support <2hrs, remove Mohalla branding |
| **Growth** | ₹699/month | Everything in Starter + demand forecasting, customer CRM, bulk WhatsApp broadcasts, staff accounts (3) |
| **Marketplace** *(future)* | 2% GMV commission | Mohalla handles delivery via tie-up with Porter/Dunzo. Vendor just fulfills. |
| **Working Capital** *(future)* | Partner revenue share | Credit line for inventory via NBFC partner based on Mohalla transaction history |

### 5.2 Unit Economics (Target)

| Metric | Year 1 (Hackathon MVP) | Year 2 (Post-traction) |
|---|---|---|
| Active vendors | 500 (1 city pilot) | 10,000 (3 cities) |
| Paid conversion | 15% | 25% |
| ARPU (paid) | ₹400/month | ₹500/month |
| MRR | ₹30,000 | ₹12,50,000 |
| CAC (via community) | ₹0 (referral) | ₹200 |
| Payback period | N/A (pre-revenue) | < 1 month |

---

## 6. Build Roadmap

### Phase 0: Pre-Hackathon Prep (Week 1–2)

> **Goal:** Research + Setup. Zero code yet.

- Interview 10 kirana owners in your area. Ask: *What phone do you use? Do you use WhatsApp for orders? What is your biggest daily pain?*
- Set up dev environment: Node.js, React Native (Expo Go), PostgreSQL local, WhatsApp Business API test account
- Get API keys: Anthropic (Claude), OpenAI (Whisper), Google Maps, Firebase
- Register GitHub org, set up repo with monorepo structure: `/apps/vendor`, `/apps/customer-pwa`, `/backend`, `/ai-services`
- Design Figma wireframes for 3 core screens: Onboarding, Inventory Dashboard, Order Inbox

### Phase 1: Hackathon MVP (Week 3–5 — 72-hour sprint)

> **Goal:** Working demo. Vendor can onboard, add products by voice, receive a WhatsApp order.

**Day 1 — Core Infrastructure**
- Backend: Express API with vendor, product, order endpoints. PostgreSQL schema live.
- Auth: Firebase phone OTP working
- Vendor app: React Native screens — Onboarding, Dashboard, Inventory list
- Customer PWA: Basic store page with product listing

**Day 2 — AI + Integration**
- Voice inventory: Record → Whisper transcription → Claude parsing → inventory update
- WhatsApp ordering: Webhook receives message → Claude parses → order created → vendor notified
- Maps: Vendor location pin on Google Maps / Mapbox

**Day 3 — Polish + Demo Prep**
- End-to-end test: Onboard → add 5 products by voice → place WhatsApp order → vendor confirms
- Deploy to Railway.app or Render with live URL
- Record 2-minute demo video as backup
- Prepare pitch: Problem → Market size → Demo → Differentiation from Dukaan → Revenue model → Ask

### Phase 2: Post-Hackathon Polish (Month 2–3)

> **Goal:** Real vendors using it. 50 stores live in one locality.

- Support system: Claude-powered triage + Slack/WhatsApp escalation to your team
- Analytics dashboard: Orders/day, revenue, low-stock alerts
- Customer reviews: Post-purchase gated review flow
- Referral system: Vendor gets 1 month free for each vendor they refer
- Localisation: Hindi UI throughout (React Native i18n)
- Performance: Offline-capable inventory (AsyncStorage sync) for low-connectivity areas

### Phase 3: Scale + Monetise (Month 4–6)

> **Goal:** First paying customers. 500 vendors. Launch Starter tier.

- Subscription billing via in-app payments for Starter and Growth tiers
- Demand forecasting model: Train on 90 days of sales data per vendor
- Multi-language voice: Add Telugu, Tamil, Marathi support via AI language detection
- Bulk WhatsApp broadcast: Vendors can message all customers about offers
- Porter/Dunzo delivery integration: Marketplace tier launch
- Pitch to angel investors / apply to Startup India, Y Combinator India program

---

## 7. AI-Assisted Development Guide

As a 2nd-year team, you can punch well above your weight by using AI tools aggressively throughout development.

### 7.1 Claude (Anthropic) — Your Senior Engineer

| Task | How to Use Claude | Prompt Template |
|---|---|---|
| Database schema design | Paste your requirements, ask for optimised Postgres schema | *'Design a PostgreSQL schema for a hyperlocal vendor platform with vendors, products, orders, customers, reviews. Include indexes. Return SQL.'* |
| API design | Ask for REST API spec before writing code | *'Design RESTful API endpoints for vendor inventory management. Return OpenAPI YAML.'* |
| Voice parsing logic | Give sample inputs, ask for parser | *'Parse this Hindi/English inventory update into JSON: [sample]. Handle brand names, units, shorthand.'* |
| Bug fixing | Paste error + code, ask for fix | *'This Express middleware returns 403 on valid JWT. Here is the code: [paste]. What is wrong?'* |
| Code review | Paste any module for review | *'Review this React Native component for performance issues, missing error handling, and accessibility.'* |
| WhatsApp webhook | Ask for full implementation | *'Write a Node.js Express webhook handler for WhatsApp Business Cloud API that parses incoming messages and saves to PostgreSQL.'* |

### 7.2 Other AI Tools by Development Phase

| Tool | Use Case | Why This Tool |
|---|---|---|
| Claude Code (CLI) | Generate entire feature modules end-to-end from terminal | Faster than chat for complex multi-file features like auth flows |
| v0.dev (Vercel) | Generate React/Next.js UI components from text description | Customer-facing PWA screens built in minutes |
| Cursor IDE | AI pair programmer — autocomplete whole functions, explain code | Fastest way to write backend routes and controllers |
| GitHub Copilot | Line-by-line autocomplete in VS Code | Good for boilerplate: test files, migrations, config |
| Whisper API | Voice-to-text transcription for inventory feature | Best accuracy for Indian English and Hinglish |
| Figma AI | Generate wireframes and auto-layout from description | Design all screens before coding to save rework |
| Postman AI | Auto-generate API test collections from your spec | Saves hours of manual API testing |
| Railway.app | One-click deploy of Node + Postgres + Redis stack | Zero DevOps for hackathon deployment |

### 7.3 Recommended AI Development Workflow

Follow this sequence for each new feature to maximise speed and quality:

1. **DESIGN:** Describe feature to Claude in plain English. Ask for user stories, edge cases, and data model changes.
2. **SPEC:** Ask Claude to produce API contract (input/output schema) before writing any code.
3. **BUILD:** Use Cursor or Claude Code to generate implementation against the spec.
4. **TEST:** Ask Claude to generate edge-case test inputs. Run them manually or with Postman.
5. **REVIEW:** Paste final code to Claude for security + performance review before merging.

---

## 8. Risks & Mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| Vendors don't adopt (trust issue) | High | Start with your own college area. Be present physically. Give 90 days free. |
| WhatsApp API rate limits | Medium | Use sandbox for demo. Upgrade Business API before launch. |
| Voice AI accuracy for Indian accents | Medium | Fine-tune with real vendor audio samples. Offer confirm-before-save UI. |
| Competitor copies the idea | High | Speed of execution + community moat. Get to 1,000 vendors before competitors notice. |
| Team bandwidth (2nd year coursework) | High | Scope hackathon MVP to 4 features max. Use AI tools to multiply output. |

---

## 9. Hackathon Pitch Structure

> **Target:** This structure works for Smart India Hackathon, Hack36, HackBMU, and most college-level hackathons.

**Slide 1 — Hook (30 seconds)**
> *'The chai wala outside your college makes ₹800 a day. Blinkit makes ₹800 per minute. We are going to change that.'*

**Slide 2 — Problem (45 seconds)**
- 13M kirana stores. $800B revenue. Less than 0.1% have a digital presence.
- Existing platforms (Dukaan, Meesho) built for entrepreneurs, not informal vendors.

**Slide 3 — Demo (2 minutes — this is everything)**
- Live demo: onboard a store by voice in Hindi, add 3 products by speaking, place a WhatsApp order, show it appear on vendor dashboard.

**Slide 4 — Differentiation**
- Voice-first. Hindi-native. WhatsApp-native. No GST required. Community-moderated.

**Slide 5 — Market + Revenue**
- ₹299/month. 13M TAM. If 0.1% convert = ₹46 Cr ARR.

**Slide 6 — Team + Ask**
- Your team. Your pilot plan (X vendors in Y days). What you need from judges/sponsors.

---

> **Mohalla PRD v2.0 | Team Strawhats | May 2026**
