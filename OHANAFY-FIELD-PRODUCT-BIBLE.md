# Ohanafy Field — Product Engineering Bible v1.0

> **One engineer. One week. One shippable product.**
>
> This is not a hackathon slice. This is the complete engineering specification, day-by-day plan, test strategy, AI system design, and operational runbook for shipping Ohanafy Field — a world-class, offline-first, AI-powered field sales application — to the Apple App Store and Google Play Store.
>
> **How Claude Code starts every session:**
> *"Read OHANAFY-FIELD-PRODUCT-BIBLE.md from top to bottom. Load §22 operating procedure. Identify today's day from §9. Report the current day's target and your first action. Do not write code until you've confirmed the target."*

---

## Table of Contents

- [Preamble — What "Shippable" Means](#preamble--what-shippable-means)
- [§0 — Non-Negotiables](#0--non-negotiables)
- [§1 — Product Vision & Context](#1--product-vision--context)
- [§2 — Definition of Done](#2--definition-of-done)
- [§3 — Technical Architecture](#3--technical-architecture)
- [§4 — Complete Feature Specification](#4--complete-feature-specification)
- [§5 — Data Model](#5--data-model)
- [§6 — AI Intelligence & Learning System](#6--ai-intelligence--learning-system)
- [§7 — Offline-First Architecture](#7--offline-first-architecture)
- [§8 — ZPL Printing System](#8--zpl-printing-system)
- [§9 — 7-Day Engineering Plan](#9--7-day-engineering-plan)
- [§10 — Development Environment](#10--development-environment)
- [§11 — CI/CD Pipeline](#11--cicd-pipeline)
- [§12 — Testing Strategy](#12--testing-strategy)
- [§13 — Logging, Error Tracking & Observability](#13--logging-error-tracking--observability)
- [§14 — Accessibility](#14--accessibility)
- [§15 — Tablet & Large Screen Layouts](#15--tablet--large-screen-layouts)
- [§16 — Dark Mode & Theming](#16--dark-mode--theming)
- [§17 — Security & Privacy](#17--security--privacy)
- [§18 — Performance Targets & Optimization](#18--performance-targets--optimization)
- [§19 — In-App Onboarding](#19--in-app-onboarding)
- [§20 — In-App Help System](#20--in-app-help-system)
- [§21 — App Store Submission](#21--app-store-submission)
- [§22 — Claude Code Operating Procedure](#22--claude-code-operating-procedure)
- [§23 — Domain Conventions](#23--domain-conventions)
- [§24 — Architecture Decision Records](#24--architecture-decision-records)
- [§25 — Daily Retrospectives](#25--daily-retrospectives)
- [Appendix A — ZPL Template Library](#appendix-a--zpl-template-library)
- [Appendix B — AI System Prompts (Production)](#appendix-b--ai-system-prompts-production)
- [Appendix C — WatermelonDB Schema](#appendix-c--watermelondb-schema)
- [Appendix D — Salesforce Data Model](#appendix-d--salesforce-data-model)
- [Appendix E — Test Specification](#appendix-e--test-specification)
- [Appendix F — User Guide](#appendix-f--user-guide)
- [Appendix G — In-App Onboarding Script](#appendix-g--in-app-onboarding-script)

---

## Preamble — What "Shippable" Means

Shippable is not "it works on my phone." Every item in this checklist must be true before submission.

### Technical
- [ ] Zero P0 crashes in 30-minute smoke test on iPhone 15 Pro, iPhone SE 3, iPad Pro 12.9", Samsung Galaxy S24, Samsung Galaxy Tab S9
- [ ] All 5 core offline flows work in airplane mode
- [ ] Sync correctly processes a 50-item queue on reconnect with no data loss
- [ ] Voice commands achieve > 90% correct interpretation on 20-command test suite
- [ ] ZPL shelf talker prints correctly on ZQ520 (203dpi) and ZQ630 (300dpi)
- [ ] Unit test coverage ≥ 80% on all business logic packages
- [ ] E2E test suite covers 100% of named user flows in §4
- [ ] No unhandled promise rejections (zero in prod build Sentry)
- [ ] App launch time < 2.5s cold, < 0.8s warm (measured on iPhone SE 3 — slowest target)
- [ ] All list renders at 60fps (no Flashlist warnings in production)
- [ ] Memory usage < 150MB peak during full demo path
- [ ] All TypeScript `strict` mode, zero `any` types, zero `@ts-ignore`

### UX
- [ ] VoiceOver on iOS: all core flows navigable without sight
- [ ] TalkBack on Android: all core flows navigable without sight
- [ ] Dynamic Type (iOS) and font scaling (Android): UI doesn't break at largest accessibility text size
- [ ] All tap targets ≥ 44×44pt
- [ ] Keyboard avoidance works on all input screens
- [ ] Dark mode: full implementation, no hardcoded colors
- [ ] iPad split-view: master-detail layout at ≥ 768pt width
- [ ] Android tablet split-view: same threshold
- [ ] Landscape orientation: all screens usable in landscape

### Product
- [ ] In-app onboarding: new user reaches their first completed order in < 5 minutes
- [ ] In-app help: every major screen has contextual help accessible in ≤ 2 taps
- [ ] User guide: all 7 sections complete, searchable, available offline
- [ ] AI learning: visit prep insight improves measurably after 3+ corrections
- [ ] Push notifications: first visit reminder fires correctly
- [ ] Biometric lock: FaceID/TouchID/Fingerprint works on all target devices

### Store
- [ ] App Store privacy manifest complete (PrivacyInfo.xcprivacy)
- [ ] Google Play data safety section complete
- [ ] App Store screenshots: 6.7" iPhone, 12.9" iPad, 6.1" iPhone (3 screenshots each minimum)
- [ ] Google Play screenshots: phone + 7" tablet + 10" tablet
- [ ] App Store Review Guidelines compliance verified
- [ ] Google Play Policy compliance verified
- [ ] Bundle ID: com.ohanafy.field
- [ ] Version: 1.0.0, build 1

---

## §0 — Non-Negotiables

These override every other decision in this document. When a timer runs short, cut features before violating these.

1. **Offline is non-negotiable.** Every core user flow works without connectivity. No exceptions.
2. **Tests before features.** Write the test, then the implementation. TDD for all business logic.
3. **TypeScript strict mode everywhere.** `any` types are technical debt that becomes crashes at runtime.
4. **Accessibility is not a stretch goal.** VoiceOver and TalkBack support is part of the definition of done for every screen.
5. **AI outputs must be correctable.** Every AI-generated result has an Edit path. No locked AI outputs.
6. **AI never invents data.** AI can suggest, interpret, summarize. It never invents account names, SKUs, prices, or historical facts.
7. **Error boundaries on every screen.** An unhandled crash cannot take out the whole app.
8. **Credentials never in code.** Every secret lives in `.env.local` (dev) or EAS Secrets (CI/prod). Zero exceptions.
9. **Every commit must pass CI.** Green CI is the gate to merge. Flaky tests are fixed immediately.
10. **Day 7 is documentation and submission, not features.** Feature freeze is end of Day 6. No new features after that.

---

## §1 — Product Vision & Context

### 1.1 What Ohanafy Field is

A native mobile application (iOS + Android) for field sales representatives at beverage distributors and breweries. Built on top of Ohanafy's Salesforce-native platform, Ohanafy Field is the **field execution layer** that complements the back-office. It is not a mobile CRM — it is a selling tool that happens to sync to a CRM.

**The three things that make it different from every competitor:**

1. **Offline-first, everywhere.** Bar back-of-house, warehouse receiving dock, rural route — no signal is the norm. Ohanafy Field caches everything and works completely offline, syncing automatically the moment connectivity returns.

2. **AI voice assistant.** Reps place orders, log visit notes, and access account intelligence by speaking naturally while their hands are busy. The AI interprets commands, confirms with the rep, and applies them. It learns from corrections over time — the more you use it, the more accurate it gets for your specific patterns.

3. **Print on the spot.** Shelf talkers, product feature cards, and delivery receipts print to a Bluetooth Zebra printer (ZQ520/ZQ630) in seconds. The rep generates professional marketing materials and leaves them with the buyer before the competition even mails a flyer.

### 1.2 Platform context

**Ohanafy** is a Salesforce ISV building a 2GP managed package (`ohfy__` namespace) for the beverage industry. Ohanafy Field is a companion app — a React Native application that authenticates via Salesforce Connected App OAuth 2.0, reads and writes Ohanafy data, and introduces a set of new custom objects (`ohfy_field__` namespace) for field activities.

**Ohanafy Plan** (the companion FP&A product) is the planning layer. Field is the execution layer. They share the same data model and will share the same AI layer over time.

### 1.3 Target users

**Primary user:** Field sales representative at a beverage distributor or brewery. Visits 8–12 accounts per day. Drives 80–150 miles. Has a Zebra ZQ520 or ZQ630 printer on their belt. May have poor signal at most of their accounts.

**Secondary user:** Field sales manager. Reviews rep activity in Salesforce. Gets push notification summaries of team performance. Approves large orders from the app.

**Pilot customer:** Alabama-based beer + Red Bull distributor (Yellowhammer Beverage — fictional name for demo/development). Real pilot contacts are active design partners.

### 1.4 Platform targets

| Platform | Minimum OS | Target devices |
|---|---|---|
| iOS | iOS 16.0+ | iPhone SE 3 (smallest/slowest target), iPhone 14/15 series, iPad Pro 11", iPad Pro 12.9", iPad Air |
| Android | Android 10 (API 29)+ | Samsung Galaxy S series, Samsung Galaxy Tab S9, Zebra TC52/TC57 (enterprise Android) |

---

## §2 — Definition of Done

### Per-feature DoD

A feature is done when:
1. Implementation complete and reviewed
2. Unit tests written and green (coverage ≥ 80% for the changed module)
3. E2E test added to the Maestro flow for this feature
4. Accessibility labels and hints added (VoiceOver/TalkBack)
5. Dark mode tested
6. Tablet layout tested
7. Offline behavior tested (feature works in airplane mode)
8. Error state implemented (what happens when it fails)
9. Loading state implemented (skeleton or spinner)
10. Empty state implemented (what happens when there's no data)

### Per-day DoD

Each day ends with:
1. All that day's targets from §9 committed to `main`
2. CI green
3. Daily retrospective filled in §25
4. Sentry showing no new P0 errors
5. Tomorrow's first two targets reviewed and understood

---

## §3 — Technical Architecture

### 3.1 Stack overview

```
┌─────────────────────────────────────────────────────────────┐
│                    OHANAFY FIELD APP                         │
│              React Native (Expo SDK 52, TypeScript)          │
├─────────────────┬───────────────────┬───────────────────────┤
│   Presentation  │   Business Logic  │     Infrastructure     │
│                 │                   │                        │
│  Expo Router v3 │  WatermelonDB     │  EAS Build             │
│  NativeWind v4  │  (local SQLite)   │  EAS Submit            │
│  RN Reanimated  │  React Query v5   │  Sentry                │
│  FlashList      │  Zustand          │  PostHog               │
│  React Native   │  Zod validation   │  Datadog (optional)    │
│  Gesture Handler│  date-fns         │                        │
├─────────────────┼───────────────────┼───────────────────────┤
│  Native APIs    │  AI Layer         │  External Services     │
│                 │                   │                        │
│  expo-speech    │  Anthropic SDK    │  Salesforce (SF)       │
│  (voice input)  │  Claude Sonnet    │  Labelary (ZPL prev)   │
│  Zebra Link-OS  │  Tool use         │                        │
│  (BT printing)  │  Streaming        │                        │
│  expo-secure-   │  Memory system    │                        │
│  store          │  (WatermelonDB)   │                        │
│  expo-local-    │  Learning agents  │                        │
│  authentication │                   │                        │
│  expo-notif.    │                   │                        │
└─────────────────┴───────────────────┴───────────────────────┘
```

### 3.2 Package decisions (locked — do not debate)

| Decision | Choice | Locked rationale |
|---|---|---|
| Framework | **Expo SDK 52 + React Native** | True native iOS/Android; App Store submission; native Bluetooth; native voice |
| Navigation | **Expo Router v3** | File-based, type-safe, deep-linking, URL-based tab history |
| Styling | **NativeWind v4** | Tailwind syntax in React Native; Ohanafy brand tokens as Tailwind config |
| Local DB | **WatermelonDB** | SQLite-backed offline-first DB built for React Native; reactive queries; migrations |
| Server state | **TanStack Query v5** | Caching + background refresh for Salesforce sync |
| Client state | **Zustand v4** | Minimal, TypeScript-first; for voice state machine, UI state |
| List rendering | **Shopify FlashList** | 5–10× faster than FlatList for account lists; virtualized; required for 60fps |
| Animations | **React Native Reanimated v3** | 60fps animations on JS thread; required for voice pulsing, sync animations |
| Gestures | **React Native Gesture Handler** | Required peer dep of Reanimated; better swipe interactions |
| Voice input | **@react-native-voice/voice** | On-device voice recognition; iOS SFSpeechRecognizer + Android SpeechRecognizer |
| ZPL printing | **Expo Modules (custom)** wrapping Zebra Link-OS SDK | Only way to get Zebra's official iOS/Android SDK in Expo; write once in Day 3 |
| Auth | **expo-auth-session** + **expo-secure-store** | OAuth 2.0 PKCE flow; secure token storage in iOS Keychain / Android Keystore |
| Biometrics | **expo-local-authentication** | FaceID, TouchID, Fingerprint — single API |
| Push | **expo-notifications** | Unified iOS APNs + Android FCM via Expo Push Service |
| Error tracking | **Sentry React Native** | Crash reporting, performance traces, session replay |
| Analytics | **PostHog React Native** | Product analytics; self-hosted option; GDPR-friendly |
| E2E testing | **Maestro** | Best mobile E2E framework; YAML flows; device-independent |
| Unit testing | **Jest + React Native Testing Library** | Standard RN testing; WatermelonDB has first-class Jest support |
| CI/CD | **EAS Build + Submit + GitHub Actions** | Native builds in CI; App Store + Play Store submission automation |
| ZPL preview | **Labelary REST API** | Free, no auth; renders ZPL → PNG for in-app preview |

### 3.3 Monorepo structure

```
ohanafy-field/
├── OHANAFY-FIELD-PRODUCT-BIBLE.md   ← this doc
├── CLAUDE.md                         ← Claude Code session context
├── package.json                      ← Expo project root
├── app.json                          ← Expo app config
├── eas.json                          ← EAS build profiles
├── tsconfig.json                     ← TypeScript strict config
├── tailwind.config.js                ← NativeWind + brand tokens
├── babel.config.js
├── metro.config.js                   ← WatermelonDB + NativeWind
├── .env.local                        ← secrets (gitignored)
├── .env.example                      ← committed; all keys blank
├── .claude/                          ← Claude Code harness
│   ├── settings.json
│   ├── rules/
│   ├── agents/
│   ├── skills/
│   ├── commands/
│   └── hooks/
├── .github/
│   └── workflows/
│       ├── ci.yml                    ← Jest + type check + Maestro
│       ├── eas-preview.yml           ← EAS Preview build on PR
│       └── eas-production.yml        ← EAS Production build on tag
├── app/                              ← Expo Router file-based routes
│   ├── _layout.tsx                   ← Root layout (auth guard, theme)
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   ├── login.tsx                 ← Salesforce OAuth entry
│   │   └── biometric.tsx             ← Biometric unlock screen
│   ├── (tabs)/
│   │   ├── _layout.tsx               ← Tab bar layout
│   │   ├── index.tsx                 ← Account list (home)
│   │   ├── route.tsx                 ← Today's route map
│   │   ├── orders.tsx                ← Order history
│   │   └── settings.tsx              ← Rep settings + help
│   ├── account/
│   │   ├── [id].tsx                  ← Account detail (phone)
│   │   └── [id]-tablet.tsx           ← Account detail (tablet split)
│   ├── order/
│   │   ├── [id].tsx                  ← Order entry / edit
│   │   └── [id]/confirm.tsx          ← Order confirmation
│   ├── visit/
│   │   └── [id].tsx                  ← Visit log / note entry
│   ├── label/
│   │   ├── select.tsx                ← Label type selector
│   │   ├── preview.tsx               ← ZPL preview + print
│   │   └── history.tsx               ← Print history
│   ├── guide/
│   │   ├── _layout.tsx               ← In-app user guide layout
│   │   ├── index.tsx                 ← Guide table of contents
│   │   └── [section].tsx             ← Guide sections
│   └── onboarding/
│       ├── _layout.tsx
│       ├── welcome.tsx
│       ├── connect.tsx               ← Salesforce connection
│       ├── printer.tsx               ← Zebra printer pairing
│       └── first-visit.tsx           ← Guided first visit
├── src/
│   ├── components/
│   │   ├── account/
│   │   │   ├── AccountCard.tsx
│   │   │   ├── AccountList.tsx
│   │   │   ├── AccountDetail.tsx
│   │   │   ├── InsightBanner.tsx
│   │   │   ├── VisitHistory.tsx
│   │   │   └── AccountSearch.tsx
│   │   ├── order/
│   │   │   ├── OrderEntry.tsx
│   │   │   ├── LineItem.tsx
│   │   │   ├── ProductPicker.tsx
│   │   │   └── OrderSummary.tsx
│   │   ├── voice/
│   │   │   ├── VoiceButton.tsx
│   │   │   ├── TranscriptDisplay.tsx
│   │   │   ├── CommandFeedback.tsx
│   │   │   └── VoiceStateMachine.ts
│   │   ├── zpl/
│   │   │   ├── LabelSelector.tsx
│   │   │   ├── LabelPreview.tsx
│   │   │   └── PrintButton.tsx
│   │   ├── sync/
│   │   │   ├── SyncStatusBar.tsx
│   │   │   ├── OfflineBanner.tsx
│   │   │   └── SyncQueueIndicator.tsx
│   │   ├── ai/
│   │   │   ├── FeedbackCapture.tsx   ← thumbs up/down + correction
│   │   │   └── MemoryBadge.tsx       ← "customer-calibrated" indicator
│   │   ├── onboarding/
│   │   │   ├── CoachMark.tsx
│   │   │   └── OnboardingStep.tsx
│   │   └── shared/
│   │       ├── ErrorBoundary.tsx
│   │       ├── LoadingSkeleton.tsx
│   │       ├── EmptyState.tsx
│   │       ├── Toast.tsx
│   │       └── HelpButton.tsx
│   ├── db/
│   │   ├── schema.ts                 ← WatermelonDB schema (Appendix C)
│   │   ├── migrations/               ← Versioned migrations
│   │   ├── models/
│   │   │   ├── Account.ts
│   │   │   ├── Product.ts
│   │   │   ├── Order.ts
│   │   │   ├── OrderLine.ts
│   │   │   ├── Visit.ts
│   │   │   ├── LabelPrint.ts
│   │   │   ├── SyncQueueItem.ts
│   │   │   ├── Memory.ts             ← AI memory store
│   │   │   └── FeedbackEvent.ts      ← AI feedback events
│   │   └── repositories/
│   │       ├── accounts.ts
│   │       ├── orders.ts
│   │       ├── visits.ts
│   │       ├── sync-queue.ts
│   │       └── memories.ts
│   ├── ai/
│   │   ├── client.ts                 ← Anthropic SDK singleton
│   │   ├── tools/
│   │   │   ├── interpret-order.ts    ← Tool def + handler
│   │   │   ├── interpret-note.ts
│   │   │   ├── get-account-intel.ts
│   │   │   ├── suggest-label.ts
│   │   │   └── index.ts              ← All tools exported
│   │   ├── agents/
│   │   │   ├── command-agent.ts      ← Voice command interpreter
│   │   │   ├── visit-prep-agent.ts   ← Pre-call intelligence
│   │   │   ├── note-agent.ts         ← Note cleanup + summarization
│   │   │   ├── learning-agent.ts     ← Background memory synthesis
│   │   │   └── index.ts
│   │   ├── memory/
│   │   │   ├── retriever.ts          ← Fetch relevant memories for context
│   │   │   ├── writer.ts             ← Store new memories
│   │   │   ├── synthesizer.ts        ← Batch synthesize from feedback events
│   │   │   └── types.ts
│   │   └── prompts/
│   │       ├── command.ts
│   │       ├── visit-prep.ts
│   │       ├── note-cleanup.ts
│   │       └── memory-synthesis.ts
│   ├── sync/
│   │   ├── engine.ts                 ← Main sync orchestrator
│   │   ├── sf-client.ts              ← Salesforce REST API client
│   │   ├── conflict-resolver.ts      ← Conflict resolution logic
│   │   ├── queue-processor.ts        ← Process sync_queue items
│   │   └── background-sync.ts        ← Background app refresh handler
│   ├── zpl/
│   │   ├── templates/
│   │   │   ├── shelf-talker.ts
│   │   │   ├── product-card.ts
│   │   │   └── delivery-receipt.ts
│   │   ├── preview.ts                ← Labelary API caller
│   │   ├── printer.ts                ← Zebra native module wrapper
│   │   └── index.ts
│   ├── auth/
│   │   ├── sf-oauth.ts               ← Salesforce OAuth PKCE flow
│   │   ├── token-manager.ts          ← Token refresh logic
│   │   └── biometric.ts              ← Local authentication
│   ├── hooks/
│   │   ├── useOfflineStatus.ts
│   │   ├── useSyncQueue.ts
│   │   ├── useVoice.ts
│   │   ├── useAccount.ts
│   │   ├── useOrder.ts
│   │   ├── useVisit.ts
│   │   ├── useMemories.ts
│   │   ├── useTabletLayout.ts
│   │   └── useTheme.ts
│   ├── store/
│   │   ├── voice-store.ts            ← Zustand: voice state machine
│   │   ├── sync-store.ts             ← Zustand: sync status
│   │   └── onboarding-store.ts       ← Zustand: onboarding progress
│   ├── utils/
│   │   ├── beverage.ts               ← Domain math (cases→bbl, etc.)
│   │   ├── format.ts                 ← Currency, date, weight formatters
│   │   ├── accessibility.ts          ← a11y helper utilities
│   │   └── logger.ts                 ← Structured logger → Sentry
│   └── constants/
│       ├── theme.ts                  ← Brand tokens (Ohanafy colors)
│       ├── config.ts                 ← App config constants
│       └── routes.ts                 ← Named route constants
├── modules/
│   └── zebra-link-os/                ← Custom Expo native module
│       ├── ios/
│       │   └── ZebraLinkOsModule.swift
│       ├── android/
│       │   └── ZebraLinkOsModule.kt
│       ├── src/
│       │   ├── ZebraLinkOs.ts
│       │   └── ZebraLinkOs.types.ts
│       └── index.ts
├── __tests__/
│   ├── unit/
│   │   ├── ai/
│   │   ├── zpl/
│   │   ├── sync/
│   │   └── utils/
│   └── integration/
│       ├── db/
│       └── sync/
└── maestro/
    ├── flows/
    │   ├── onboarding.yaml
    │   ├── account-visit.yaml        ← The main happy path
    │   ├── voice-order.yaml
    │   ├── offline-sync.yaml
    │   ├── zpl-print.yaml
    │   └── ai-correction-learning.yaml
    └── utils/
        └── seed-data.yaml
```

### 3.4 Architecture principles

**Offline-first (not offline-capable):** The app works offline by default. Online connectivity is a bonus that enables sync. Not the reverse.

**AI at the edge:** AI calls happen from the device via the Anthropic API directly. No intermediate server. This keeps latency low and architecture simple. The API key is stored in `expo-secure-store` and loaded at runtime — never hardcoded.

**AI API key management:** The Anthropic API key is provisioned per-company (not per-rep). It's stored in Salesforce as a Connected App secret, retrieved during auth flow, and stored in SecureStore on the device. This keeps key management in Salesforce's hands where IT already manages credentials.

**Memory as a first-class object:** AI memories are WatermelonDB records. They sync to Salesforce. They travel with the rep's account. If a rep gets a new phone, their AI memories restore on first sync.

**Never trust AI output for financial data:** AI can interpret a command, suggest a product, or summarize a note. It cannot create or modify orders without explicit rep confirmation. Every AI-generated order change requires a tap to accept.

---

## §4 — Complete Feature Specification

### 4.1 Feature inventory

| ID | Feature | Priority | Day target |
|---|---|---|---|
| F01 | Salesforce OAuth 2.0 auth | P0 | Day 1 |
| F02 | Biometric app lock (FaceID/TouchID/Fingerprint) | P0 | Day 1 |
| F03 | Account list (offline-first, search, filter) | P0 | Day 2 |
| F04 | Account detail (history, metrics, contact) | P0 | Day 2 |
| F05 | Order entry (line items, quantities, voice) | P0 | Day 2 |
| F06 | Visit logging (notes, voice, photos) | P0 | Day 2 |
| F07 | Offline sync engine (queue + auto-flush) | P0 | Day 2 |
| F08 | Voice command — order entry | P0 | Day 3 |
| F09 | Voice command — visit notes | P0 | Day 3 |
| F10 | AI visit prep (pre-call insight) | P0 | Day 3 |
| F11 | AI note cleanup | P1 | Day 3 |
| F12 | AI selling intelligence (gap analysis) | P1 | Day 3 |
| F13 | AI memory system (learns from corrections) | P1 | Day 4 |
| F14 | AI learning agent (background synthesis) | P1 | Day 4 |
| F15 | ZPL shelf talker generation + print | P0 | Day 4 |
| F16 | ZPL product card generation + print | P1 | Day 4 |
| F17 | ZPL delivery receipt generation + print | P1 | Day 4 |
| F18 | ZPL label preview (Labelary) | P0 | Day 4 |
| F19 | Push notifications (visit reminders) | P1 | Day 4 |
| F20 | Today's route view | P1 | Day 5 |
| F21 | Order history | P1 | Day 5 |
| F22 | In-app onboarding (first-run wizard) | P0 | Day 5 |
| F23 | Coach marks (contextual tips, dismissible) | P1 | Day 5 |
| F24 | In-app user guide (7 sections, searchable) | P0 | Day 5 |
| F25 | Dark mode (full implementation) | P0 | Day 5 |
| F26 | Tablet split layout (iPad + Android tablet) | P0 | Day 6 |
| F27 | VoiceOver / TalkBack full support | P0 | Day 6 |
| F28 | Performance optimization pass | P0 | Day 6 |
| F29 | E2E test suite (Maestro) | P0 | Day 6 |
| F30 | App Store + Play Store submission | P0 | Day 7 |

### 4.2 Feature specs (acceptance criteria)

**F03 — Account List**
- Renders from WatermelonDB (offline)
- Search: real-time filter by account name, contact name, city — debounced 200ms
- Filter: by account type (on-premise / off-premise chain / off-premise indie / convenience) and by "needs attention" (> 21 days since last order)
- Sort: alphabetical (default), last visit date, last order amount
- Account card shows: name, account type badge, last order date, last visit note excerpt (1 line), "needs attention" indicator
- Empty state: "No accounts cached. Connect to sync your territory."
- Loading skeleton: 6 card-shaped skeletons, 200ms delay before showing (prevents flash)
- FlashList with `estimatedItemSize={110}`
- Tablet: account list is the master panel; tapping an account opens detail in the right panel without navigation

**F05 — Order Entry**
- Launched from account detail
- Product list loaded from WatermelonDB (offline)
- Products grouped by category (Beer Kegs / Beer Cases / Energy / Other)
- Line item: product name, unit label, quantity stepper (+/-), unit price, line total
- Running order total in sticky header
- Add product: search/filter dialog that opens from FAB
- Voice: VoiceButton in bottom right; voice adds/modifies line items
- Swipe left on line item: delete
- Save to WatermelonDB immediately; add to sync_queue
- Confirm screen: shows all items, total, delivery date picker, notes field, "Place Order" CTA
- Order placed offline shows "Pending Sync" badge
- Submitted to Salesforce on next sync

**F08 — Voice Command (Order Entry)**
- Tap mic button: starts listening (VoiceButton state machine)
- Interim transcript shows in real time as rep speaks
- Silence for 1.5s or tap again: stop listening, send to AI
- AI returns CommandAction (ADD_TO_ORDER / MODIFY_QTY / REMOVE_ITEM / UNKNOWN)
- CommandFeedback card animates in: shows action summary + "Accept" / "Edit" / "Undo" buttons
- Accept: applies to order, stores FeedbackEvent(type=accepted)
- Edit: opens inline editor for that line item, stores FeedbackEvent(type=edited, correction=...)
- Undo: reverts the change, stores FeedbackEvent(type=rejected)
- FeedbackEvents feed the learning agent (F14)
- AI must not apply any change until Accept is tapped — optimistic display only

**F10 — AI Visit Prep**
- Fires when account detail screen loads
- POST to Anthropic API with account context + relevant memories injected
- InsightBanner renders with: insight text, suggested SKUs (1–3), urgency indicator
- Skeleton shimmer while loading; hidden if call takes > 3s (non-blocking)
- Insight has FeedbackCapture: thumbs up / thumbs down / "Edit insight"
- Positive feedback reinforces the pattern in memory
- Negative feedback + edit stores correction for learning agent
- "customer-calibrated" badge if relevant memories influenced this insight
- Each insight is stored in WatermelonDB for visit history

**F13 — AI Memory System**
- `memories` table stores: category, key, value, confidence (0–1), source (user_correction / learning_agent / onboarding), created_at, last_used_at, use_count
- Memory categories: COMMAND_PATTERN, ACCOUNT_PREFERENCE, PRODUCT_PREFERENCE, TIMING_PATTERN, NOTE_STYLE, INSIGHT_CALIBRATION
- Memories injected into AI context window at call time (relevant subset only — top 5 by recency + use_count for each category)
- Memory retriever filters by category and repId — memories are per-rep, not global
- Memory writer: captures direct corrections, explicit feedback, high-confidence learning outputs
- Confidence degrades: memories not used in 60 days drop confidence by 0.1/week
- Memories sync to Salesforce (survive device change)
- Rep can view, edit, and delete memories in Settings → "AI Memory"

**F15 — ZPL Shelf Talker**
- Launched from account detail or order entry
- Product selector: filtered to products in the account's recent orders
- Template: shelf talker, product card, delivery receipt (see Appendix A)
- Preview: Labelary API renders ZPL → PNG displayed in-app
- Print: sends ZPL string to paired Zebra via Zebra Link-OS native module
- Print log: every print stored in `label_prints` table (product, template, timestamp, printer serial)
- If no printer paired: shows "Pair a Printer" prompt
- If Labelary unavailable (offline): shows "Preview requires connection. Print still works." with the raw ZPL in a monospace scroll view as fallback

**F22 — In-App Onboarding**
- Triggered on first launch after auth
- Steps: Welcome → Connect Salesforce (already done) → About Your Territory (rep confirms/edits) → Pair Printer (skip option) → First Account Visit (guided tour with coach marks) → Done
- Coach marks: Tooltip bubbles pointing to UI elements with dismiss on tap
- Progress: 5-dot indicator; can be skipped at any step
- Re-launchable from Settings → "Restart Onboarding"
- Completion stored in SecureStore (survives reinstall = no; that's intentional)

---

## §5 — Data Model

Full WatermelonDB schema is in Appendix C. This section covers the key design decisions.

### 5.1 WatermelonDB overview

WatermelonDB is a SQLite-backed, reactive, offline-first ORM for React Native. Records are observed via reactive queries — the UI re-renders automatically when data changes. This is the right foundation for a sync-heavy app.

```typescript
// src/db/schema.ts — complete schema (also see Appendix C)

import { appSchema, tableSchema } from '@nozbe/watermelondb';

export default appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'accounts',
      columns: [
        { name: 'sf_id', type: 'string', isIndexed: true },
        { name: 'name', type: 'string', isIndexed: true },
        { name: 'account_type', type: 'string', isIndexed: true },   // on_premise | off_premise_chain | off_premise_indie | convenience
        { name: 'channel', type: 'string' },
        { name: 'territory_id', type: 'string', isIndexed: true },
        { name: 'contact_name', type: 'string' },
        { name: 'contact_title', type: 'string' },
        { name: 'contact_phone', type: 'string' },
        { name: 'address_street', type: 'string' },
        { name: 'address_city', type: 'string' },
        { name: 'address_state', type: 'string' },
        { name: 'latitude', type: 'number', isOptional: true },
        { name: 'longitude', type: 'number', isOptional: true },
        { name: 'last_order_date', type: 'number', isOptional: true },    // Unix timestamp
        { name: 'last_visit_date', type: 'number', isOptional: true },
        { name: 'days_since_last_order', type: 'number' },
        { name: 'ytd_revenue', type: 'number' },
        { name: 'needs_attention', type: 'boolean', isIndexed: true },    // > 21 days since last order
        { name: 'synced_at', type: 'number' },                            // last full sync
        { name: 'is_archived', type: 'boolean' },
      ],
    }),
    tableSchema({
      name: 'products',
      columns: [
        { name: 'sf_id', type: 'string', isIndexed: true },
        { name: 'name', type: 'string', isIndexed: true },
        { name: 'category', type: 'string', isIndexed: true },
        { name: 'unit', type: 'string' },                                  // keg | case
        { name: 'unit_label', type: 'string' },
        { name: 'price_per_unit', type: 'number' },
        { name: 'supplier_id', type: 'string' },
        { name: 'sku_code', type: 'string' },
        { name: 'is_active', type: 'boolean' },
        { name: 'image_url', type: 'string', isOptional: true },
      ],
    }),
    tableSchema({
      name: 'orders',
      columns: [
        { name: 'sf_id', type: 'string', isOptional: true, isIndexed: true },  // null until synced
        { name: 'account_id', type: 'string', isIndexed: true },               // WDB local id
        { name: 'account_sf_id', type: 'string' },
        { name: 'rep_id', type: 'string', isIndexed: true },
        { name: 'status', type: 'string', isIndexed: true },                   // draft | pending_sync | synced | submitted | cancelled
        { name: 'order_date', type: 'number' },
        { name: 'delivery_date', type: 'number', isOptional: true },
        { name: 'total_amount', type: 'number' },
        { name: 'notes', type: 'string', isOptional: true },
        { name: 'sync_status', type: 'string', isIndexed: true },              // pending | syncing | synced | failed
        { name: 'sync_attempts', type: 'number' },
        { name: 'created_offline', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'order_lines',
      columns: [
        { name: 'order_id', type: 'string', isIndexed: true },
        { name: 'product_id', type: 'string', isIndexed: true },
        { name: 'product_sf_id', type: 'string' },
        { name: 'product_name', type: 'string' },
        { name: 'quantity', type: 'number' },
        { name: 'unit', type: 'string' },
        { name: 'unit_price', type: 'number' },
        { name: 'line_total', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'visits',
      columns: [
        { name: 'sf_id', type: 'string', isOptional: true, isIndexed: true },
        { name: 'account_id', type: 'string', isIndexed: true },
        { name: 'account_sf_id', type: 'string' },
        { name: 'rep_id', type: 'string', isIndexed: true },
        { name: 'visit_date', type: 'number', isIndexed: true },
        { name: 'duration_minutes', type: 'number', isOptional: true },
        { name: 'note', type: 'string', isOptional: true },
        { name: 'raw_transcript', type: 'string', isOptional: true },
        { name: 'ai_insight', type: 'string', isOptional: true },               // what the AI surfaced pre-call
        { name: 'insight_feedback', type: 'string', isOptional: true },         // accepted | edited | rejected
        { name: 'order_id', type: 'string', isOptional: true },                 // if an order was placed
        { name: 'sync_status', type: 'string', isIndexed: true },
        { name: 'sync_attempts', type: 'number' },
        { name: 'created_offline', type: 'boolean' },
      ],
    }),
    tableSchema({
      name: 'label_prints',
      columns: [
        { name: 'account_id', type: 'string', isIndexed: true },
        { name: 'product_id', type: 'string', isOptional: true },
        { name: 'template_type', type: 'string' },                              // shelf_talker | product_card | delivery_receipt
        { name: 'product_name', type: 'string' },
        { name: 'printer_serial', type: 'string', isOptional: true },
        { name: 'printed_at', type: 'number' },
        { name: 'zpl_snapshot', type: 'string' },                               // the ZPL string that was printed
        { name: 'sync_status', type: 'string' },
      ],
    }),
    tableSchema({
      name: 'sync_queue',
      columns: [
        { name: 'operation_type', type: 'string', isIndexed: true },            // CREATE_ORDER | UPDATE_ORDER | CREATE_VISIT | UPDATE_VISIT | CREATE_LABEL_LOG
        { name: 'entity_type', type: 'string', isIndexed: true },
        { name: 'entity_id', type: 'string', isIndexed: true },                 // WDB local id
        { name: 'payload_json', type: 'string' },
        { name: 'status', type: 'string', isIndexed: true },                    // pending | processing | done | failed
        { name: 'attempts', type: 'number' },
        { name: 'last_error', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number', isIndexed: true },
        { name: 'processed_at', type: 'number', isOptional: true },
      ],
    }),
    tableSchema({
      name: 'memories',
      columns: [
        { name: 'rep_id', type: 'string', isIndexed: true },
        { name: 'account_id', type: 'string', isOptional: true, isIndexed: true },  // null = global rep memory
        { name: 'category', type: 'string', isIndexed: true },                   // COMMAND_PATTERN | ACCOUNT_PREFERENCE | etc.
        { name: 'key', type: 'string', isIndexed: true },
        { name: 'value', type: 'string' },                                        // JSON string
        { name: 'confidence', type: 'number' },                                   // 0.0–1.0
        { name: 'source', type: 'string' },                                       // user_correction | learning_agent | onboarding
        { name: 'use_count', type: 'number' },
        { name: 'last_used_at', type: 'number', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'sf_id', type: 'string', isOptional: true },
        { name: 'sync_status', type: 'string' },
      ],
    }),
    tableSchema({
      name: 'feedback_events',
      columns: [
        { name: 'rep_id', type: 'string', isIndexed: true },
        { name: 'account_id', type: 'string', isOptional: true, isIndexed: true },
        { name: 'event_type', type: 'string', isIndexed: true },                  // command_accepted | command_edited | command_rejected | insight_accepted | insight_edited | insight_rejected
        { name: 'ai_output', type: 'string' },                                    // what the AI produced (JSON)
        { name: 'user_correction', type: 'string', isOptional: true },            // what the rep changed it to (if edited)
        { name: 'context_json', type: 'string' },                                 // account context at the time
        { name: 'created_at', type: 'number', isIndexed: true },
        { name: 'synthesized', type: 'boolean', isIndexed: true },                // has learning agent processed this?
      ],
    }),
  ],
});
```

### 5.2 WatermelonDB model classes (pattern — all follow this)

```typescript
// src/db/models/Account.ts
import { Model, field, date, readonly, children } from '@nozbe/watermelondb/decorators';
import type { Query, Relation } from '@nozbe/watermelondb';
import Order from './Order';
import Visit from './Visit';

export default class Account extends Model {
  static table = 'accounts';
  static associations = {
    orders: { type: 'has_many' as const, foreignKey: 'account_id' },
    visits: { type: 'has_many' as const, foreignKey: 'account_id' },
  };

  @field('sf_id') sfId!: string;
  @field('name') name!: string;
  @field('account_type') accountType!: 'on_premise' | 'off_premise_chain' | 'off_premise_indie' | 'convenience';
  @field('contact_name') contactName!: string;
  @field('last_order_date') lastOrderDateTs!: number | null;
  @field('days_since_last_order') daysSinceLastOrder!: number;
  @field('needs_attention') needsAttention!: boolean;
  @field('ytd_revenue') ytdRevenue!: number;
  @readonly @date('created_at') createdAt!: Date;

  @children('orders') orders!: Query<Order>;
  @children('visits') visits!: Query<Visit>;

  get lastOrderDate(): Date | null {
    return this.lastOrderDateTs ? new Date(this.lastOrderDateTs) : null;
  }
}
```

---

## §6 — AI Intelligence & Learning System

### 6.1 Architecture summary

```
                    ┌─────────────────────────────────┐
                    │         AI CALL PIPELINE         │
                    │                                  │
User input (voice)  │  1. Retrieve relevant memories   │
       ↓            │     from WatermelonDB (< 5ms)    │
Voice recognition   │                                  │
(on-device)         │  2. Build context window:        │
       ↓            │     - System prompt              │
Transcript text     │     - Account context            │
       ↓            │     - Top 5 memories per cat.    │
AI Agent call  →→→  │     - Recent FeedbackEvents      │
                    │                                  │
Claude API          │  3. Call Claude Sonnet           │
(Anthropic)         │     with tool_use                │
       ↓            │                                  │
Tool result         │  4. Tool handler executes        │
       ↓            │     (pure TypeScript, no AI)     │
Structured output   │                                  │
       ↓            │  5. Return CommandResponse       │
Display to rep      └─────────────────────────────────┘
       ↓
Rep feedback (Accept / Edit / Reject)
       ↓
FeedbackEvent stored in WatermelonDB
       ↓
Learning agent runs (background, daily)
       ↓
New/updated Memory records written
       ↓
Next AI call is more accurate
```

### 6.2 Memory categories and examples

| Category | Key pattern | Value example | Source |
|---|---|---|---|
| `COMMAND_PATTERN` | `"couple kegs means"` | `{"quantity": 2, "unit": "keg"}` | user_correction |
| `COMMAND_PATTERN` | `"pale ale abbreviation"` | `{"maps_to_product_id": "pale-ale-half-bbl"}` | user_correction |
| `ACCOUNT_PREFERENCE` | `"acct-the-rail:typical_keg_quantity"` | `{"kegs_per_order": 2, "confidence_source": "3 orders"}` | learning_agent |
| `ACCOUNT_PREFERENCE` | `"acct-the-rail:visit_timing"` | `{"preferred_day": "tuesday", "preferred_hour": 9}` | learning_agent |
| `PRODUCT_PREFERENCE` | `"rep:top_skus_by_frequency"` | `["pale-ale-half-bbl","modelo-especial-case","red-bull-sf-24pk"]` | learning_agent |
| `NOTE_STYLE` | `"rep:preferred_note_length"` | `{"sentences": 2, "include_next_steps": true}` | learning_agent |
| `INSIGHT_CALIBRATION` | `"insight:days_threshold_for_stale"` | `{"days": 28, "calibrated_from": 5}` | learning_agent |
| `TIMING_PATTERN` | `"rep:productive_visit_window"` | `{"days": ["MON","TUE","WED"], "hours": [8,9,10]}` | learning_agent |

### 6.3 Learning agent

The learning agent runs in the background once per day (triggered by expo-background-fetch or a manual "Refresh AI" tap in Settings). It processes all unprocessed FeedbackEvents and synthesizes new/updated Memory records.

```typescript
// src/ai/agents/learning-agent.ts

export async function runLearningAgent(repId: string): Promise<LearningResult> {
  const database = getDatabase();

  // Fetch unprocessed feedback events for this rep
  const events = await database
    .get<FeedbackEvent>('feedback_events')
    .query(
      Q.where('rep_id', repId),
      Q.where('synthesized', false),
      Q.sortBy('created_at', Q.asc),
    )
    .fetch();

  if (events.length < 3) {
    // Not enough signal yet — wait for more events
    return { processed: 0, memoriesCreated: 0, memoriesUpdated: 0 };
  }

  // Group by event_type for batch processing
  const commandEdits = events.filter(e => e.eventType === 'command_edited');
  const insightEdits = events.filter(e => e.eventType === 'insight_edited');
  const rejections = events.filter(e =>
    e.eventType.endsWith('_rejected') && events.filter(
      e2 => e2.eventType.replace('rejected', 'accepted') && e2.contextJson === e.contextJson
    ).length === 0
  );

  const results: LearningResult = { processed: 0, memoriesCreated: 0, memoriesUpdated: 0 };

  // Process command edits — look for patterns
  if (commandEdits.length >= 2) {
    const commandPatterns = await synthesizeCommandPatterns(commandEdits);
    for (const pattern of commandPatterns) {
      await upsertMemory(database, repId, 'COMMAND_PATTERN', pattern.key, pattern.value, pattern.confidence);
      results.memoriesCreated++;
    }
  }

  // Process insight edits — calibrate the insight engine
  if (insightEdits.length >= 2) {
    const calibrations = await synthesizeInsightCalibrations(insightEdits);
    for (const cal of calibrations) {
      await upsertMemory(database, repId, 'INSIGHT_CALIBRATION', cal.key, cal.value, cal.confidence);
      results.memoriesUpdated++;
    }
  }

  // Mark all processed events as synthesized
  await database.write(async () => {
    for (const event of events) {
      await event.update(e => { e.synthesized = true; });
    }
  });

  results.processed = events.length;
  return results;
}

async function synthesizeCommandPatterns(
  edits: FeedbackEvent[]
): Promise<Array<{ key: string; value: string; confidence: number }>> {
  // Call Claude with all the edits and ask it to identify the pattern
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 500,
    system: MEMORY_SYNTHESIS_PROMPT,
    messages: [{
      role: 'user',
      content: `Identify command interpretation patterns from these corrections:\n\n${
        edits.map(e => `Input: "${JSON.parse(e.contextJson).transcript}" → AI said: ${e.aiOutput} → Rep corrected to: ${e.userCorrection}`).join('\n')
      }\n\nReturn only JSON array of patterns.`,
    }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '[]';
  try {
    return JSON.parse(text.replace(/```json|```/g, '').trim());
  } catch {
    return [];
  }
}
```

### 6.4 Memory retrieval at call time

```typescript
// src/ai/memory/retriever.ts

export async function getRelevantMemories(
  repId: string,
  accountId: string | null,
  categories: MemoryCategory[],
  limit = 5,
): Promise<Memory[]> {
  const database = getDatabase();
  const queries: Q.Condition[] = [
    Q.where('rep_id', repId),
    Q.where('category', Q.oneOf(categories)),
    Q.where('confidence', Q.gte(0.3)),    // only confident memories
  ];

  // Account-specific memories ranked higher
  const accountMemories = accountId
    ? await database.get<Memory>('memories')
        .query(...queries, Q.where('account_id', accountId))
        .fetch()
    : [];

  const globalMemories = await database.get<Memory>('memories')
    .query(...queries, Q.where('account_id', null))
    .fetch();

  // Combine: account-specific first, then global; sort by recency + use_count
  const all = [...accountMemories, ...globalMemories]
    .sort((a, b) => {
      const scoreA = a.confidence * (1 + Math.log1p(a.useCount)) * (a.lastUsedAt || 0);
      const scoreB = b.confidence * (1 + Math.log1p(b.useCount)) * (b.lastUsedAt || 0);
      return scoreB - scoreA;
    })
    .slice(0, limit);

  // Increment use_count for retrieved memories
  await database.write(async () => {
    for (const mem of all) {
      await mem.update(m => {
        m.useCount += 1;
        m.lastUsedAt = Date.now();
      });
    }
  });

  return all;
}

export function memoriesToContextString(memories: Memory[]): string {
  if (memories.length === 0) return '';
  return `\n\nKnown patterns for this rep:\n${
    memories.map(m => `- [${m.category}] ${m.key}: ${m.value} (confidence: ${(m.confidence * 100).toFixed(0)}%)`).join('\n')
  }`;
}
```

### 6.5 AI feedback capture component

```typescript
// src/components/ai/FeedbackCapture.tsx

interface FeedbackCaptureProps {
  aiOutput: string;
  context: AccountContext;
  eventType: FeedbackEventType;
  onAccept: () => void;
  onEdit: (correction: string) => void;
  onReject: () => void;
}

export function FeedbackCapture({ aiOutput, context, eventType, onAccept, onEdit, onReject }: FeedbackCaptureProps) {
  const { saveFeedback } = useFeedback();

  const handleAccept = async () => {
    await saveFeedback({
      eventType: eventType.replace(/_.+/, '_accepted') as FeedbackEventType,
      aiOutput,
      contextJson: JSON.stringify(context),
    });
    onAccept();
  };

  const handleEdit = async (correction: string) => {
    await saveFeedback({
      eventType: eventType.replace(/_.+/, '_edited') as FeedbackEventType,
      aiOutput,
      userCorrection: correction,
      contextJson: JSON.stringify(context),
    });
    onEdit(correction);
  };

  const handleReject = async () => {
    await saveFeedback({
      eventType: eventType.replace(/_.+/, '_rejected') as FeedbackEventType,
      aiOutput,
      contextJson: JSON.stringify(context),
    });
    onReject();
  };

  return (
    <View className="flex-row gap-2 mt-2">
      <TouchableOpacity
        accessibilityLabel="Accept AI suggestion"
        className="flex-1 bg-green-500 rounded-lg py-3 items-center"
        onPress={handleAccept}
      >
        <Text className="text-white font-semibold">Accept</Text>
      </TouchableOpacity>
      <TouchableOpacity
        accessibilityLabel="Edit AI suggestion"
        className="flex-1 bg-amber-500 rounded-lg py-3 items-center"
        onPress={() => onEdit('')}   // triggers inline editor
      >
        <Text className="text-white font-semibold">Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity
        accessibilityLabel="Reject AI suggestion"
        className="flex-1 bg-red-500 rounded-lg py-3 items-center"
        onPress={handleReject}
      >
        <Text className="text-white font-semibold">Reject</Text>
      </TouchableOpacity>
    </View>
  );
}
```

---

## §7 — Offline-First Architecture

### 7.1 Principle: offline is the default state

The app boots from WatermelonDB every time — never from the network. Network is only used for initial seed (first launch) and sync (periodic + on-reconnect). This means cold launch always works regardless of connectivity.

### 7.2 Connectivity detection

```typescript
// src/hooks/useOfflineStatus.ts
import NetInfo from '@react-native-community/netinfo';
import { useState, useEffect } from 'react';
import { useSyncStore } from '../store/sync-store';

export function useOfflineStatus() {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const { triggerSync } = useSyncStore();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const online = state.isConnected && state.isInternetReachable;
      const wasOffline = isOnline === false;
      setIsOnline(!!online);

      // Just came back online — trigger sync immediately
      if (wasOffline && online) {
        triggerSync('reconnect');
      }
    });
    return unsubscribe;
  }, [isOnline]);

  return { isOnline: isOnline ?? false, isChecking: isOnline === null };
}
```

### 7.3 Sync engine

```typescript
// src/sync/engine.ts

export type SyncTrigger = 'app_foreground' | 'reconnect' | 'manual' | 'background';

export async function runSync(trigger: SyncTrigger): Promise<SyncResult> {
  const syncStore = useSyncStore.getState();
  if (syncStore.isSyncing) return { status: 'already_running' };

  syncStore.setSyncing(true, trigger);
  logger.info({ trigger }, 'Sync started');

  try {
    // Phase 1: Pull from Salesforce (server → local)
    const pullResult = await pullFromSalesforce();

    // Phase 2: Push from local queue (local → server)
    const pushResult = await pushQueueToSalesforce();

    const result: SyncResult = {
      status: 'success',
      pulled: pullResult.count,
      pushed: pushResult.succeeded,
      failed: pushResult.failed,
      duration: Date.now() - syncStore.syncStartedAt!,
    };

    syncStore.setSyncResult(result);
    logger.info(result, 'Sync completed');
    return result;

  } catch (error) {
    const result: SyncResult = { status: 'error', error: String(error) };
    syncStore.setSyncResult(result);
    Sentry.captureException(error, { tags: { trigger } });
    return result;
  } finally {
    syncStore.setSyncing(false);
  }
}

async function pushQueueToSalesforce(): Promise<{ succeeded: number; failed: number }> {
  const database = getDatabase();
  const pending = await database
    .get<SyncQueueItem>('sync_queue')
    .query(Q.where('status', 'pending'), Q.where('attempts', Q.lt(3)))
    .fetch();

  let succeeded = 0;
  let failed = 0;

  for (const item of pending) {
    try {
      await database.write(async () => {
        await item.update(i => { i.status = 'processing'; });
      });

      await processSyncItem(item);

      await database.write(async () => {
        await item.update(i => {
          i.status = 'done';
          i.processedAt = Date.now();
        });
      });
      succeeded++;

    } catch (error) {
      await database.write(async () => {
        await item.update(i => {
          i.status = i.attempts >= 2 ? 'failed' : 'pending';
          i.attempts += 1;
          i.lastError = String(error);
        });
      });
      failed++;
      logger.warn({ itemId: item.id, error }, 'Sync item failed');
    }
  }

  return { succeeded, failed };
}
```

### 7.4 Conflict resolution

| Scenario | Resolution | Rationale |
|---|---|---|
| Account data changed on both server and device | Server wins — overwrite local | Server is source of truth for account data |
| Order created offline, same order created online | Create both — flag for rep review | Can't silently discard an order |
| Visit note edited offline and online | Last-write-wins with timestamp | Notes rarely edited from two places |
| Product catalog updated server-side | Server wins — refresh local | Catalog is read-only on device |
| Memory record: local newer than server | Local wins | Learning happened on this device; preserve it |
| Memory record: server newer than local | Merge — keep higher confidence value | Another device may have more usage data |

### 7.5 Background sync (iOS + Android)

```typescript
// src/sync/background-sync.ts
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

const BACKGROUND_SYNC_TASK = 'ohanafy-field-background-sync';

TaskManager.defineTask(BACKGROUND_SYNC_TASK, async () => {
  try {
    const result = await runSync('background');
    return result.status === 'success'
      ? BackgroundFetch.BackgroundFetchResult.NewData
      : BackgroundFetch.BackgroundFetchResult.NoData;
  } catch {
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export async function registerBackgroundSync() {
  await BackgroundFetch.registerTaskAsync(BACKGROUND_SYNC_TASK, {
    minimumInterval: 15 * 60,    // 15 minutes minimum (OS may defer)
    stopOnTerminate: false,
    startOnBoot: true,
  });
}
```

---

## §8 — ZPL Printing System

### 8.1 Native module for Zebra Link-OS

The Zebra Link-OS SDK is an official iOS/Android SDK from Zebra Technologies. We wrap it in a custom Expo native module.

```typescript
// modules/zebra-link-os/src/ZebraLinkOs.types.ts
export interface ZebraPrinter {
  address: string;    // Bluetooth MAC address or IP
  name: string;
  model: string;      // e.g., "ZQ520"
  connectionType: 'bluetooth' | 'wifi';
}

export interface PrintResult {
  success: boolean;
  error?: string;
  printerSerial?: string;
}

export interface ZebraLinkOsInterface {
  discoverPrinters(timeout?: number): Promise<ZebraPrinter[]>;
  connectPrinter(address: string): Promise<boolean>;
  disconnectPrinter(): Promise<void>;
  printZpl(zpl: string): Promise<PrintResult>;
  getPrinterStatus(): Promise<'ready' | 'not_ready' | 'disconnected'>;
  calibrateMedia(): Promise<boolean>;
}
```

```swift
// modules/zebra-link-os/ios/ZebraLinkOsModule.swift
// Wraps ZebraLink.framework (bundled in this module)
import ExpoModulesCore
import ZebraLink

public class ZebraLinkOsModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ZebraLinkOs")

    AsyncFunction("discoverPrinters") { (timeout: Int, promise: Promise) in
      // MFiBluetoothDeviceDiscoverer implementation
    }

    AsyncFunction("printZpl") { (zpl: String, promise: Promise) in
      guard let conn = self.currentConnection else {
        promise.reject("NOT_CONNECTED", "No printer connected")
        return
      }
      conn.open()
      defer { conn.close() }
      let zplData = zpl.data(using: .utf8)!
      conn.write(zplData)
      promise.resolve(["success": true, "printerSerial": conn.serial ?? ""])
    }
  }
}
```

### 8.2 Fallback: no hardware

When no Zebra printer is available or paired:
1. Show "Preview" mode — Labelary renders the label as PNG
2. Show a "Send to Printer" button that opens the system share sheet (PDF of the label)
3. For the iOS simulator / Android emulator: always use fallback mode

```typescript
// src/zpl/printer.ts
import * as ZebraLinkOs from '../../modules/zebra-link-os';

export async function printLabel(zpl: string, accountId: string, productName: string): Promise<PrintResult> {
  const isSimulator = Platform.OS === 'ios'
    ? !Device.isDevice
    : !Device.isDevice;

  if (isSimulator) {
    return simulatePrint(zpl, productName);
  }

  const status = await ZebraLinkOs.getPrinterStatus();
  if (status !== 'ready') {
    throw new Error(`Printer not ready: ${status}`);
  }

  return ZebraLinkOs.printZpl(zpl);
}

async function simulatePrint(zpl: string, productName: string): Promise<PrintResult> {
  // In simulator/emulator: show a preview modal and return success
  // This allows testing the full flow without hardware
  showToast(`[SIMULATED] Printing label for ${productName}`);
  return { success: true, printerSerial: 'SIMULATOR' };
}
```

### 8.3 ZPL templates

Full templates with TypeScript implementations are in Appendix A. Quick reference:

| Template | Size | Use case | Parameters |
|---|---|---|---|
| `shelf-talker` | 2.5"×1.5" | Retail shelf price/promo | name, sku, price, promoLine? |
| `product-card` | 4"×3" | Feature display, cooler door | name, tagline, abv?, serving, keyFacts[], sku |
| `delivery-receipt` | 4"×6" | Delivery confirmation, signature | account, date, rep, lines[], total |
| `route-sheet` | 4"×6" | Daily account list (print at start of day) | repName, date, accounts[] |

---

## §9 — 7-Day Engineering Plan

Claude Code reads the current day's plan every morning. Do not skip ahead or work on tomorrow's tasks without completing today's.

### Commitment before Day 1 starts

Run these commands before writing any code. If any fail, fix them first.

```bash
# 1. Expo CLI installed
npx expo --version   # >= 51.x

# 2. EAS CLI installed and logged in
eas whoami           # should show your Expo account

# 3. Apple Developer account
# Go to developer.apple.com — confirm active membership + team access
# Create app ID: com.ohanafy.field

# 4. Google Play Developer account
# Go to play.google.com/console — confirm active publisher account
# Create application: Ohanafy Field

# 5. Accounts needed (set up tonight before Day 1):
# - Expo.dev account (EAS)
# - Sentry.io account (free tier OK)
# - PostHog.com account (free tier OK, or self-hosted)
# - Apple Developer Program ($99/yr — must be active)
# - Google Play Console ($25 one-time)
# - Anthropic API key (for AI features)
# - Labelary (no account needed — free API)
# - Salesforce sandbox access (Ohanafy managed package installed)
# - Zebra ZQ520 or ZQ630 (for printing tests)
```

---

### Day 1 — Foundation (Monday)

**Theme: "Every subsequent day builds on this. If Day 1 is wrong, everything is wrong."**

**Morning (3 hrs): Project scaffold + design system**

```bash
# Create the Expo project
npx create-expo-app@latest ohanafy-field \
  --template expo-template-blank-typescript
cd ohanafy-field

# Install all Day 1 dependencies at once
npx expo install \
  expo-router \
  expo-auth-session \
  expo-secure-store \
  expo-local-authentication \
  expo-notifications \
  expo-background-fetch \
  expo-task-manager \
  @react-native-community/netinfo \
  react-native-gesture-handler \
  react-native-reanimated \
  @shopify/flash-list \
  nativewind \
  zustand \
  @tanstack/react-query \
  zod

# WatermelonDB (needs special setup)
npm install @nozbe/watermelondb
npx expo install @nozbe/watermelondb

# Error tracking + analytics
npx expo install @sentry/react-native
npm install posthog-react-native

# Testing
npm install --save-dev jest @testing-library/react-native \
  @testing-library/jest-native \
  jest-expo
```

**Targets by end of Day 1:**

| Target | Test |
|---|---|
| Expo project runs in simulator | `npx expo start` — opens without errors |
| Expo Router navigation: auth → home → settings | Navigate between all 3 tabs manually |
| NativeWind configured with Ohanafy brand tokens | Brand color renders on a sample button |
| WatermelonDB initialized — schema created, all tables exist | Run `db.adapter.query(...)` in dev console returns empty arrays |
| Salesforce OAuth PKCE flow completes | Token stored in SecureStore; `sf-client.ts` returns user info |
| Biometric lock screen works | FaceID/TouchID prompts on app foreground |
| Sentry initialized — error reports appear in dashboard | `Sentry.captureMessage('test')` shows in Sentry |
| EAS build profile configured | `eas build --platform ios --profile preview` succeeds (or queued) |
| GitHub Actions CI runs | Push to `main` → CI green |
| `CLAUDE.md` committed | Claude Code can read session context |

**Day 1 deep-dives:**

**Salesforce OAuth:**
```typescript
// src/auth/sf-oauth.ts
import * as AuthSession from 'expo-auth-session';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const SF_INSTANCE_URL = process.env.EXPO_PUBLIC_SF_INSTANCE_URL!;
const SF_CLIENT_ID = process.env.EXPO_PUBLIC_SF_CLIENT_ID!;
const SF_REDIRECT_URI = AuthSession.makeRedirectUri({ scheme: 'com.ohanafy.field' });

export async function loginWithSalesforce(): Promise<SFTokens> {
  const discovery = {
    authorizationEndpoint: `${SF_INSTANCE_URL}/services/oauth2/authorize`,
    tokenEndpoint: `${SF_INSTANCE_URL}/services/oauth2/token`,
  };

  const request = new AuthSession.AuthRequest({
    clientId: SF_CLIENT_ID,
    scopes: ['api', 'refresh_token', 'offline_access'],
    redirectUri: SF_REDIRECT_URI,
    usePKCE: true,
  });

  const result = await request.promptAsync(discovery);

  if (result.type !== 'success') {
    throw new Error(`OAuth failed: ${result.type}`);
  }

  const tokenResponse = await AuthSession.exchangeCodeAsync(
    { code: result.params.code, redirectUri: SF_REDIRECT_URI, clientId: SF_CLIENT_ID, extraParams: { code_verifier: request.codeVerifier! } },
    discovery,
  );

  await SecureStore.setItemAsync('sf_access_token', tokenResponse.accessToken!);
  await SecureStore.setItemAsync('sf_refresh_token', tokenResponse.refreshToken!);
  await SecureStore.setItemAsync('sf_instance_url', SF_INSTANCE_URL);

  return { accessToken: tokenResponse.accessToken!, refreshToken: tokenResponse.refreshToken!, instanceUrl: SF_INSTANCE_URL };
}
```

**WatermelonDB setup:**
```typescript
// src/db/index.ts
import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import schema from './schema';
import migrations from './migrations';
import Account from './models/Account';
import Product from './models/Product';
import Order from './models/Order';
import OrderLine from './models/OrderLine';
import Visit from './models/Visit';
import Memory from './models/Memory';
import FeedbackEvent from './models/FeedbackEvent';
import SyncQueueItem from './models/SyncQueueItem';
import LabelPrint from './models/LabelPrint';

const adapter = new SQLiteAdapter({
  schema,
  migrations,
  jsi: Platform.OS !== 'web',    // JSI for better performance on device
  onSetUpError: error => Sentry.captureException(error),
});

export const database = new Database({
  adapter,
  modelClasses: [Account, Product, Order, OrderLine, Visit, Memory, FeedbackEvent, SyncQueueItem, LabelPrint],
});
```

**NativeWind brand tokens:**
```javascript
// tailwind.config.js
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        'ohanafy': {
          primary:   '#FILL_FROM_BRAND_GUIDE',
          secondary: '#FILL_FROM_BRAND_GUIDE',
          accent:    '#FILL_FROM_BRAND_GUIDE',
          ink:       '#FILL_FROM_BRAND_GUIDE',
          bg:        '#FILL_FROM_BRAND_GUIDE',
        },
        'offline':  '#6B7280',
        'sync':     '#F59E0B',
        'success':  '#16A34A',
        'warning':  '#D97706',
        'danger':   '#DC2626',
      },
      fontFamily: {
        heading: ['FILL_FROM_BRAND_GUIDE', 'system-ui'],
        body:    ['FILL_FROM_BRAND_GUIDE', 'system-ui'],
      },
    },
  },
};
```

---

### Day 2 — Core Features (Tuesday)

**Theme: "Every rep feature that matters offline, working end-to-end."**

**Targets by end of Day 2:**

| Target | Test |
|---|---|
| Account list renders from WatermelonDB (airplane mode) | Enable airplane mode. Account list loads instantly. |
| Account search filters correctly | Type "Rail" → only The Rail shows |
| "Needs attention" filter works | 5 seeded accounts; 2 flagged; filter shows 2 |
| Account detail renders all fields + last visit | Navigate to The Rail; all data present |
| Order entry: add line items, stepper works | Add 2 kegs Pale Ale; total updates |
| Order entry: swipe to delete works | Swipe left on a line; line removed |
| Order confirm screen renders + saves to WatermelonDB | Confirm order; `status = 'pending_sync'` in DB |
| Visit note entry: text input, save | Log "Tap issue on lager" note; appears in visit history |
| Sync queue: order appears when created offline | Create order offline; sync_queue has 1 pending item |
| Sync engine: flushes queue and creates SF record on reconnect | Turn off airplane mode; order appears in SF sandbox |
| ErrorBoundary renders fallback without crashing | Throw deliberate error; error boundary catches it |
| LoadingSkeleton shows on all list screens | Slow network: skeleton visible for 200ms+ before data |
| EmptyState shows on account list with no data | Clear DB; open account list; empty state shown |

**Order entry performance note:**

The order entry screen must be tested at 50+ line items without jank. Use FlashList with `estimatedItemSize` tuned to actual item height. Run `npx react-native-performance-ui` to verify.

---

### Day 3 — Voice + AI (Wednesday)

**Theme: "The rep never needs to type again."**

**Targets by end of Day 3:**

| Target | Test |
|---|---|
| Voice recognition initializes on device | Tap mic; speech indicator shows; speak; transcript appears |
| Interim transcript displays in real time | Words appear as spoken (no post-processing delay) |
| Voice state machine transitions correctly | IDLE → LISTENING → PROCESSING → CONFIRMING → IDLE |
| Voice command adds items to order | Say "add 2 kegs pale ale"; CommandFeedback appears |
| Accept button applies the change | Tap Accept; order line added |
| Edit button opens inline editor | Tap Edit; quantity field focused |
| Reject button reverts | Tap Reject; no change to order |
| FeedbackEvent stored on each action | Check WatermelonDB `feedback_events` table after each action |
| Visit prep AI insight appears on account open | Open The Rail; InsightBanner appears within 3 seconds |
| InsightBanner skeleton shows while loading | Slow API: shimmer visible until result arrives |
| InsightBanner hides if AI takes > 3 seconds | Simulate slow API; banner doesn't appear (non-blocking) |
| Voice note: "Note [text]" creates visit note | Say "note the lager tap is still intermittent"; note saved |
| AI note cleanup: transcript cleaned to CRM-quality | Filler words ("um", "uh") removed from saved note |
| Memories table: empty on fresh install | `SELECT COUNT(*) FROM memories WHERE rep_id = 'me'` returns 0 |
| Memory writer: stores correction on Edit | Edit a voice command; check memories table for new entry |

**Voice command state machine (Zustand):**

```typescript
// src/store/voice-store.ts
import { create } from 'zustand';

type VoiceState = 'idle' | 'requesting_permission' | 'listening' | 'processing' | 'confirming' | 'error';

interface VoiceAction {
  type: 'ADD_TO_ORDER';
  items: OrderLineItem[];
  summary: string;
} | {
  type: 'LOG_NOTE';
  note: string;
  rawTranscript: string;
} | {
  type: 'UNKNOWN';
  transcript: string;
};

interface VoiceStore {
  state: VoiceState;
  transcript: string;
  interimTranscript: string;
  action: VoiceAction | null;
  error: string | null;

  startListening: () => Promise<void>;
  stopListening: () => void;
  setTranscript: (t: string, isInterim: boolean) => void;
  setAction: (action: VoiceAction) => void;
  reset: () => void;
  setError: (e: string) => void;
}
```

---

### Day 4 — ZPL, Learning & Push (Thursday)

**Theme: "Print something physical. The AI gets smarter. The rep gets a reminder."**

**Targets by end of Day 4:**

| Target | Test |
|---|---|
| Zebra module compiles on both iOS and Android | `eas build --platform all --profile preview` succeeds |
| Printer discovery returns paired Zebra | On device: tap "Find Printers"; ZQ520 appears in list |
| Zebra connection + print: shelf talker prints | Tap Print; ZQ520 prints the label |
| Labelary preview renders correctly | Open label preview; PNG visible before printing |
| Shelf talker ZPL correct for 8dpmm/2.5×1.5" | Print on ZQ520; label fits, text readable at 2ft |
| Product card ZPL correct for 8dpmm/4×3" | Print on ZQ520 or ZQ630; label fits |
| Delivery receipt ZPL correct for 8dpmm/4×6" | Print on ZQ520 or ZQ630; all line items present |
| Label print stored in `label_prints` table | Print a label; check WDB for the entry |
| Offline ZPL preview fallback: raw ZPL shown | Enable airplane mode; open preview; ZPL text shown |
| Learning agent: runs and creates memory records | Seed 5 command edits; run agent; check memories table |
| Learning agent: memory count increases over time | Run agent 3 times with different edits; memories grow |
| Memory badge: "customer-calibrated" shown on insight | Seed 1 account memory; open that account; badge shows |
| Push notification: visit reminder fires | Set account reminder for 1 min from now; notification fires |
| Push notification: tap opens correct account | Tap notification; account detail screen opens |
| AI memory Settings screen: shows all memories | Open Settings → AI Memory; memories listed |
| Delete memory works | Delete a memory; it's gone from DB and list |

**ZPL render quality check (mandatory):**

```bash
# Test every ZPL template against Labelary before considering Day 4 done
curl -X POST http://api.labelary.com/v1/printers/8dpmm/labels/2.5x1.5/0/ \
  -H "Accept: image/png" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data-urlencode "$(node -e "const {generateShelfTalker} = require('./src/zpl/templates/shelf-talker'); console.log(generateShelfTalker({productName:'Pale Ale',skuCode:'YH-PA-HB',pricePerCase:142}))")" \
  --output /tmp/shelf-talker-test.png && open /tmp/shelf-talker-test.png
```

---

### Day 5 — Tests, Onboarding & Help (Friday)

**Theme: "A rep can pick it up and know what to do. A test suite can tell us when we broke something."**

**Targets by end of Day 5:**

| Target | Test |
|---|---|
| Unit tests: ≥ 80% coverage on `src/ai/`, `src/zpl/`, `src/sync/` | `npx jest --coverage` → meets threshold |
| Unit tests: all AI tool handlers tested with fixtures | `npx jest src/ai/tools/` — all pass |
| Unit tests: all ZPL templates tested with snapshots | `npx jest src/zpl/` — all pass, snapshots committed |
| Unit tests: sync engine pure functions tested | `npx jest src/sync/` — all pass |
| E2E: onboarding flow completes | Maestro: `maestro test maestro/flows/onboarding.yaml` |
| E2E: account-visit.yaml — full happy path | Maestro: `maestro test maestro/flows/account-visit.yaml` |
| E2E: voice-order.yaml | Maestro: passes |
| E2E: offline-sync.yaml | Maestro: passes |
| E2E: zpl-print.yaml (preview mode if no printer) | Maestro: passes |
| Onboarding wizard: 5 steps complete end-to-end | Go through all 5 steps; "Done" reaches home screen |
| Coach marks: shown on first visit to each screen | Fresh install; coach marks appear on home and account detail |
| Coach marks: dismissed and not shown again | Dismiss a mark; re-open app; mark does not reappear |
| User guide: all 7 sections accessible | Open Guide in tabs; all sections load (offline) |
| User guide: search works | Search "voice"; relevant sections shown |
| User guide: renders offline | Enable airplane mode; open guide; all sections load |
| Dark mode: all screens look correct | System dark mode on; no white flashes, no invisible text |

**Maestro E2E example (account-visit.yaml):**

```yaml
# maestro/flows/account-visit.yaml
appId: com.ohanafy.field
---
- launchApp:
    clearState: true
    env:
      MAESTRO_TEST_MODE: "true"     # Uses seeded test data, no real SF call

# Login (mocked in test mode)
- tapOn: "Sign in with Salesforce"
- assertVisible: "My Accounts"

# Navigate to The Rail
- tapOn: "The Rail"
- assertVisible: "InsightBanner"       # AI insight loaded
- assertVisible: "Pale Ale"            # Suggested SKU visible

# Start an order
- tapOn: "New Order"
- assertVisible: "Order Entry"

# Add item via stepper
- tapOn: "Pale Ale"
- tapOn:
    id: "qty-stepper-increase"
- tapOn:
    id: "qty-stepper-increase"
- assertVisible: "2 × 1/2 bbl"

# Confirm order
- tapOn: "Confirm Order"
- assertVisible: "Order Saved"
- assertVisible: "Pending Sync"

# Verify sync badge
- tapOn: "Back"
- assertVisible: "1 item pending"

# Simulate reconnect (test mode: manual trigger)
- tapOn:
    id: "debug-trigger-sync"
- assertVisible: "Synced ✓"
```

---

### Day 6 — Tablet, Accessibility & Performance (Saturday)

**Theme: "World-class means it works everywhere, for everyone."**

**Targets by end of Day 6:**

| Target | Test |
|---|---|
| iPad split layout: account list + detail side-by-side | iPad simulator ≥ 768pt: two panels visible |
| iPad: tapping account opens detail in right panel (no full navigation) | Tap account; detail replaces right panel without nav transition |
| Android tablet split layout: same threshold | Android tablet simulator: same behavior |
| iPad: landscape mode, all screens usable | Rotate iPad; no content clipped or hidden |
| Android tablet: landscape mode | Same |
| VoiceOver (iOS): account list announces item count | VoiceOver on; swipe to account list; count announced |
| VoiceOver: order entry navigable | Step through order entry with VoiceOver; all elements announced |
| VoiceOver: voice button accessible | VoiceOver: element reads "Microphone, button, double-tap to start voice command" |
| TalkBack (Android): same core flows | Android emulator with TalkBack; same coverage |
| Dynamic Type (iOS): largest size doesn't clip | iOS Accessibility → Text Size → largest; all screens usable |
| Performance: account list scroll 60fps | Flipper / Perf Monitor: no dropped frames during fast scroll |
| Performance: cold launch < 2.5s (iPhone SE 3) | Stopwatch: cold launch from icon to interactive home |
| Performance: warm launch < 0.8s | Second launch (app in memory): time to interactive |
| Memory: peak < 150MB during full demo path | Instruments: memory usage through full account visit flow |
| No Hermes JS errors | Production build: zero red-box errors |
| Feature freeze: no new features after 5pm | All remaining PRs are bug fixes, tests, or docs only |

**Tablet layout implementation:**

```typescript
// src/hooks/useTabletLayout.ts
import { useWindowDimensions } from 'react-native';

export function useTabletLayout() {
  const { width } = useWindowDimensions();
  return {
    isTablet: width >= 768,
    isMediumTablet: width >= 1024,
    isLargeTablet: width >= 1280,
    splitPaneLeftWidth: Math.min(360, width * 0.35),
  };
}
```

```typescript
// app/(tabs)/index.tsx — tablet-aware account list
import { useTabletLayout } from '../../src/hooks/useTabletLayout';
import { View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function AccountListScreen() {
  const { isTablet } = useTabletLayout();
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const router = useRouter();

  const handleSelectAccount = (id: string) => {
    if (isTablet) {
      setSelectedAccountId(id);  // show in right panel
    } else {
      router.push(`/account/${id}`);  // navigate (phone)
    }
  };

  if (isTablet) {
    return (
      <View className="flex-1 flex-row">
        <View style={{ width: splitPaneLeftWidth }} className="border-r border-gray-200">
          <AccountList onSelectAccount={handleSelectAccount} selectedId={selectedAccountId} />
        </View>
        <View className="flex-1">
          {selectedAccountId ? (
            <AccountDetail accountId={selectedAccountId} />
          ) : (
            <EmptyState message="Select an account" />
          )}
        </View>
      </View>
    );
  }

  return <AccountList onSelectAccount={handleSelectAccount} />;
}
```

**Accessibility patterns:**

```typescript
// Every interactive element must have these:
<TouchableOpacity
  accessible={true}
  accessibilityLabel="Add Pale Ale to order"   // human-readable label
  accessibilityHint="Double-tap to add one keg of Pale Ale to the current order"  // what happens
  accessibilityRole="button"
  accessibilityState={{ disabled: isLoading }}
  onPress={handleAdd}
>
  <Text>Add</Text>
</TouchableOpacity>

// Lists must announce count:
<FlashList
  accessibilityLabel={`Account list, ${accounts.length} accounts`}
  ...
/>

// Loading states must be announced:
{isLoading && (
  <View accessibilityLiveRegion="polite" accessibilityLabel="Loading accounts">
    <LoadingSkeleton />
  </View>
)}
```

---

### Day 7 — Documentation, Polish & Submission (Sunday)

**Theme: "Shipped."**

**Morning (4 hrs): Final bug fixes + submission prep**

```bash
# Run the full test suite one more time
npx jest --coverage
maestro test maestro/flows/

# Run TypeScript strict check
npx tsc --noEmit

# Run ESLint
npx eslint src/ app/ --ext .ts,.tsx

# Check for any console.log (none in production)
grep -r "console\.log" src/ app/ | grep -v "// allowed"

# Build production iOS
eas build --platform ios --profile production

# Build production Android
eas build --platform android --profile production
```

**Afternoon (4 hrs): Store submission**

See §21 for the full App Store and Google Play submission checklist.

**Targets by end of Day 7:**

| Target | Done? |
|---|---|
| iOS production build passes in EAS | |
| Android production build passes in EAS | |
| All Preamble checklist items checked off | |
| App Store metadata complete | |
| App Store screenshots uploaded (6 sets) | |
| Privacy Manifest complete | |
| App submitted to App Store Review | |
| Google Play metadata complete | |
| Google Play screenshots uploaded | |
| Data Safety form complete | |
| App submitted to Google Play Review | |
| User guide PDF exported and hosted | |
| CHANGELOG.md v1.0.0 written | |
| README.md complete | |

---

## §10 — Development Environment

### 10.1 Machine requirements

- Mac (required for iOS builds) — Apple Silicon preferred
- macOS 14.0+
- Xcode 16.0+
- Android Studio Hedgehog+
- Node.js 20.x
- npm 10.x or pnpm 9.x

### 10.2 `.env.local` (never commit)

```bash
# Salesforce
EXPO_PUBLIC_SF_INSTANCE_URL=https://ohanafy--dev.sandbox.my.salesforce.com
EXPO_PUBLIC_SF_CLIENT_ID=3MVG9...your_connected_app_client_id...

# Anthropic AI
ANTHROPIC_API_KEY=sk-ant-...
# NOTE: This is fetched from Salesforce at auth time and stored in SecureStore.
# The above is for local development only.

# Observability
SENTRY_DSN=https://...@sentry.io/...
EXPO_PUBLIC_POSTHOG_API_KEY=phc_...
EXPO_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Test data (development only)
EXPO_PUBLIC_USE_SEED_DATA=true
```

### 10.3 `CLAUDE.md` (session context for Claude Code)

```markdown
# Ohanafy Field — Claude Code Session Context

## What this is
A production-quality React Native (Expo) mobile app for field sales reps at beverage
distributors and breweries. Offline-first, AI-powered, ZPL label printing.
Targeting App Store + Google Play v1.0.0.

## Session start
1. Read OHANAFY-FIELD-PRODUCT-BIBLE.md §9 to find today's day
2. Read today's targets
3. Check which targets are incomplete (look for [ ] in §25 today's retro)
4. Report your plan, then start

## Non-negotiables (§0)
Offline first. Tests before features. TypeScript strict. Accessibility always.
AI never invents data. Feature freeze Day 6 5pm.

## Stack
Expo SDK 52, TypeScript strict, Expo Router v3, NativeWind v4,
WatermelonDB, TanStack Query v5, Zustand, Reanimated v3, FlashList,
@react-native-voice/voice, Zebra Link-OS (custom Expo module),
Anthropic Claude Sonnet, Sentry, PostHog

## Conventions
- All components: TypeScript strict, no `any`, accessibility labels on every interactive element
- All AI outputs: have Accept/Edit/Reject path — never locked
- All WatermelonDB writes: inside `database.write(async () => { ... })`
- All Salesforce API calls: via `src/sync/sf-client.ts` (handles token refresh)
- All errors: caught, logged to Sentry, shown to user with a helpful message
- All new features: unit test + E2E Maestro flow before marking done

## Domain: beverage field sales
Rep = Jake. Accounts = bars/stores he visits. Orders = cases/kegs placed.
Depletions, STW, CDA, three-tier — see §23 for full vocabulary.
NEVER use brewery language (fermenter, brewhouse, etc.) — Jake is a distributor rep.

## AI key management
The Anthropic API key is retrieved from Salesforce after OAuth and stored in SecureStore.
In development: use `ANTHROPIC_API_KEY` from `.env.local`.
Never hardcode. Never log the key.

## Testing
Unit: `npx jest`
E2E: `maestro test maestro/flows/[flow].yaml`
Type check: `npx tsc --noEmit`
Lint: `npx eslint src/ app/ --ext .ts,.tsx`

## Git convention
feat(screen): add account search
fix(sync): retry failed queue items correctly
test(ai): add fixture tests for order interpretation
a11y(account): add VoiceOver labels to account card
perf(list): optimize FlashList estimatedItemSize
```

---

## §11 — CI/CD Pipeline

### 11.1 GitHub Actions workflows

**`ci.yml` — runs on every push and PR:**

```yaml
name: CI
on:
  push:
    branches: ['*']
  pull_request:

jobs:
  test:
    runs-on: macos-latest   # macos for native module compilation
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - uses: expo/expo-github-action@v8
        with: { eas-version: latest, token: ${{ secrets.EXPO_TOKEN }} }
      - run: npm ci
      - run: npx tsc --noEmit
      - run: npx eslint src/ app/ --ext .ts,.tsx --max-warnings 0
      - run: npx jest --ci --coverage --coverageThreshold '{"global":{"lines":80}}'
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}

  maestro-e2e:
    runs-on: macos-latest
    needs: test
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - name: Install Maestro
        run: curl -fsSL "https://get.maestro.mobile.dev" | bash
      - name: Build Expo for iOS Simulator
        run: eas build --platform ios --profile test --local
      - name: Run Maestro flows
        run: ~/.maestro/bin/maestro test maestro/flows/
        env:
          MAESTRO_TEST_MODE: "true"
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
```

**`eas-preview.yml` — builds a preview on every PR:**

```yaml
name: EAS Preview Build
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: expo/expo-github-action@v8
        with: { eas-version: latest, token: ${{ secrets.EXPO_TOKEN }} }
      - run: npm ci
      - name: Build preview
        run: eas build --platform all --profile preview --non-interactive
      - name: Comment PR with build links
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '📱 Preview builds ready. Install via EAS dashboard.'
            })
```

**`eas-production.yml` — production build on version tag:**

```yaml
name: EAS Production Build + Submit
on:
  push:
    tags: ['v*']

jobs:
  build-and-submit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: expo/expo-github-action@v8
        with: { eas-version: latest, token: ${{ secrets.EXPO_TOKEN }} }
      - run: npm ci
      - name: Build production
        run: eas build --platform all --profile production --non-interactive
      - name: Submit to stores
        run: eas submit --platform all --latest --non-interactive
```

### 11.2 `eas.json`

```json
{
  "cli": { "version": ">= 7.0.0" },
  "build": {
    "test": {
      "distribution": "internal",
      "ios": {
        "simulator": true,
        "buildConfiguration": "Debug"
      },
      "android": {
        "buildType": "apk"
      },
      "env": {
        "EXPO_PUBLIC_USE_SEED_DATA": "true"
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": false
      },
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "ios": {
        "buildConfiguration": "Release"
      },
      "android": {
        "buildType": "app-bundle"
      },
      "env": {
        "EXPO_PUBLIC_USE_SEED_DATA": "false"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "daniel@ohanafy.com",
        "ascAppId": "FILL_IN_FROM_ASC",
        "appleTeamId": "FILL_IN_FROM_APPLE_DEV"
      },
      "android": {
        "serviceAccountKeyPath": "./google-service-account.json",
        "track": "internal"
      }
    }
  }
}
```

---

## §12 — Testing Strategy

### 12.1 Test pyramid

```
                    ┌─────────────┐
                    │  E2E (Maestro)│
                    │  6 flows     │
                   ┌┴─────────────┴┐
                   │ Integration    │
                   │ (Jest, WDB)   │
                   │ 15 test files  │
                  ┌┴───────────────┴┐
                  │  Unit (Jest)    │
                  │  AI tools       │
                  │  ZPL templates  │
                  │  Sync engine    │
                  │  Business logic │
                  │  40+ test files │
                  └─────────────────┘
```

### 12.2 Coverage targets

| Package | Line coverage | Branch coverage |
|---|---|---|
| `src/ai/tools/` | ≥ 90% | ≥ 85% |
| `src/ai/memory/` | ≥ 85% | ≥ 80% |
| `src/zpl/templates/` | 100% | ≥ 90% |
| `src/sync/` | ≥ 85% | ≥ 80% |
| `src/utils/` | ≥ 90% | ≥ 85% |
| `src/db/repositories/` | ≥ 80% | ≥ 75% |
| `src/components/` (logic only) | ≥ 70% | ≥ 65% |

### 12.3 Test patterns

**AI tool handler tests (fixture-based — no real API calls in CI):**

```typescript
// __tests__/unit/ai/interpret-order.test.ts
import { describe, it, expect, vi } from 'jest';
import { createInterpretOrderTool } from '../../../src/ai/tools/interpret-order';
import { demoCatalog } from '../../../src/data/test-fixtures/catalog';

// Mock the Anthropic SDK
vi.mock('@anthropic-ai/sdk', () => ({
  default: class {
    messages = {
      create: vi.fn(),
    };
  },
}));

describe('interpretOrderTool', () => {
  const tool = createInterpretOrderTool();

  describe('keg orders', () => {
    it('interprets "2 kegs pale ale" correctly', async () => {
      const result = await tool.handler({
        transcript: '2 kegs pale ale',
        currentOrder: [],
        productCatalog: demoCatalog,
      });
      expect(result.itemsToAdd).toHaveLength(1);
      expect(result.itemsToAdd[0]).toMatchObject({
        productId: 'pale-ale-half-bbl',
        quantity: 2,
        unit: 'keg',
      });
      expect(result.confidence).toBe('high');
    });

    it('interprets "couple kegs" as quantity 2', async () => {
      const result = await tool.handler({
        transcript: 'couple kegs pale ale',
        currentOrder: [],
        productCatalog: demoCatalog,
      });
      expect(result.itemsToAdd[0].quantity).toBe(2);
    });

    it('returns low confidence for unknown product', async () => {
      const result = await tool.handler({
        transcript: 'add 3 kegs of whatever',
        currentOrder: [],
        productCatalog: demoCatalog,
      });
      expect(result.confidence).toBe('low');
    });

    it('does not modify currentOrder directly', async () => {
      const currentOrder = [{ productId: 'bud-light-case', quantity: 1, unit: 'case' as const }];
      const original = [...currentOrder];
      await tool.handler({ transcript: 'add 2 kegs pale ale', currentOrder, productCatalog: demoCatalog });
      expect(currentOrder).toEqual(original);  // immutable
    });
  });

  describe('Red Bull orders', () => {
    it('interprets "case of red bull sugarfree" correctly', async () => {
      const result = await tool.handler({
        transcript: 'a case of red bull sugarfree',
        currentOrder: [],
        productCatalog: demoCatalog,
      });
      expect(result.itemsToAdd[0].productId).toBe('red-bull-sf-24pk');
      expect(result.itemsToAdd[0].unit).toBe('case');
    });
  });
});
```

**ZPL template snapshot tests:**

```typescript
// __tests__/unit/zpl/shelf-talker.test.ts
import { generateShelfTalker } from '../../../src/zpl/templates/shelf-talker';

describe('generateShelfTalker', () => {
  it('generates valid ZPL II structure', () => {
    const zpl = generateShelfTalker({
      productName: 'Yellowhammer Pale Ale',
      skuCode: 'YH-PA-HB',
      pricePerCase: 142.00,
    });
    expect(zpl).toMatch(/^\^XA/);
    expect(zpl).toMatch(/\^XZ$/);
    expect(zpl).toContain('^CI28');     // UTF-8 charset
    expect(zpl).toContain('^PW400');    // 2.5" × 8dpmm × 20 = width command
    expect(zpl).toMatchSnapshot();      // visual regression
  });

  it('does not overflow 2.5" width (all ^FO x < 380)', () => {
    const zpl = generateShelfTalker({
      productName: 'A Very Long Product Name That Might Overflow',
      skuCode: 'VL-PROD-HB',
      pricePerCase: 999.99,
    });
    const xCoords = [...zpl.matchAll(/\^FO(\d+),/g)].map(m => parseInt(m[1]));
    expect(Math.max(...xCoords)).toBeLessThan(380);
  });

  it('truncates product name > 22 chars to prevent overflow', () => {
    const zpl = generateShelfTalker({
      productName: 'This Name Is Way Too Long For The Label',
      skuCode: 'TN-TOO-LONG',
      pricePerCase: 50.00,
    });
    expect(zpl).not.toContain('This Name Is Way Too Long For The Label');
  });
});
```

**Sync engine integration tests:**

```typescript
// __tests__/integration/sync/queue-processor.test.ts
import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { processQueueItem } from '../../../src/sync/queue-processor';
import schema from '../../../src/db/schema';
import { mockSfClient } from '../../mocks/sf-client';

describe('processQueueItem — CREATE_ORDER', () => {
  let db: Database;

  beforeEach(async () => {
    const adapter = new SQLiteAdapter({ schema, dbName: ':memory:' });
    db = new Database({ adapter, modelClasses: [...allModels] });
    await seedTestData(db);
  });

  it('creates order in Salesforce and updates local sync_status', async () => {
    mockSfClient.createRecord.mockResolvedValue({ id: 'SF_ORDER_001' });

    const queueItem = await db.get('sync_queue').find('local_order_001');
    await processQueueItem(queueItem, db, mockSfClient);

    const order = await db.get('orders').find('local_order_001');
    expect(order.syncStatus).toBe('synced');
    expect(order.sfId).toBe('SF_ORDER_001');
    expect(mockSfClient.createRecord).toHaveBeenCalledWith('ohfy_field__Order__c', expect.any(Object));
  });

  it('increments attempts on Salesforce API failure', async () => {
    mockSfClient.createRecord.mockRejectedValue(new Error('SF timeout'));

    const queueItem = await db.get('sync_queue').find('local_order_001');
    await expect(processQueueItem(queueItem, db, mockSfClient)).rejects.toThrow();

    const updated = await db.get('sync_queue').find('local_order_001');
    expect(updated.attempts).toBe(1);
    expect(updated.lastError).toContain('SF timeout');
    expect(updated.status).toBe('pending');  // retryable
  });
});
```

### 12.4 E2E Maestro flows (all required)

| Flow | File | What it covers |
|---|---|---|
| Onboarding | `onboarding.yaml` | Welcome → SF connect → printer pair → first visit guided |
| Account visit (main happy path) | `account-visit.yaml` | List → detail → AI insight → order → confirm → sync |
| Voice order | `voice-order.yaml` | Voice command → order add → accept → reject → edit |
| Offline sync | `offline-sync.yaml` | Create order offline → reconnect → sync → SF record exists |
| ZPL print | `zpl-print.yaml` | Select label → preview → print (simulated) → history entry |
| AI correction learning | `ai-correction-learning.yaml` | Make 3 corrections → run learning agent → insight improves |

---

## §13 — Logging, Error Tracking & Observability

### 13.1 Structured logger

```typescript
// src/utils/logger.ts
import * as Sentry from '@sentry/react-native';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private isDev = __DEV__;

  private log(level: LogLevel, message: string, context?: LogContext) {
    if (this.isDev) {
      const emoji = { debug: '🔵', info: '🟢', warn: '🟡', error: '🔴' }[level];
      console[level === 'debug' ? 'log' : level](`${emoji} [${level.toUpperCase()}] ${message}`, context ?? '');
    }

    if (level === 'error') {
      Sentry.captureMessage(message, { level, extra: context });
    } else if (level === 'warn') {
      Sentry.addBreadcrumb({ message, level, data: context });
    }
  }

  debug(context: LogContext, message: string) { this.log('debug', message, context); }
  info(context: LogContext, message: string)  { this.log('info',  message, context); }
  warn(context: LogContext, message: string)  { this.log('warn',  message, context); }
  error(context: LogContext | Error, message: string) {
    if (context instanceof Error) {
      Sentry.captureException(context);
      this.log('error', message, { error: context.message });
    } else {
      this.log('error', message, context);
    }
  }
}

export const logger = new Logger();
```

### 13.2 Sentry configuration

```typescript
// app/_layout.tsx — root layout
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN!,
  environment: __DEV__ ? 'development' : 'production',
  tracesSampleRate: __DEV__ ? 1.0 : 0.2,    // 20% of production sessions traced
  enableAutoSessionTracking: true,
  integrations: [
    Sentry.reactNativeTracingIntegration(),
  ],
  beforeSend(event) {
    // Scrub any accidental PII
    if (event.request?.data) {
      delete event.request.data.sf_access_token;
      delete event.request.data.anthropic_api_key;
    }
    return event;
  },
});
```

### 13.3 PostHog analytics events

```typescript
// src/utils/analytics.ts
import PostHog from 'posthog-react-native';

export const analytics = new PostHog(
  process.env.EXPO_PUBLIC_POSTHOG_API_KEY!,
  { host: process.env.EXPO_PUBLIC_POSTHOG_HOST }
);

// Capture events — all business events go through here
export const events = {
  accountVisitStarted: (accountId: string, accountType: string) =>
    analytics.capture('account_visit_started', { accountId, accountType }),

  orderCreated: (accountId: string, totalAmount: number, itemCount: number, createdOffline: boolean) =>
    analytics.capture('order_created', { accountId, totalAmount, itemCount, createdOffline }),

  voiceCommandUsed: (action: string, confidence: string, accepted: boolean) =>
    analytics.capture('voice_command_used', { action, confidence, accepted }),

  labelPrinted: (templateType: string, printerModel: string, success: boolean) =>
    analytics.capture('label_printed', { templateType, printerModel, success }),

  aiFeedbackGiven: (feedbackType: string, featureName: string) =>
    analytics.capture('ai_feedback_given', { feedbackType, featureName }),

  syncCompleted: (trigger: string, pushed: number, pulled: number, duration: number) =>
    analytics.capture('sync_completed', { trigger, pushed, pulled, duration }),

  learningAgentRan: (memoriesCreated: number, memoriesUpdated: number, eventsProcessed: number) =>
    analytics.capture('learning_agent_ran', { memoriesCreated, memoriesUpdated, eventsProcessed }),
};
```

### 13.4 Error boundary (every screen)

```typescript
// src/components/shared/ErrorBoundary.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import * as Sentry from '@sentry/react-native';
import { logger } from '../../utils/logger';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  screenName: string;
}

interface State { hasError: boolean; error: Error | null; }

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    logger.error(error, `ErrorBoundary caught error on ${this.props.screenName}`);
    Sentry.captureException(error, { extra: { componentStack: info.componentStack } });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <View className="flex-1 items-center justify-center p-6">
          <Text className="text-2xl font-bold text-ink mb-2">Something went wrong</Text>
          <Text className="text-gray-500 text-center mb-6">
            {this.state.error?.message ?? 'An unexpected error occurred'}
          </Text>
          <TouchableOpacity
            className="bg-ohanafy-primary rounded-xl px-6 py-3"
            onPress={() => this.setState({ hasError: false, error: null })}
            accessibilityLabel="Try again"
          >
            <Text className="text-white font-semibold">Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}
```

---

## §14 — Accessibility

### 14.1 iOS VoiceOver requirements

Every screen must be navigable using VoiceOver with a Bluetooth keyboard or swipe-only. Test checklist for each screen:

- [ ] All interactive elements are focusable (swiping reaches every button)
- [ ] Every button has `accessibilityLabel` (describes the action) + `accessibilityHint` (describes what happens)
- [ ] Every image has `accessibilityLabel` or `accessible={false}` if decorative
- [ ] Dynamic content changes are announced (`accessibilityLiveRegion="polite"`)
- [ ] Custom actions (swipe-to-delete) have `accessibilityActions` alternatives
- [ ] Modal and sheet focus is trapped correctly when open
- [ ] Tab order is logical (matches visual order on screen)

### 14.2 Android TalkBack requirements

Same as VoiceOver. Additionally:
- [ ] `contentDescription` prop used where native Android requires it
- [ ] Focus order verified via Android Accessibility Scanner
- [ ] Double-tap triggers same as single-tap action

### 14.3 Dynamic type support

```typescript
// src/constants/theme.ts
// All font sizes must scale with system preferences
import { PixelRatio } from 'react-native';

export const scaledFontSize = (size: number) =>
  size * PixelRatio.getFontScale();

// In NativeWind config: enable `allowsFontScaling` globally
// In all Text components: allowFontScaling={true} (default — don't override)
// Ensure containers use flexWrap or minHeight, never fixed height
```

### 14.4 Minimum tap target enforcement

All tappable elements must be at least 44×44pt. Use this wrapper for small icons:

```typescript
// src/components/shared/TapTarget.tsx
export function TapTarget({ children, onPress, accessibilityLabel, ...props }: TapTargetProps) {
  return (
    <TouchableOpacity
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      style={{ minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' }}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      accessible={true}
      {...props}
    >
      {children}
    </TouchableOpacity>
  );
}
```

---

## §15 — Tablet & Large Screen Layouts

### 15.1 Breakpoints

| Width | Mode | Layout |
|---|---|---|
| < 768pt | Phone portrait | Single column, full-screen navigation |
| 768–1023pt | Tablet portrait / small tablet | Split pane (35% / 65%) |
| ≥ 1024pt | Tablet landscape / large tablet | Split pane (30% / 70%), wider detail |

### 15.2 Split pane screens

| Screen | Phone behavior | Tablet behavior |
|---|---|---|
| Home (account list) | Full screen list | Left: list; Right: detail or empty state |
| Order entry | Full screen modal | Right panel slide-over, list stays visible |
| Visit log | Full screen | Inline in right panel |
| Label preview | Full screen modal | Right panel, product list stays left |
| Settings | Full screen tab | Split: settings categories left, content right |

### 15.3 iPad-specific considerations

- Use `UIUserInterfaceIdiom` detection for true iPad-specific layouts
- Support Split View and Slide Over (don't lock to portrait)
- Support Sidecar / Stage Manager (test at window sizes 320–1366pt)
- Keyboard shortcuts for power users: ⌘+N for new order, ⌘+F for search

---

## §16 — Dark Mode & Theming

### 16.1 Implementation

NativeWind v4 supports `dark:` variants. The system color scheme drives dark mode — no manual toggle (follow system preference).

```typescript
// app/_layout.tsx
import { useColorScheme } from 'nativewind';

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  // colorScheme is 'light' | 'dark' | null
  // NativeWind handles dark: variants automatically
}
```

```javascript
// tailwind.config.js — dark mode colors
theme: {
  extend: {
    colors: {
      'ohanafy': {
        // Light mode
        primary: '#HEX_LIGHT',
        bg: '#FFFFFF',
        ink: '#111827',
        surface: '#F9FAFB',
        border: '#E5E7EB',

        // Dark mode counterparts defined in dark: variants
        'dark-bg': '#0F172A',
        'dark-ink': '#F1F5F9',
        'dark-surface': '#1E293B',
        'dark-border': '#334155',
      }
    }
  }
}
```

### 16.2 Dark mode testing checklist

Run through every screen with system dark mode enabled:

- [ ] No white flashes on navigation
- [ ] No hardcoded white/black colors anywhere in components (all use theme tokens)
- [ ] StatusBar color changes appropriately
- [ ] Zebra print preview: PNG from Labelary still readable
- [ ] InsightBanner banner color: readable in both modes
- [ ] SyncStatusBar: visible in both modes
- [ ] Offline banner: visible in both modes
- [ ] Error states: visible in both modes

---

## §17 — Security & Privacy

### 17.1 Credential storage

| Credential | Storage | Notes |
|---|---|---|
| Salesforce access token | expo-secure-store (iOS Keychain / Android Keystore) | Encrypted at rest |
| Salesforce refresh token | expo-secure-store | Same |
| Anthropic API key | expo-secure-store (retrieved from SF at login) | Never in code or logs |
| Rep biometric preference | expo-secure-store | Encrypted |
| Printer last-connected address | expo-secure-store | Minor sensitivity |

**Rule: Zero credentials in `AsyncStorage`, `MMKV`, or any unencrypted store.**

### 17.2 Biometric app lock

```typescript
// src/auth/biometric.ts
import * as LocalAuthentication from 'expo-local-authentication';

export async function promptBiometric(): Promise<boolean> {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  const isEnrolled = await LocalAuthentication.isEnrolledAsync();

  if (!hasHardware || !isEnrolled) {
    // Fall back to PIN/password on devices without biometrics
    return promptPinFallback();
  }

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Unlock Ohanafy Field',
    cancelLabel: 'Use PIN',
    fallbackLabel: 'Enter PIN',
    disableDeviceFallback: false,
  });

  return result.success;
}
```

### 17.3 Data privacy

**What is stored on device:**
- Account names, addresses, contacts — business data, no personal consumer data
- Visit notes authored by the rep
- Order history
- AI memories — rep patterns, no customer PII beyond account name

**What is transmitted:**
- All device-to-Salesforce communication is over HTTPS/TLS 1.3
- All device-to-Anthropic communication is over HTTPS (official SDK)
- No data is shared with third parties beyond Sentry (error reports, scrubbed of tokens) and PostHog (analytics, no PII)

**iOS Privacy Manifest (PrivacyInfo.xcprivacy):**

Required for App Store submission. Declare:
- `NSPrivacyAccessedAPICategoryFileTimestamp` — file system access for WatermelonDB
- `NSPrivacyAccessedAPICategoryDiskSpace` — SQLite operations
- `NSPrivacyAccessedAPICategoryUserDefaults` — expo-secure-store
- No advertising identifiers used

---

## §18 — Performance Targets & Optimization

### 18.1 Targets (measured on iPhone SE 3 — slowest target)

| Metric | Target | Measured via |
|---|---|---|
| Cold launch to interactive | < 2.5s | Manual stopwatch |
| Warm launch to interactive | < 0.8s | Manual stopwatch |
| Account list scroll: frame rate | 60fps sustained | Flipper Performance Monitor |
| Account list: 100 accounts render | < 300ms | `console.time` in development |
| Order entry: 50 line items | No dropped frames during scroll | Flipper |
| Voice → interim transcript | < 200ms latency | Observed by user |
| AI command interpretation | < 1.5s (p95) | Sentry performance |
| AI visit prep | < 3s (p95) — non-blocking | Sentry performance |
| App memory peak | < 150MB | Xcode Instruments |
| App bundle size (iOS IPA) | < 50MB download | EAS build output |
| App bundle size (Android AAB) | < 40MB download | EAS build output |

### 18.2 Critical optimization patterns

**FlashList for all scrollable lists:**
```typescript
// CORRECT — uses FlashList, estimatedItemSize tuned to actual item height
<FlashList
  data={accounts}
  renderItem={({ item }) => <AccountCard account={item} />}
  estimatedItemSize={110}          // measure real rendered height once
  keyExtractor={item => item.id}
  getItemType={item => item.accountType}   // for heterogeneous lists
/>

// WRONG — never use FlatList for lists > 10 items
<FlatList ... />
```

**Memoize expensive computations:**
```typescript
// Memoize anything that depends on WatermelonDB observations
const sortedAccounts = useMemo(
  () => [...accounts].sort((a, b) => a.name.localeCompare(b.name)),
  [accounts]
);

// Memoize rendered components if parent re-renders frequently
const AccountCardMemo = React.memo(AccountCard, (prev, next) =>
  prev.account.id === next.account.id && prev.account.updatedAt === next.account.updatedAt
);
```

**WatermelonDB query optimization:**
```typescript
// CORRECT — indexed query, specific fields
const urgentAccounts = await database
  .get<Account>('accounts')
  .query(
    Q.where('needs_attention', true),
    Q.where('is_archived', false),
    Q.sortBy('last_order_date', Q.asc),
    Q.take(50),
  )
  .fetch();

// WRONG — fetches everything, filters in JS
const all = await database.get<Account>('accounts').query().fetch();
const urgent = all.filter(a => a.needsAttention);
```

---

## §19 — In-App Onboarding

### 19.1 First-run wizard

5 steps. Skippable (but we track skip events in PostHog). Re-launchable from Settings.

| Step | Screen | What happens |
|---|---|---|
| 1 | Welcome | Hero illustration, tagline, "Get Started" CTA |
| 2 | Connect (already done) | Shows connected Salesforce org, rep name, territory |
| 3 | Your Territory | Map view with territory marker, account count, first sync starts in background |
| 4 | Pair Your Printer | Bluetooth scan for Zebra printers. "Skip for now" always available |
| 5 | Guided First Visit | Opens The first account in the list with coach marks pointing to: InsightBanner, VoiceButton, Print Label, Sync indicator |

### 19.2 Coach marks system

```typescript
// src/components/onboarding/CoachMark.tsx
interface CoachMarkProps {
  id: string;           // unique ID — stored in SecureStore when dismissed
  target: React.RefObject<View>;
  title: string;
  body: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

export function CoachMark({ id, target, title, body, position }: CoachMarkProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    SecureStore.getItemAsync(`coach_mark_${id}`).then(val => {
      if (val === 'dismissed') setIsDismissed(true);
    });
  }, [id]);

  const dismiss = async () => {
    await SecureStore.setItemAsync(`coach_mark_${id}`, 'dismissed');
    setIsDismissed(true);
    analytics.capture('coach_mark_dismissed', { id });
  };

  if (isDismissed) return null;

  return (
    <CoachMarkOverlay target={target} position={position} onDismiss={dismiss}>
      <Text className="font-bold text-white mb-1">{title}</Text>
      <Text className="text-white text-sm">{body}</Text>
      <TouchableOpacity onPress={dismiss} accessibilityLabel="Dismiss tip">
        <Text className="text-white underline text-sm mt-2">Got it</Text>
      </TouchableOpacity>
    </CoachMarkOverlay>
  );
}
```

### 19.3 Coach mark inventory

| ID | Screen | Target element | Message |
|---|---|---|---|
| `insight_banner` | Account detail | InsightBanner | "Your AI briefing — surfaces the most important thing to know before you walk in. Tap thumbs up if it helped." |
| `voice_button` | Account detail | VoiceButton | "Say what you need — 'add 2 kegs pale ale', 'note the tap issue', 'what did I order last time?'" |
| `sync_status` | Home | SyncStatusBar | "This shows items waiting to sync. Ohanafy Field always works offline — this count will clear when you get signal." |
| `print_label` | Account detail | Print Label button | "Print a shelf talker or receipt directly to your Zebra printer. No office trip required." |
| `needs_attention` | Home | Filter button | "Tap 'Needs Attention' to see accounts you haven't visited in 21+ days." |

---

## §20 — In-App Help System

### 20.1 Structure

The user guide is embedded in the app and works offline. It lives at `app/guide/` and renders from static MDX content bundled at build time.

7 sections:
1. Getting Started (account management, first sync)
2. Account Visits (pre-call prep, logging visits, notes)
3. Taking Orders (adding items, voice ordering, confirming)
4. Voice Commands (what you can say, tips for accuracy)
5. Label Printing (printer setup, templates, troubleshooting)
6. AI Features (how the AI learns, reviewing memories, giving feedback)
7. Troubleshooting (offline issues, sync problems, printer problems)

Full content is in Appendix F.

### 20.2 Contextual help

Every screen has a `?` button (top-right) that opens a bottom sheet with:
- 3-5 bullet points about what this screen does
- A link to the relevant guide section
- A "Contact Support" link (mailto: → prefills with device/OS/version info)

```typescript
// src/components/shared/HelpButton.tsx
interface HelpButtonProps {
  section: GuideSection;
  tips: string[];
}

export function HelpButton({ section, tips }: HelpButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <TapTarget
        onPress={() => setIsOpen(true)}
        accessibilityLabel={`Help for this screen`}
        accessibilityHint="Opens tips and link to user guide"
      >
        <Text className="text-gray-400 text-lg">?</Text>
      </TapTarget>

      <BottomSheet isVisible={isOpen} onClose={() => setIsOpen(false)}>
        <Text className="font-bold text-ink text-lg mb-3">Tips</Text>
        {tips.map((tip, i) => (
          <Text key={i} className="text-gray-600 mb-2">• {tip}</Text>
        ))}
        <TouchableOpacity
          onPress={() => router.push(`/guide/${section}`)}
          accessibilityLabel={`Open user guide section: ${section}`}
        >
          <Text className="text-ohanafy-primary font-semibold mt-2">Read the full guide →</Text>
        </TouchableOpacity>
      </BottomSheet>
    </>
  );
}
```

---

## §21 — App Store Submission

### 21.1 Apple App Store checklist

**Before submitting:**
- [ ] Bundle ID: `com.ohanafy.field` created in Apple Developer Portal
- [ ] App ID capabilities: Push Notifications, Background Modes (Background Fetch), Bluetooth Always (for printer), Bluetooth Peripheral
- [ ] Provisioning profile: Distribution (App Store) profile created and downloaded
- [ ] Certificates: Distribution certificate active in Apple Developer Portal
- [ ] Privacy Manifest (`PrivacyInfo.xcprivacy`) committed to the Expo project
- [ ] `app.json` has correct `bundleIdentifier`, `buildNumber`, `version`

**App Store Connect metadata:**
- [ ] App name: "Ohanafy Field"
- [ ] Subtitle: "Beverage Field Sales"
- [ ] Category: Business
- [ ] Description (4000 chars max) — see Appendix F §6 for draft
- [ ] Keywords (100 chars max): "field sales, beverage, distributor, offline, voice, ZPL, Zebra, CRM, Salesforce"
- [ ] Privacy Policy URL: required for B2B apps (host on ohanafy.com)
- [ ] Support URL: support.ohanafy.com

**Screenshots required:**
- 6.7" iPhone (1290×2796): 3–10 screenshots
- 6.1" iPhone (1179×2556): same images are usually reused
- 12.9" iPad Pro (2048×2732): 3–10 screenshots
- Screenshots must show real app UI (no mockups)
- Screenshots to capture: Home, Account Detail with InsightBanner, Voice active, Order Entry, Label Preview, Sync complete

**Review notes (required for Bluetooth apps):**
> "This app connects to Zebra ZQ520/ZQ630 Bluetooth label printers to print shelf talkers and delivery receipts in the field. The Bluetooth permission is required solely for printer communication. The app does not use Bluetooth for location tracking or any other purpose. Test reviewer note: you can test core app functionality without a printer paired — all features except physical printing are available."

**App Review test account:**
Create a sandbox Salesforce account with:
- Username: `appreview@ohanafy.field.test`
- Password: `OhanafyReview2026!`
- Pre-populated with 5 test accounts and 10 products

### 21.2 Google Play checklist

**Before submitting:**
- [ ] `applicationId`: `com.ohanafy.field` set in `app.json`
- [ ] Keystore generated and backed up securely
- [ ] `google-service-account.json` generated for EAS Submit
- [ ] Target SDK: 34 (Android 14)

**Play Console metadata:**
- [ ] App name: "Ohanafy Field"
- [ ] Short description (80 chars): "Offline field sales for beverage reps — voice orders, AI insights, ZPL printing"
- [ ] Full description (4000 chars)
- [ ] Category: Business
- [ ] Data safety form complete (see below)

**Data Safety form:**
| Data type | Collected? | Shared? | Purpose |
|---|---|---|---|
| Location | No | No | — |
| Contacts | No | No | — |
| Financial info (order amounts) | Yes | No | App functionality |
| App activity (events, orders) | Yes | No | App functionality |
| Crash logs | Yes | With Sentry (service provider) | Analytics |
| App interactions | Yes | With PostHog (service provider) | Analytics |
| Device ID | Yes (Sentry) | With Sentry | Crash reporting |

**Screenshots required:**
- Phone (16:9 or 9:16): at least 2 screenshots
- 7" tablet: at least 2
- 10" tablet: at least 2

### 21.3 TestFlight distribution (iOS)

```bash
# Tag the production release
git tag v1.0.0
git push --tags

# This triggers eas-production.yml which builds + submits to TestFlight

# Monitor in App Store Connect
# Internal testers: available in ~15 minutes
# External testers: available after Apple review (~1-3 days)
```

---

## §22 — Claude Code Operating Procedure

### 22.1 Session startup protocol

Every Claude Code session:

1. Read this document (`OHANAFY-FIELD-PRODUCT-BIBLE.md`)
2. Check the daily retro in §25 for today's date — what's incomplete?
3. Read `CLAUDE.md` for session context
4. State today's targets and your first planned action
5. Confirm: "I will not write any feature not in §4's feature inventory"
6. Begin

### 22.2 TDD workflow

For every new function or module:

```
Step 1: Write the test (describe → it → expect)
Step 2: Run the test — confirm it FAILS (red)
Step 3: Write the minimum implementation to make it pass
Step 4: Run the test — confirm it PASSES (green)
Step 5: Refactor if needed — test must stay green
Step 6: Add edge case tests (empty input, null, large values)
Step 7: Run coverage check — confirm it meets threshold
```

Do not proceed to step 3 until step 2 has been confirmed.

### 22.3 Component development workflow

For every new UI component:

```
Step 1: Write the TypeScript interface (props, return type)
Step 2: Write the unit test for any logic inside the component
Step 3: Add accessibility labels to the spec
Step 4: Implement the component
Step 5: Test in light mode, dark mode, and tablet layout
Step 6: Test VoiceOver (iOS) or TalkBack (Android)
Step 7: Test at largest Dynamic Type size
```

### 22.4 AI feature development workflow

For every new AI capability:

```
Step 1: Write the system prompt (see Appendix B for patterns)
Step 2: Test the prompt manually with 10 sample inputs
Step 3: Identify failure modes — what inputs break it?
Step 4: Add guardrails to the prompt for known failure modes
Step 5: Write Zod schema for the tool input and output
Step 6: Implement the tool handler (pure TypeScript — no AI inside the handler)
Step 7: Write fixture tests for the handler
Step 8: Wire the tool into the relevant agent
Step 9: Add FeedbackCapture to the UI surface
Step 10: Confirm feedback events are written to WatermelonDB
```

### 22.5 Commit conventions

```
feat(account): add account search with debounce
fix(sync): handle SF session expiry during queue flush
test(ai): add fixture tests for keg quantity interpretation
a11y(order): add VoiceOver labels to line item stepper
perf(list): tune FlashList estimatedItemSize to 110
chore(deps): bump expo-secure-store to 13.0.0
docs(guide): add troubleshooting section for printer pairing
```

### 22.6 When stuck

If stuck on a problem for > 20 minutes:

1. Write the problem in a comment at the top of the file: `// STUCK: [description]`
2. Write two alternative approaches, even if they feel incomplete
3. Pick the simpler one and implement it partially
4. Flag it in the daily retro as "needs revisit"

Do not spend more than 45 minutes on any single problem without taking an alternative path. Progress on the overall day's targets is more valuable than perfection on one feature.

### 22.7 Code quality gates (run before every commit)

```bash
# These must all pass before committing
npx tsc --noEmit            # TypeScript strict check
npx eslint src/ app/        # Linting
npx jest --passWithNoTests  # Tests (at minimum, no new failures)
```

---

## §23 — Domain Conventions

### 23.1 Vocabulary — field sales rep (Jake Thornton)

This is a **field sales rep at a beverage distributor**, not a brewery. Use distributor vocabulary.

**Core terms:**
- **Account**: a retail account the rep calls on (bar, restaurant, grocery store, c-store)
- **Visit**: a physical account call — logged with notes and outcomes
- **Order**: cases or kegs placed with the wholesaler during a visit
- **Route**: the rep's daily sequence of accounts
- **Territory**: geographic area assigned to this rep (e.g., Birmingham South)
- **Cases**: the unit of measure for packaged product (bottles, cans, cartons)
- **Keg / 1/2 bbl**: draft beer unit — 15.5 gallons; most common
- **1/6 bbl**: sixth-barrel keg — 5.16 gallons; common for craft accounts
- **Depletion**: how much the retailer actually sold to consumers (reported back)
- **STW**: ship-to-wholesaler — when the supplier delivers to Yellowhammer's warehouse
- **Back-of-house**: the stockroom and cooler — where reps physically walk accounts
- **Facing**: a product's shelf slots at retail; "gaining facings" = more shelf space
- **Shelf gap**: an out-of-stock position visible at the shelf level
- **CDA**: customer development agreement — cash the distributor pays to develop an account
- **Chain program**: negotiated promo deal with a chain retailer (Publix, Kroger, etc.)
- **Days-on-hand (DOH)**: inventory / daily depletion rate — 14 DOH = 2 weeks of stock
- **Tap**: draft beer dispense system; keg connects to tap line

**DO NOT USE (these are brewery words — Jake doesn't work at a brewery):**
- Fermenter, brite tank, brewhouse, cellar, packaging line
- Hop contracts, grain bill, yeast generations, mash
- "Tank capacity" as a rep constraint

### 23.2 Account types

| Type constant | Description | Examples |
|---|---|---|
| `on_premise` | Sold where consumed | Bars, restaurants, hotels, stadiums |
| `off_premise_chain` | Packaged product, chain retail | Publix, Kroger, Walmart, Target |
| `off_premise_indie` | Packaged product, independent | Local package stores, boutique grocers |
| `convenience` | Single-serve, grab-and-go | Circle K, RaceTrac, Wawa |

### 23.3 Product units

| Unit constant | Label | Typical products |
|---|---|---|
| `keg_half` | 1/2 bbl (15.5 gal) | All major beer brands |
| `keg_sixth` | 1/6 bbl (5.16 gal) | Craft beers, limited draft |
| `case_24` | 24 × 12oz | Cans and bottles |
| `case_12` | 12 × 12oz | Some craft SKUs |
| `case_4pk` | 6 × 4pk (24 units) | Red Bull 4-packs |
| `single` | Individual unit | Rarely ordered; mostly for reporting |

---

## §24 — Architecture Decision Records

Append new ADRs here as decisions are made. Never modify or delete existing ADRs.

**ADR-001: React Native (Expo) over PWA**
- Date: Day 1
- Decision: Ship as Expo React Native, not a Next.js PWA
- Rationale: Native Bluetooth (Zebra printing), native speech recognition (better accuracy), App Store/Play Store distribution, better offline performance (SQLite vs IndexedDB), native biometric auth, native push notifications
- Trade-off: Longer build times, no instant web deploy; accepted

**ADR-002: WatermelonDB over other RN offline solutions**
- Date: Day 1
- Decision: WatermelonDB for local data store
- Rationale: SQLite-backed (not IndexedDB); reactive queries that power reactive UI; designed for RN; migrations system; better performance than Realm at scale; more permissive license than Realm
- Alternatives considered: Realm (licensing concerns), expo-sqlite direct (too low-level), MMKV (no structured queries)

**ADR-003: Claude Sonnet for all AI features**
- Date: Day 1
- Decision: claude-sonnet-4-20250514 for all features
- Rationale: Sufficient intelligence for beverage domain tool use; fast enough for voice loop; cost-effective for per-rep API usage model
- Review trigger: If voice command p95 latency > 2s; switch to Haiku for voice, Sonnet for prep

**ADR-004: Zebra Link-OS via custom Expo module**
- Date: Day 3
- Decision: Write a thin Expo native module wrapping Zebra's official iOS/Android SDK
- Rationale: Zebra's SDK is the official, supported path; community packages are unmaintained; thin wrapper takes < 4 hours and gives us full SDK access
- Alternatives considered: react-native-bluetooth-escpos-printer (generic, not officially Zebra-supported), BLE raw writes (too low-level, ZPL requires connection protocol)

**ADR-005: AI API called directly from device**
- Date: Day 1
- Decision: Device calls Anthropic API directly; no intermediate server
- Rationale: Simplifies architecture; reduces latency; AI key is per-company and stored in SecureStore; acceptable for B2B use case where companies manage their own keys
- Trade-off: API key in device memory (mitigated by SecureStore); accepted for B2B context

---

## §25 — Daily Retrospectives

Fill in at end of each day. Be honest. If a target was missed, say why.

### Day 1 Retro — Foundation (PR #17)
- Targets completed: [x] Expo project + NativeWind + Ohanafy brand tokens · [x] WatermelonDB schema (10 tables incl. permissions) + 10 model classes · [x] Permission system (TDD, 27 tests) — types, matrix, fixture loader, Zustand store, PermissionGate, no-permission screen · [x] SF OAuth PKCE + token manager + biometric lock · [x] Role-driven navigation (Field Sales Rep tabs wired, others stubbed) · [x] ErrorBoundary + Sentry + PostHog (deferred init) · [x] EAS profiles + GitHub Actions CI · [x] CLAUDE.md committed
- Targets missed: none
- Blockers encountered: WatermelonDB's `Model.syncStatus` is a built-in accessor; my `@field('sync_status') syncStatus` shadowed it. Renamed JS prop to `sfSyncStatus` (column stays `sync_status` per Bible spec). Caught by `tsc`, fixed in 2 edits.
- What Claude Code did well: TDD pattern landed cleanly — wrote failing tests for `loadUserPermissions`, `usePermissionStore`, and `PermissionGate` first, then implementation. Permission matrix design captured the user's "Daniel = admin who can act as any role" requirement on first try.
- Where Claude Code needed correction: nothing significant.
- Decisions made: AppAdmin is special — grants all functional permissions in the matrix so multi-role users can switch into any functional role. Fixture loader is the Day 1–3 path; Day 4 swaps to live SF Permission Sets.
- Tomorrow's first two targets: account list with FlashList; sync engine.

### Day 2 Retro — Core Features (PR #19)
- Targets completed: [x] Demo seed (5 BHM accounts + 10 products + visits + orders) · [x] Repositories (accounts, orders, visits, sync-queue) · [x] NetInfo offline status hook + OfflineBanner · [x] LoadingSkeleton + EmptyState + SyncStatusBar · [x] Account list (FlashList, search, Needs Attention filter) · [x] Account detail (info, last order, visit history) · [x] Order entry with stepper + ProductPicker · [x] Order confirm with `pending_sync` + queued CREATE_ORDER · [x] Visit log · [x] Sync engine (sf-client with 401 refresh-retry, queue-processor, NetInfo auto-flush)
- Targets missed: real WDB integration tests with in-memory adapter. Loki/SQLite-in-memory blocked by jest env; queue-processor uses a hand-rolled fake DB instead. Validates business logic; real integration on Day 5/6 device runs.
- Blockers encountered: none.
- What Claude Code did well: extracted `useAccountList` and `useOrder` hooks early so the screens stayed thin. Sync engine's single-flight `inFlight` guard was a small thing that prevented thrash on rapid reconnects.
- Where Claude Code needed correction: none.
- Decisions made: Visit notes use last-write-wins on sync (Bible §7.4); orders created offline get a fresh local id and are flagged `created_offline=true` for managers' review.
- Tomorrow's first two targets: voice state machine; AI tools with TDD.

### Day 3 Retro — Voice + AI (PR #20)
- Targets completed: [x] @react-native-voice/voice integration · [x] Zustand voice state machine (IDLE → LISTENING → PROCESSING → CONFIRMING) · [x] Anthropic SDK client · [x] 3 AI tools with 18 fixture tests (interpret-order, interpret-note, get-account-intel) · [x] 3 agents (command, visit-prep, note) · [x] Memories repository + writer + retriever · [x] VoiceButton with mic pulse · [x] TranscriptDisplay + CommandFeedback · [x] InsightBanner with 3-sec non-blocking AI · [x] FeedbackCapture component · [x] Wired voice into order entry + visit log
- Targets missed: device voice testing (CI is JS-only).
- Blockers encountered: Anthropic SDK detects environment and refuses to run without `dangerouslyAllowBrowser: true` in RN. Fix was one flag.
- What Claude Code did well: enforced the "AI never invents data" rule at every tool boundary — `interpretOrder` returns `confidence: 'low'` for unknown products, never fabricates SKUs. Test fixture covers the unknown-product case explicitly.
- Where Claude Code needed correction: the visit-prep agent originally let the LLM override the deterministic urgency. Caught it on review and locked urgency to the deterministic value; LLM only customizes the headline copy.
- Decisions made: dev mode reads `EXPO_PUBLIC_ANTHROPIC_API_KEY` from env; production fetches from `AI_Config__mdt` post-auth and stores in SecureStore. Rationale: avoids manually rotating keys per device build during the sprint.
- Tomorrow's first two targets: ZPL templates with snapshot tests; learning agent.

### Day 4 Retro — ZPL + Learning + SFDX (PR #21)
- Targets completed: [x] 3 ZPL templates (shelf talker, product card, delivery receipt) with 22 tests + 3 snapshots · [x] Labelary preview client + offline raw-ZPL fallback · [x] Zebra printer wrapper (TS stub for now; native bridge v1.1) · [x] Label select + preview screens · [x] Learning agent with confidence model (≥4=0.9, 2-3=0.7, 1=0.5) and 5 tests · [x] AI Memories management screen · [x] expo-notifications setup + Android channel · [x] SFDX managed package skeleton with 6 custom objects (Roles §12) + Connected App migrated
- Targets missed: native Zebra Link-OS bridge (needs iOS/Android dev build with the Zebra SDK); Apex classes (Day 5+).
- Blockers encountered: delivery receipt snapshot drifted between local (US TZ) and CI (UTC) — `new Date('...Z').toLocaleDateString()` is timezone-dependent. Fixed by using `new Date(2026, 3, 30)` (local-time constructor); verified stable in TZ=UTC and TZ=America/Los_Angeles.
- What Claude Code did well: the printer wrapper stub kept every call site stable so the rest of Day 4 (label flow + history) worked without touching the native module.
- Where Claude Code needed correction: initially wrote a fragile in-memory adapter for sync-engine tests; user feedback was to use simple mocks. Fake DB pattern from Day 2 worked here too.
- Decisions made: Apex classes deferred to Day 5/6 (PMD ruleset is in CI but no `*.cls` files exist yet — the conditional-skip in CI handles this). The native Zebra bridge is a clean swap when device build lands.
- Tomorrow's first two targets: 11 Maestro flows; user guide.

### Day 5 Retro — Tests + Onboarding + Help (PR #22)
- Targets completed: [x] User guide content (7 sections from Appendix F, offline) · [x] User guide screens with case-insensitive search · [x] Coach marks (SecureStore-backed dismissal) · [x] 5-step onboarding wizard · [x] 11 Maestro E2E flows (6 Bible + 5 Roles §12) with cross-platform offline helpers · [x] Dark mode audit (no gaps — `dark:` variants from Day 1)
- Targets missed: jest `coverageThreshold` enforcement (deferred to Day 7); Maestro `debug-*` testID hooks in app code (the YAML flows are written; the in-app shims need device build).
- Blockers encountered: none.
- What Claude Code did well: 7-section user guide content went straight from Bible Appendix F to a typed array — clean export of the content layer means future translations are a one-file diff.
- Where Claude Code needed correction: initial guide search returned everything containing "the"; capped per-section hits to 3.
- Decisions made: coach marks use SecureStore not AsyncStorage to align with the existing token-storage pattern; tradeoff is slightly heavier API but consistent with the rest of the app.
- Tomorrow's first two targets: useTabletLayout hook + iPad split-pane; role-driven nav for the other 5 roles.

### Day 6 Retro — Tablet + A11y + Performance (PR #23)
- Targets completed: [x] useTabletLayout hook (≥768pt thresholds) · [x] Tablet split-pane account list/detail with no-navigation selection · [x] AccountDetailView extracted as reusable component · [x] AccountCard `accessibilityState.selected` for VoiceOver · [x] role-nav-config.ts as single source of truth · [x] 12 placeholder tab routes (sales manager, driver, driver manager, warehouse worker, warehouse manager) using shared RoleTabPlaceholder · [x] Tabs layout uses `href: null` to hide per active role · [x] A11y spot-check (every Pressable has labels/hints, lists count items)
- Targets missed: real-device performance measurements (cold launch < 2.5s, 60fps scroll, peak memory < 150MB) — needs iPhone SE 3 + Instruments. Code-level perf is in place (FlashList everywhere, React.memo with custom comparators, useCallback on every onPress, reactive WDB observables).
- Blockers encountered: none.
- What Claude Code did well: the role-nav-config + `href: null` pattern is exactly the Bible §15 contract — switching roles via the RoleSwitcher re-evaluates and re-renders the tab bar live. Manual test on web simulator confirmed.
- Where Claude Code needed correction: initially planned to NOT extract AccountDetailView and just duplicate logic in the tablet split-pane — caught the duplication and refactored.
- Decisions made: AppAdmin has no own tab set; admins switch into a functional role to use the mobile app (admin console is a separate Lightning app on Salesforce).
- Tomorrow's first two targets: README + CHANGELOG; customer admin onboarding guide.

### Day 7 Retro — Documentation + Submission (this PR)
- Submitted to App Store: **Pending** — production EAS build, App Store metadata, and screenshots require manual action (tracked in GitHub issues #1–#13)
- Submitted to Google Play: **Pending** — same blockers
- What still needs work post-launch:
  - Native Zebra Link-OS bridge (replaces `src/zpl/printer.ts` stub)
  - Real implementations of the 5 non-Sales-Rep tab sets (currently `RoleTabPlaceholder`)
  - Apex permission-set assignment helpers + admin console controllers
  - Maestro `debug-*` testID hooks (the YAML flows are spec'd; in-app shims gated on `MAESTRO_TEST_MODE` need to land before flows can actually run)
  - Anthropic key swap from `EXPO_PUBLIC_ANTHROPIC_API_KEY` env to `AI_Config__mdt` SF Custom Metadata + SecureStore
  - Real-device performance measurements per Bible §9 Day 6 targets
- Version 1.0.1 backlog (3 highest priority):
  1. **Native Zebra bridge** — without it, reps can't actually print; the stub is a documentation/demo path. Single highest-impact post-launch item.
  2. **Sales Manager + Driver tab sets** — pilot will reveal whether these need to ship before the Field Sales Rep is widely deployed (drivers using the same accounts may surface ordering needs).
  3. **Production AI key path** — moving the Anthropic key to SF Custom Metadata removes the dev-only `EXPO_PUBLIC_ANTHROPIC_API_KEY` from production bundles, which is required for security review submission.

---

# Appendix A — ZPL Template Library (Production-Ready)

## A.1 Shelf Talker (2.5" × 1.5", 8 dpmm = 203 dpi)

ZQ520/ZQ630 most common template. Used at on-premise and off-premise shelf level.

```typescript
// src/zpl/templates/shelf-talker.ts

export interface ShelfTalkerParams {
  productName: string;         // Max 22 chars before truncation (enforced)
  skuCode: string;
  pricePerCase: number;
  promoLine?: string;          // Optional — e.g. "New Arrival!" Max 28 chars
  distributor?: string;        // Defaults to "Yellowhammer Beverage"
}

const MAX_PRODUCT_NAME = 22;
const MAX_PROMO_LINE = 28;
const LABEL_WIDTH_PW = 400;    // 2.5" × 8dpmm × 20 = 400 dots (approx)
const LABEL_HEIGHT_LL = 240;   // 1.5" × 8dpmm × 20 = 240 dots

export function generateShelfTalker(params: ShelfTalkerParams): string {
  const name = params.productName.length > MAX_PRODUCT_NAME
    ? params.productName.substring(0, MAX_PRODUCT_NAME - 1) + '…'
    : params.productName;

  const promo = params.promoLine
    ? (params.promoLine.length > MAX_PROMO_LINE
        ? params.promoLine.substring(0, MAX_PROMO_LINE - 1) + '…'
        : params.promoLine)
    : null;

  const price = `$${params.pricePerCase.toFixed(2)}`;
  const dist = params.distributor ?? 'Yellowhammer Beverage';

  return [
    '^XA',
    '^CI28',               // UTF-8 encoding
    `^PW${LABEL_WIDTH_PW}`,
    `^LL${LABEL_HEIGHT_LL}`,
    '',
    // Product name — large bold
    `^FO20,18^A0B,0,0^BY3`,   // Reset
    `^FO20,18^A0N,36,36^FD${name}^FS`,
    // SKU code — small gray
    `^FO20,62^A0N,20,20^FD${params.skuCode}^FS`,
    // Price — largest element
    `^FO20,90^A0N,54,54^FD${price}^FS`,
    // Promo line (if present)
    ...(promo ? [`^FO20,152^A0N,22,22^FD${promo}^FS`] : []),
    // Distributor — small footer
    `^FO20,${LABEL_HEIGHT_LL - 26}^A0N,16,16^FD${dist}^FS`,
    '',
    '^XZ',
  ].join('\n');
}
```

## A.2 Product Feature Card (4" × 3", 8 dpmm)

Used for new product launches, seasonal features, cooler door placement.

```typescript
// src/zpl/templates/product-card.ts

export interface ProductCardParams {
  productName: string;       // Max 28 chars
  tagline: string;           // Max 40 chars
  abv?: number;              // Optional — omit for Red Bull, NA beverages
  servingSize: string;       // e.g. "1/2 bbl keg" or "24 × 8.4oz"
  keyFacts: string[];        // 2-3 items, max 38 chars each
  skuCode: string;
  distributor?: string;
}

const CARD_WIDTH_PW = 640;
const CARD_HEIGHT_LL = 480;

export function generateProductCard(params: ProductCardParams): string {
  const name = params.productName.substring(0, 28);
  const tagline = params.tagline.substring(0, 40);
  const facts = params.keyFacts.slice(0, 3).map(f => f.substring(0, 38));
  const dist = params.distributor ?? 'Yellowhammer Beverage';

  let yPos = 25;
  const lines: string[] = [
    '^XA',
    '^CI28',
    `^PW${CARD_WIDTH_PW}`,
    `^LL${CARD_HEIGHT_LL}`,
    '',
  ];

  // Product name
  lines.push(`^FO30,${yPos}^A0N,48,48^FD${name}^FS`);
  yPos += 62;

  // Tagline
  lines.push(`^FO30,${yPos}^A0N,26,26^FD${tagline}^FS`);
  yPos += 40;

  // Divider
  lines.push(`^FO30,${yPos}^GB580,2,2^FS`);
  yPos += 18;

  // ABV + serving size
  if (params.abv !== undefined) {
    lines.push(`^FO30,${yPos}^A0N,22,22^FDABV: ${params.abv.toFixed(1)}%   ${params.servingSize}^FS`);
  } else {
    lines.push(`^FO30,${yPos}^A0N,22,22^FD${params.servingSize}^FS`);
  }
  yPos += 38;

  // Key facts
  for (const fact of facts) {
    lines.push(`^FO30,${yPos}^A0N,22,22^FD\u2022 ${fact}^FS`);
    yPos += 34;
  }

  yPos += 10;
  lines.push(`^FO30,${yPos}^GB580,2,2^FS`);
  yPos += 15;

  // SKU + distributor footer
  lines.push(`^FO30,${yPos}^A0N,18,18^FDSKU: ${params.skuCode}   ${dist}^FS`);

  lines.push('', '^XZ');
  return lines.join('\n');
}
```

## A.3 Delivery Receipt (4" × 6", 8 dpmm)

Account manager signs this on delivery. Replaces paper receipt books.

```typescript
// src/zpl/templates/delivery-receipt.ts

export interface DeliveryReceiptParams {
  accountName: string;        // Max 30 chars
  deliveryDate: string;       // "April 25, 2026"
  repName: string;
  orderNumber: string;
  lines: Array<{
    productName: string;      // Max 28 chars
    quantity: number;
    unit: string;             // "keg" | "case"
    unitPrice: number;
  }>;
  totalAmount: number;
  distributor?: string;
}

export function generateDeliveryReceipt(params: DeliveryReceiptParams): string {
  const dist = params.distributor ?? 'Yellowhammer Beverage';
  let y = 20;
  const w = 640;
  const lines: string[] = [
    '^XA', '^CI28', `^PW${w}`, '^LL960', '',
  ];

  const push = (cmd: string) => lines.push(cmd);

  // Header
  push(`^FO30,${y}^A0N,34,34^FD${dist}^FS`); y += 46;
  push(`^FO30,${y}^A0N,22,22^FDDelivery Receipt^FS`); y += 30;
  push(`^FO30,${y}^A0N,20,20^FD${params.deliveryDate}   Order #${params.orderNumber}^FS`); y += 32;

  // Account name
  push(`^FO30,${y}^GB580,2,2^FS`); y += 14;
  push(`^FO30,${y}^A0N,28,28^FD${params.accountName.substring(0, 30)}^FS`); y += 40;
  push(`^FO30,${y}^GB580,2,2^FS`); y += 14;

  // Line items
  for (const line of params.lines) {
    const lineTotal = (line.quantity * line.unitPrice).toFixed(2);
    const productShort = line.productName.substring(0, 28);
    push(`^FO30,${y}^A0N,20,20^FD${line.quantity}× ${line.unit} ${productShort}^FS`);
    push(`^FO500,${y}^A0N,20,20^FD$${lineTotal}^FS`);
    y += 32;
  }

  // Total
  y += 8;
  push(`^FO30,${y}^GB580,2,2^FS`); y += 14;
  push(`^FO30,${y}^A0N,28,28^FDTOTAL^FS`);
  push(`^FO460,${y}^A0N,28,28^FD$${params.totalAmount.toFixed(2)}^FS`);
  y += 55;

  // Signature line
  push(`^FO30,${y}^GB360,2,2^FS`); y += 12;
  push(`^FO30,${y}^A0N,18,18^FDReceived by (signature)^FS`); y += 40;
  push(`^FO30,${y}^GB360,2,2^FS`); y += 12;
  push(`^FO30,${y}^A0N,18,18^FDPrinted name^FS`); y += 42;

  // Rep
  push(`^FO30,${y}^A0N,18,18^FDDelivered by: ${params.repName}^FS`);

  lines.push('', '^XZ');
  return lines.join('\n');
}
```

## A.4 ZPL validation utility

```typescript
// src/zpl/validator.ts

export interface ZplValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateZpl(zpl: string, widthInches: number, heightInches: number, dpmm = 8): ZplValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Must start and end correctly
  if (!zpl.trimStart().startsWith('^XA')) errors.push('Missing ^XA (label start)');
  if (!zpl.trimEnd().endsWith('^XZ')) errors.push('Missing ^XZ (label end)');

  // Extract ^PW and verify
  const pwMatch = zpl.match(/\^PW(\d+)/);
  if (pwMatch) {
    const pwDots = parseInt(pwMatch[1]);
    const expectedMax = Math.ceil(widthInches * dpmm * 25.4);
    if (pwDots > expectedMax) {
      errors.push(`^PW${pwDots} exceeds label width (max ${expectedMax} for ${widthInches}" at ${dpmm}dpmm)`);
    }
  }

  // Check all ^FO x coordinates are within label width
  const foCoords = [...zpl.matchAll(/\^FO(\d+),/g)].map(m => parseInt(m[1]));
  const maxX = Math.ceil(widthInches * dpmm * 25.4);
  const overflowX = foCoords.filter(x => x > maxX - 20);
  if (overflowX.length > 0) {
    warnings.push(`${overflowX.length} field(s) near or beyond right edge: x=${overflowX.join(', ')}`);
  }

  // Must have ^CI28 for UTF-8 support
  if (!zpl.includes('^CI28')) {
    warnings.push('Missing ^CI28 (UTF-8 charset) — special characters may not render');
  }

  return { isValid: errors.length === 0, errors, warnings };
}
```

---

# Appendix B — AI System Prompts (Production-Ready)

## B.1 Voice command interpreter

```
You are the AI voice assistant for Ohanafy Field, a mobile sales app for beverage distributor reps.

The rep (Jake) is currently visiting an account. He has spoken a voice command. His hands may be busy.
You are interpreting his speech to take an action in the app.

You have access to these tools:
- interpret_order_command: when the rep is adding, changing, or removing items from an order
- interpret_note_command: when the rep is dictating a visit note, observation, or follow-up action
- get_account_intelligence: when the rep asks about the account history, past orders, or contact info
- suggest_label_for_product: when the rep wants to print a shelf talker, product card, or receipt

## Routing rules
- "add [product]", "put [qty] [product]", "[qty] of [product]", "a case of [product]" → interpret_order_command
- "note [text]", "log [text]", "remember [text]", "write down [text]" → interpret_note_command
- "when did I last order", "what did I order", "who's the contact" → get_account_intelligence
- "print", "shelf talker", "label", "receipt" → suggest_label_for_product

## Response rules
1. Call exactly one tool. Never chain two tools in one turn.
2. Respond to the rep in 1–2 sentences maximum.
3. Be specific: "Added 2 kegs Pale Ale — total now $347." not "Done!"
4. Use beverage vocabulary: keg, case, tap, facing, account.
5. If the command is ambiguous, make the most reasonable interpretation and confirm it.
   Never ask the rep to repeat themselves — they're in a noisy bar.
6. If the command is completely uninterpretable (< 1% of cases): respond "Didn't catch that clearly — want to try again?"

## What you NEVER do
- Invent product names not in the provided catalog
- Create or modify an order without explicit tool call and subsequent rep confirmation
- Mention that you are Claude or that you are an AI
- Respond in more than 2 sentences
```

## B.2 Visit prep (pre-call intelligence)

```
You are the pre-call intelligence agent for Ohanafy Field.

A field sales rep is about to walk into an account. Your job is to surface the single most
actionable insight that will improve this sales call.

## Input
You will receive:
- Account name, type, and basic info
- Days since last order
- Last 3 visit notes
- Current open orders
- Top SKUs by order frequency (last 6 months)
- Relevant AI memories for this rep + account (if any)

## Output — strict JSON only
{
  "insight": "string — max 120 chars. One thing. Be specific. Connect dots across data points.",
  "suggestedItems": ["sku_id_1", "sku_id_2"],    // 1-3 SKU IDs, or empty array
  "talkingPoints": ["string", "string"],           // 2-3 items, max 70 chars each
  "urgency": "high" | "medium" | "low",
  "calibrated": boolean    // true if memories influenced this insight
}

## Urgency guide
- high: 28+ days since last order, or last note flagged a problem, or open complaint
- medium: 14-28 days, healthy account but could use a nudge
- low: < 14 days, active account

## Insight quality rules
1. ONE insight. Not "here are 3 things." One.
2. It must be specific to THIS account's data. "They haven't ordered in 5 weeks" is specific.
   "Try to upsell" is not.
3. Connect dots: if the last note mentions a tap problem AND the account hasn't reordered,
   those facts belong together in the insight.
4. If memories exist that calibrate this insight, use them. Flag calibrated = true.
5. The insight text will be shown on a phone screen — write for 2 seconds of reading.

## Return JSON only. No preamble. No explanation. No markdown.
```

## B.3 Note cleanup agent

```
You are a note cleanup agent for a beverage distributor field sales CRM.

A field sales rep has just dictated a voice note. The raw transcript may contain:
- Filler words ("um", "uh", "like", "you know")
- Repetitions ("add, uh add two kegs")
- Voice recognition errors ("Pale Ale" may have been heard as "pale tail")
- Fragmented sentences (speaking while walking)

Your job: clean the transcript into a professional 2-3 sentence CRM note.

## Rules
1. Remove all filler words
2. Fix obvious speech recognition errors using context (product names, beverage terms)
3. Preserve ALL factual observations — do not summarize away specifics
4. Past tense: "discussed" not "discussing"
5. Include next steps if mentioned: "will follow up on X" or "draft tech needed"
6. Maximum 3 sentences. Minimum 1.
7. Return the cleaned note text only — no explanation, no preamble, no quotes.

## Examples
Input:  "um so I talked to Marcus and he said the uh the lager tap is uh it's been fixed actually
         and he wants to uh he's interested in the summer seasonal early commitment thing"
Output: "Spoke with Marcus — lager tap issue has been resolved. He expressed interest in
         the summer seasonal early commitment program."

Input:  "note check back on pale tail display in two weeks"
Output: "Follow up in two weeks to check on Pale Ale display placement."

## Return the cleaned note only.
```

## B.4 Memory synthesis prompt

```
You are a learning agent for an AI sales assistant. You analyze patterns in a rep's
feedback on AI suggestions to identify durable rules that should be remembered.

You will receive a list of feedback events — cases where the rep edited or rejected
an AI output. Each event has: the original AI output, what the rep changed it to,
and the context.

Your job: identify 1-3 durable patterns from these events that should be stored as
AI memories to improve future accuracy.

## Return JSON array only:
[
  {
    "key": "brief_pattern_name",
    "value": "what_the_pattern_means",
    "confidence": 0.0-1.0,
    "category": "COMMAND_PATTERN" | "ACCOUNT_PREFERENCE" | "NOTE_STYLE" | "INSIGHT_CALIBRATION"
  }
]

## Rules
1. Only return patterns with confidence > 0.5
2. Only return patterns that appear in 2+ events (not one-offs)
3. Be specific: "couple kegs = 2 units" is good. "rep prefers accuracy" is not.
4. Confidence 0.9+ requires 4+ consistent examples; 0.7+ requires 2-3; below 0.7 only for directional hints.
5. If no clear patterns emerge: return empty array [].
6. Return JSON only. No explanation.
```

---

# Appendix C — WatermelonDB Schema

Full schema is in `src/db/schema.ts` — defined in §5 of this document. Reproduced here for quick reference as an entity-relationship summary.

```
accounts ─────────────────────────────────────────────
  id (WDB local)
  sf_id → ohfy__Account__c.Id
  name, account_type, territory_id
  contact_name, contact_title, contact_phone
  address_street, address_city, address_state
  latitude, longitude
  last_order_date, last_visit_date, days_since_last_order
  ytd_revenue, needs_attention, is_archived

orders ──── belongs_to accounts ───────────────────────
  sf_id → ohfy_field__Order__c.Id (null until synced)
  account_id, account_sf_id
  rep_id, status, sync_status, sync_attempts
  order_date, delivery_date, total_amount, notes
  created_offline

order_lines ──── belongs_to orders ────────────────────
  order_id, product_id, product_sf_id
  product_name, quantity, unit, unit_price, line_total

visits ──── belongs_to accounts ───────────────────────
  sf_id → ohfy_field__Visit__c.Id (null until synced)
  account_id, account_sf_id, rep_id
  visit_date, duration_minutes
  note, raw_transcript
  ai_insight, insight_feedback
  order_id (optional link to order placed this visit)
  sync_status, sync_attempts, created_offline

label_prints ──── belongs_to accounts ─────────────────
  account_id, product_id (optional)
  template_type, product_name
  printer_serial, printed_at
  zpl_snapshot, sync_status

sync_queue ────────────────────────────────────────────
  operation_type, entity_type, entity_id
  payload_json, status, attempts
  last_error, created_at, processed_at

memories ──── belongs_to rep (rep_id) ─────────────────
  rep_id, account_id (optional — null = global)
  category, key, value (JSON)
  confidence (0.0-1.0), source
  use_count, last_used_at
  sf_id, sync_status

feedback_events ────────────────────────────────────────
  rep_id, account_id (optional)
  event_type, ai_output, user_correction
  context_json, created_at, synthesized
```

---

# Appendix D — Salesforce Data Model

Custom objects (unmanaged for pilot; 2GP package for production) in `ohfy_field__` namespace.

| Object | API Name | Key fields |
|---|---|---|
| Field Visit | `ohfy_field__Visit__c` | Account, Rep, Date, Note, RawTranscript, AiInsight, SyncSource |
| Field Order | `ohfy_field__Order__c` | Account, Rep, OrderDate, TotalAmount, Status, CreatedOffline |
| Field Order Line | `ohfy_field__OrderLine__c` | Order, ProductSfId, ProductName, Qty, Unit, UnitPrice, LineTotal |
| Label Print Log | `ohfy_field__LabelPrint__c` | Account, TemplateType, ProductName, PrinterSerial, PrintedAt |
| Rep Memory | `ohfy_field__RepMemory__c` | RepId, AccountId, Category, Key, Value, Confidence, Source |
| Sync Log | `ohfy_field__SyncLog__c` | RepId, SyncDate, ItemsPushed, ItemsPulled, Duration, Trigger |

**Note:** `ohfy_field__RepMemory__c` stores rep AI memories in Salesforce so they survive device changes and are available to managers for coaching. Confidence < 0.3 memories are not synced to Salesforce (pruned locally only).

---

# Appendix E — Test Specification

Full test case list. Every item must have a corresponding test before Day 6 ends.

## E.1 Unit tests — AI tools

| Test ID | Description | Fixture | Expected |
|---|---|---|---|
| AI-T-001 | Order: "2 kegs pale ale" | demoCatalog | itemsToAdd = [{pale-ale-half-bbl, qty:2, unit:keg}] |
| AI-T-002 | Order: "couple kegs" | demoCatalog | qty = 2 |
| AI-T-003 | Order: "a case of red bull" | demoCatalog | unit = case, product matches red-bull* |
| AI-T-004 | Order: unknown product | demoCatalog | confidence = low |
| AI-T-005 | Order: does not mutate input | demoCatalog | input array unchanged |
| AI-T-006 | Note: removes filler words | raw transcript | cleaned text has no "um", "uh" |
| AI-T-007 | Note: preserves specifics | raw transcript | product names preserved |
| AI-T-008 | Intel: > 28 days = high urgency | account context | urgency = high |
| AI-T-009 | Intel: < 14 days = low urgency | account context | urgency = low |
| AI-T-010 | Intel: returns JSON only | account context | JSON.parse succeeds |

## E.2 Unit tests — ZPL templates

| Test ID | Description | Expected |
|---|---|---|
| ZPL-T-001 | Shelf talker: starts with ^XA | ✓ |
| ZPL-T-002 | Shelf talker: ends with ^XZ | ✓ |
| ZPL-T-003 | Shelf talker: no ^FO x > 380 | ✓ |
| ZPL-T-004 | Shelf talker: long name truncated | name ≤ 22 chars in output |
| ZPL-T-005 | Shelf talker: price formatted $142.00 | ✓ |
| ZPL-T-006 | Shelf talker: promo line included when provided | ✓ |
| ZPL-T-007 | Shelf talker: no promo line when not provided | ✓ |
| ZPL-T-008 | Shelf talker: snapshot regression | matches stored snapshot |
| ZPL-T-009 | Product card: 3 key facts max | ✓ |
| ZPL-T-010 | Delivery receipt: line totals correct | unitPrice × qty = lineTotal |

## E.3 Unit tests — sync engine

| Test ID | Description | Expected |
|---|---|---|
| SYNC-T-001 | CREATE_ORDER: creates SF record | mockSfClient.createRecord called |
| SYNC-T-002 | CREATE_ORDER: updates syncStatus on success | syncStatus = 'synced' |
| SYNC-T-003 | CREATE_ORDER: increments attempts on failure | attempts += 1 |
| SYNC-T-004 | CREATE_ORDER: sets status to 'failed' at attempts ≥ 3 | status = 'failed' |
| SYNC-T-005 | Conflict: server wins for account data | local account overwritten |
| SYNC-T-006 | Queue: does not process items with status='done' | ✓ |
| SYNC-T-007 | Queue: does not process items with status='failed' | ✓ |
| SYNC-T-008 | Queue: processes items in created_at order | ✓ |

## E.4 Maestro E2E flows

| Flow | Steps | Pass criteria |
|---|---|---|
| onboarding.yaml | All 5 onboarding steps | Reaches home screen with accounts visible |
| account-visit.yaml | List → detail → order → confirm → sync | Order synced to SF |
| voice-order.yaml | Voice command → accept → verify line item | Line item added correctly |
| offline-sync.yaml | Create order offline → reconnect → sync | SF record created |
| zpl-print.yaml | Select label → preview → print | Preview rendered; print (simulated) logged |
| ai-correction-learning.yaml | 3 corrections → learning agent → verify memory | 1+ new memory created |

---

# Appendix F — User Guide

## Ohanafy Field User Guide v1.0

*Available in-app at Settings → User Guide. Also available at docs.ohanafy.com/field.*

---

### Section 1: Getting Started

**Setting up Ohanafy Field takes about 5 minutes.** After downloading the app:

1. **Sign in with Salesforce.** Tap "Sign in with Salesforce" and log in with your Ohanafy credentials. Ohanafy Field connects to your Salesforce org to load your territory.

2. **Let the app sync.** On first launch, Ohanafy Field downloads your accounts, products, and order history. This takes 30–60 seconds on a good connection. After that, everything is available offline.

3. **Pair your Zebra printer.** If you have a Zebra ZQ520 or ZQ630 printer, go to Settings → Printers to pair it. You can also do this during onboarding. The app works without a printer — you just won't be able to print labels.

4. **Enable Face ID / Touch ID.** When prompted, allow biometric unlock. This lets you open the app with one glance instead of typing your PIN each time.

**After setup,** your account list will be on the home screen, sorted alphabetically. Accounts needing attention (not visited in 21+ days) are highlighted and can be filtered with the "Needs Attention" button.

---

### Section 2: Account Visits

**Before you walk in:**
Open the account from your list. Ohanafy Field shows you an **AI insight** at the top of the account screen — the most important thing to know before you knock. This might be a stale reorder, a flagged issue from your last visit, or a selling opportunity.

Tap 👍 if the insight was helpful. Tap 👎 if it wasn't. This feedback helps the AI learn what matters to you and your accounts.

**During the visit:**
- Use the **Voice button** (microphone icon, bottom right) to log notes and orders hands-free
- The **Visit History** section shows your last 3 visits with notes
- The **Last Order** summary shows the last placed order and its status

**After the visit:**
Tap "Log Visit" to save the visit to Ohanafy Field. You can add or edit your notes before saving. If you're offline, the visit is saved locally and syncs when you get signal.

---

### Section 3: Taking Orders

Tap "New Order" from the account detail screen to open the order entry screen.

**Adding items:**
- Browse products by category (Beer Kegs / Beer Cases / Energy / Other)
- Tap a product to add it; use the +/- stepper to change quantity
- Swipe left on a line item to remove it
- The order total updates automatically

**Using voice to order:**
Say the mic button and speak naturally. For example:
- *"Add 2 kegs Pale Ale"*
- *"Put a case of Modelo on the order"*
- *"Three Red Bull Sugarfrees"*

The AI will show you what it understood. Tap **Accept** to add it, **Edit** to change it, or **Reject** to start over.

**Confirming the order:**
Tap "Confirm Order" to review the full order. Add a delivery date and any notes, then tap "Place Order." If you're offline, the order is saved locally (shown as "Pending Sync") and submitted to Salesforce when you reconnect.

---

### Section 4: Voice Commands

Ohanafy Field understands natural speech. You don't need to use specific phrases — speak the way you normally would.

**Order commands:**
- "Add [quantity] [product]" — adds to current order
- "Put [quantity] [product] on the order" — same
- "Remove the [product]" — removes from order
- "Change the [product] to [quantity]" — updates quantity

**Note commands:**
- "Note [text]" — logs a visit note
- "Log that [text]" — same
- "Remember [text]" — same

**Tips for better accuracy:**
- Speak clearly and at a normal pace — the app handles natural speech
- If the AI gets a product name wrong, tap **Edit** and correct it; the AI learns from your corrections over time
- Background noise (bar music, warehouse sounds) reduces accuracy — move to a quieter spot for complex orders
- You don't need to say the full product name: "Pale Ale," "Bud Light," "Red Bull Sugar Free" all work

---

### Section 5: Label Printing

Ohanafy Field can print shelf talkers, product cards, and delivery receipts directly to your Zebra ZQ520 or ZQ630.

**Before printing:**
- Your Zebra printer must be paired via Bluetooth (Settings → Printers)
- Load the correct label stock (see your label type's size in §5.2 below)
- The printer must be powered on and within Bluetooth range (~30 feet)

**Printing a shelf talker:**
1. From an account detail or order screen, tap "Print Label"
2. Select "Shelf Talker"
3. Choose the product
4. Tap the preview to verify the label looks correct
5. Tap "Print"

The shelf talker prints in seconds. Hand it to the buyer while you're still in the store.

**Label sizes:**
| Label type | Size | Stock code |
|---|---|---|
| Shelf talker | 2.5" × 1.5" | Zebra ZP #10010044 or equivalent |
| Product card | 4" × 3" | Zebra #800274-605 or equivalent |
| Delivery receipt | 4" × 6" | Zebra #800274-607 or equivalent |

**If the printer won't connect:**
1. Make sure Bluetooth is enabled on your phone
2. Make sure the printer is powered on (green status light)
3. Try "Forget Printer" and re-pair in Settings → Printers
4. Check that the label stock is loaded correctly (media sensing light should be off)

---

### Section 6: AI Features

Ohanafy Field's AI gets smarter the more you use it. Here's how it works.

**AI visit prep:** Before each visit, the AI analyzes your account's order history and visit notes to surface one key insight. This is not a generic tip — it's specific to this account's data.

**AI voice commands:** When you speak, the AI interprets your words into app actions. It understands products by partial name, common abbreviations, and context.

**How the AI learns:**
Every time you accept, edit, or reject an AI suggestion, the app learns. After several corrections:
- The AI gets better at recognizing your product shorthand
- Account-specific patterns are remembered (e.g., The Rail always orders in pairs)
- Your note style is learned over time

**Reviewing your AI memories:**
Go to Settings → AI Memory to see what the AI has learned. You can edit or delete any memory. Memories are saved to Salesforce, so they're available on any device you use.

**A badge that says "customer-calibrated"** on an AI insight means the AI used past corrections and feedback from your visits to this specific account — the insight is more personalized than the default.

---

### Section 7: Troubleshooting

**The app won't sync:**
- Check that you have signal (the offline banner will say "Offline" if not)
- Tap "Sync Now" in Settings to manually trigger a sync
- Check Settings → Sync Status for any failed items
- If items show "Failed after 3 attempts," contact support with the error details

**Voice commands are inaccurate:**
- Speak clearly and at a normal pace
- Try moving to a quieter location
- If a specific product name is consistently misheard, use Edit to correct it — the AI will learn the correct mapping after 2-3 corrections
- As a last resort, add items manually using the product search

**Printer won't print:**
- Check Bluetooth is on and the printer is powered and within range
- Check the printer has label stock loaded
- Try a calibration print from the printer menu (hold the feed button)
- Re-pair the printer in Settings → Printers

**An order shows "Sync Failed":**
- This usually means a Salesforce session issue. Go to Settings → Account and tap "Refresh Connection"
- If the error persists, export the order as a PDF (tap the order → Share) and enter it manually as a backup

**Contacting support:**
Email support@ohanafy.com. Tap "Contact Support" in Settings for a pre-filled email with your device info and app version.

---

# Appendix G — In-App Onboarding Script

## Step 1: Welcome

```
Screen:
  [Ohanafy Field logo + illustration of a rep at an account]

Heading: Welcome to Ohanafy Field

Body: Your territory. Your accounts. Your AI assistant.
Works offline, listens to your voice, prints labels on the spot.

CTA: [Get Started]  |  [Sign in]  (already signed in — skip to Step 2)
```

## Step 2: Your Territory

```
Screen:
  [Rep name + territory summary]
  "Welcome, Jake. You're set up for Birmingham South territory."
  "36 accounts loaded to your device."

  [Territory account type breakdown]
  On-premise: 14
  Off-premise chain: 12
  Off-premise indie: 7
  Convenience: 3

Sub-heading: Your data is ready to use offline.

CTA: [Continue]
```

## Step 3: Pair Your Printer

```
Screen:
  [Zebra printer illustration]

Heading: Pair your label printer

Body: Connect your Zebra ZQ520 or ZQ630 to print shelf talkers
and delivery receipts without going back to the office.

CTA: [Find My Printer]
     [Skip for now →]

On [Find My Printer]:
  → Bluetooth scan screen → shows discovered printers
  → Tap to pair
  → "ZQ520 paired. You're ready to print."

On [Skip]:
  → Store skip in PostHog + SecureStore
  → Continue to Step 4
```

## Step 4: Try Your First Visit (Guided)

```
Screen:
  [Account List — first account highlighted with coach mark]

Coach mark on account card:
  "Your accounts are here. Tap one to see AI insights and start an order."

[On tap → Account Detail — InsightBanner highlighted]

Coach mark on InsightBanner:
  "This is your pre-call briefing. The AI scanned the account's history and surfaced
  the most important thing to know. Tap 👍 or 👎 to teach it your preferences."

[User dismisses mark → VoiceButton highlighted]

Coach mark on VoiceButton:
  "Tap the mic and speak. 'Add 2 kegs Pale Ale.' The AI will confirm before adding anything."

[User dismisses mark → SyncStatusBar highlighted if visible]

Coach mark on SyncStatusBar:
  "This shows items waiting to sync to Salesforce. When you get signal, they sync automatically."

CTA: [I'm ready]
```

## Step 5: Done

```
Screen:
  [Checkmark illustration]

Heading: You're all set.

Body: Ohanafy Field is ready. Your accounts are cached for offline use.
The AI will get smarter as you use it.

If you ever need help: tap the ? button on any screen, or go to Settings → User Guide.

CTA: [Go to My Accounts]
```

---

**End of Ohanafy Field — Product Engineering Bible v1.0**

*One engineer. One week. One shippable product.*

*Day 1: Foundation. Day 2: Core. Day 3: Voice + AI. Day 4: ZPL + Learning. Day 5: Tests + Onboarding. Day 6: Tablet + A11y + Polish. Day 7: Submit.*

*The rep's got a printer on their belt and an AI in their ear. Go build something they'll actually use.* 🍺📱🖨️
