# Changelog

All notable changes to Ohanafy Field. Format follows [Keep a Changelog](https://keepachangelog.com).

## [1.0.0] — 2026-04-27

First public release. Built end-to-end in a 7-day sprint.

### Added

**Field Sales Rep — fully implemented**
- Account list with search, "Needs Attention" filter, FlashList rendering
- Account detail with AI pre-call insight, recent visits, last order pill
- Order entry with line-item stepper, swipe-to-remove, ProductPicker flyout, live total
- Order confirm with `pending_sync` status and queued CREATE_ORDER sync job
- Visit log with text input or voice dictation; auto-cleans filler words
- Voice commands: "add 2 kegs Pale Ale" → CommandFeedback → Accept/Edit/Reject
- AI memory system: every accept/edit/reject becomes a FeedbackEvent; learning agent synthesizes patterns into stable Memory records with confidence scores

**Auth & permissions**
- Salesforce OAuth 2.0 PKCE flow with refresh-token retry on 401
- Biometric lock (Face ID / Touch ID / passcode fallback)
- 7 application roles (App Admin + 6 functional) with permission matrix
- Multi-role users get a role switcher in Settings
- No-permission screen for users without an `ohfy_field__` Permission Set

**Offline-first**
- Every read served from WatermelonDB; network only used for sync
- Sync queue durably persists across app restarts
- Conflict resolution per Bible §7.4 (server wins for accounts, last-write-wins for visit notes)
- Auto-flush on reconnect via NetInfo subscription
- Offline banner + sync status bar surface state in the UI

**ZPL printing**
- 3 templates: shelf talker (2.5×1.5"), product card (4×3"), delivery receipt (4×6")
- Labelary preview API integration (online); raw ZPL fallback (offline)
- Zebra printer wrapper (TypeScript stub for v1.0; native Zebra Link-OS bridge in v1.1)
- Print history stored in the `label_prints` table

**Onboarding & help**
- 5-step onboarding wizard (welcome → territory → printer → first-visit → done)
- Coach marks on key screens, dismissed persistently via SecureStore
- 7-section user guide bundled offline; case-insensitive search across all content
- AI Memories management screen with run-learning-now button + delete

**Tablet & accessibility**
- iPad / Android tablet split-pane (≥768pt) with master-detail account view
- VoiceOver / TalkBack support: every Pressable has `accessibilityRole`, `accessibilityLabel`, `accessibilityHint`
- Lists announce item counts; loading states use `accessibilityLiveRegion`
- Dynamic Type support — no fixed font sizes, uses NativeWind text classes throughout

**Salesforce managed package (`packages/sfdx-package/`)**
- Connected App with PKCE-required OAuth (callback `com.ohanafy.field://oauth/callback`)
- 6 custom objects per Roles §12: `Admin_Config__mdt`, `Admin_Audit_Log__c`, `ZPL_Template__c`, `Territory_Assignment__c`, `Notification_Rule__c`, `AI_Config__mdt`
- PMD ruleset (`scripts/pmd-ruleset.xml`) enforces AppExchange Security Review §3 — zero violations required in CI

**Observability**
- Sentry React Native for crash + error tracking
- PostHog for product analytics (deferred init, no PII)
- ErrorBoundary on every screen with "Try Again" recovery

**Test suite**
- 83 unit tests across 13 suites: permissions (27), AI tools (18), ZPL templates (22), sync engine (4), learning agent (5), user guide (7)
- 3 snapshot tests (timezone-stable)
- 11 Maestro E2E flows (6 Bible + 5 Roles §12) with cross-platform offline-mode helpers

### Stack

Expo SDK 52, React Native 0.76, TypeScript strict, Expo Router v3, NativeWind v4, WatermelonDB, TanStack Query v5, Zustand v5, FlashList, Reanimated v3, `@react-native-voice/voice`, Anthropic Claude Sonnet, Sentry, PostHog, Maestro, Jest, EAS.

### Deferred to v1.1

- Native Zebra Link-OS bridge (the TypeScript stub in `src/zpl/printer.ts` keeps every call site stable; the native module replaces the stub on the device build)
- Real implementations of the 5 non-Sales-Rep tab sets (Sales Manager, Driver, Driver Manager, Warehouse Worker, Warehouse Manager) — placeholders ship in v1.0 so role-driven nav is functional
- Apex permission-set assignment helpers + admin console controllers
- Anthropic API key fetched from Salesforce Custom Metadata (`AI_Config__mdt`) and stored in SecureStore on first auth — currently uses `EXPO_PUBLIC_ANTHROPIC_API_KEY` from env for dev
- Maestro `debug-*` testID hooks (the YAML flows are written; the in-app `MAESTRO_TEST_MODE` shims plug in on the device build)
- Real-device performance measurements per Bible §9 Day 6 targets (cold launch < 2.5s, warm < 0.8s, peak memory < 150MB) — needs an iPhone SE 3 + Instruments

### Known issues

None blocking submission. App Store + Google Play submission requires manual store-side actions tracked in [GitHub issues](https://github.com/dzeder/ohanafy-field/issues).
