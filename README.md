# Ohanafy Field

A native mobile app (iOS + Android) for field sales reps, drivers, and warehouse workers at beverage distributors. Offline-first, AI-powered, prints labels on the spot.

> **Status:** v1.0.0 feature-complete (Day 6 of a 7-day sprint). Day 7 = docs + store submission. See `CHANGELOG.md`.

## What it does

| | |
|---|---|
| **Field Sales Rep** | Visit accounts, place orders, log notes, print shelf talkers — all offline. AI surfaces a pre-call insight before each visit and learns from your corrections. |
| **Sales Manager** | Team activity, large-order approvals, coverage gaps, coaching notes. *(v1.1)* |
| **Driver** | Today's route, sign-on-glass receipts, exception logging. *(v1.1)* |
| **Driver Manager** | Dispatch board, route building, exception triage. *(v1.1)* |
| **Warehouse Worker** | Pick lists, inbound receiving, bin labels. *(v1.1)* |
| **Warehouse Manager** | Operations dashboard, inventory, worker productivity. *(v1.1)* |

The Field Sales Rep flow is fully implemented end-to-end. The other five role tab sets are placeholders that ship in v1.1 once the pilot validates the rep experience.

## Quickstart

Prereqs: macOS 14+, Xcode 16+, Android Studio, Node 20+, Salesforce sandbox with a PKCE-enabled External Client App, Anthropic API key, Sentry + PostHog projects.

```bash
git clone https://github.com/dzeder/ohanafy-field.git
cd ohanafy-field
npm install --legacy-peer-deps

# Wire up env (one-time per machine)
bash scripts/link-env.sh
# then edit ~/.config/ohanafy-field/.env.local with your keys

# Run on iOS simulator
npx expo start --ios
```

For Conductor worktrees: `bash scripts/link-env.sh` symlinks each worktree's `.env.local` to the same shared file under `~/.config/ohanafy-field/` so credentials persist.

## Architecture (locked decisions)

| Layer | Choice |
|---|---|
| Framework | Expo SDK 52 + React Native 0.76 |
| Navigation | Expo Router v3 (file-based, typed routes) |
| Styling | NativeWind v4 with Ohanafy 2025 brand tokens |
| Local DB | WatermelonDB (SQLite, JSI adapter, reactive observables) |
| Server state | TanStack Query v5 |
| Client state | Zustand v5 |
| Lists | Shopify FlashList (≥10 items) |
| Animations | React Native Reanimated v3 |
| Voice | @react-native-voice/voice |
| AI | Anthropic Claude Sonnet (`@anthropic-ai/sdk`) |
| ZPL printing | TypeScript stub → Zebra Link-OS native bridge (v1.1) |
| Auth | Salesforce OAuth 2.0 PKCE (`expo-auth-session`) + biometric lock |
| Tokens | `expo-secure-store` |
| Errors | Sentry React Native |
| Analytics | PostHog React Native |
| E2E | Maestro (11 flows) |
| Unit tests | Jest + React Native Testing Library |
| Build | EAS Build + Submit |

## Project layout

```
ohanafy-field/
├── app/                       # Expo Router routes (screens)
├── src/
│   ├── auth/                  # Salesforce OAuth + biometric
│   ├── ai/                    # Claude client, tools, agents, memory
│   ├── components/            # UI components (account, order, voice, ai, sync, shared, onboarding)
│   ├── data/                  # Static data: seed-data, user-guide
│   ├── db/                    # WatermelonDB schema, models, repositories, seeder
│   ├── hooks/                 # useTabletLayout, useAccountList, useOrder, useVoiceCommand, useCoachMark, useMemories, useOfflineStatus
│   ├── navigation/            # role-nav-config (per-role tab sets)
│   ├── notifications/         # expo-notifications setup
│   ├── observability/         # Sentry + PostHog init
│   ├── permissions/           # Roles, matrix, loader, store, gate
│   ├── store/                 # Zustand stores
│   ├── sync/                  # SF REST client, queue processor, engine
│   └── zpl/                   # ZPL II templates, Labelary preview, Zebra printer wrapper
├── packages/
│   └── sfdx-package/          # 2GP managed package: 6 custom objects + Connected App
├── scripts/
│   ├── setup-harness.sh       # one-time bootstrap
│   ├── link-env.sh            # symlink .env.local across worktrees
│   ├── pmd-ruleset.xml        # zero-violations Apex gate
│   └── sf-bootstrap/          # SFDX project to deploy the External Client App
├── maestro/
│   ├── flows/                 # 11 E2E flows (Bible §9 + Roles §12)
│   └── helpers/               # cross-platform offline/online toggles
├── __tests__/unit/            # Jest unit tests (83 currently)
└── .claude/                   # Claude Code agents, skills, commands, rules, hooks
```

## Daily build

The 7-day sprint is documented in `OHANAFY-FIELD-PRODUCT-BIBLE.md` §9 and the per-day retros in §25. Each day shipped a PR onto `master`:

| Day | What shipped | PR |
|---|---|---|
| 0 | Harness — agents, skills, rules, hooks, CLAUDE.md | [#16](https://github.com/dzeder/ohanafy-field/pull/16) |
| 1 | Foundation — Expo + WatermelonDB + permissions + OAuth | [#17](https://github.com/dzeder/ohanafy-field/pull/17) |
| 2 | Core features — accounts, orders, visits, sync engine | [#19](https://github.com/dzeder/ohanafy-field/pull/19) |
| 3 | Voice + AI — command agent, visit insight, note cleanup | [#20](https://github.com/dzeder/ohanafy-field/pull/20) |
| 4 | ZPL + learning — 3 templates, learning agent, SFDX package | [#21](https://github.com/dzeder/ohanafy-field/pull/21) |
| 5 | Tests + onboarding — 11 Maestro flows, wizard, user guide | [#22](https://github.com/dzeder/ohanafy-field/pull/22) |
| 6 | Tablet + a11y — split-pane, all 7 role tab sets | [#23](https://github.com/dzeder/ohanafy-field/pull/23) |
| 7 | Submission — README, CHANGELOG, admin guide, retros | this commit |

## Test status

```
TypeScript strict          0 errors
ESLint                     0 errors, 0 warnings (max-warnings=0 in CI)
Jest unit                  83/83 passing across 13 test suites + 3 snapshots
Maestro E2E                11 flows defined; require an iOS sim or emulator to run
```

## Documentation

| Doc | Purpose |
|---|---|
| `CLAUDE.md` | Session context loaded by Claude Code on every run |
| `OHANAFY-FIELD-PRODUCT-BIBLE.md` | Day-by-day plan, schema, AI system, full spec |
| `OHANAFY-FIELD-ROLES-AND-ADMIN.md` | 6 user roles, permission matrix, admin console |
| `OHANAFY-FIELD-APPEXCHANGE-SECURITY-REVIEW.md` | Apex security rules, PMD ruleset, submission checklist |
| `OHANAFY-FIELD-HARNESS.md` | Reference for harness re-runs |
| `HARNESS-VERIFICATION.md` | Session 0 §2 checklist results |
| `docs/customer/admin-onboarding.md` | Salesforce-admin install + configure walkthrough |
| `packages/sfdx-package/README.md` | Managed-package deploy instructions |
| `maestro/README.md` | E2E test mode hooks + flow catalog |
| `scripts/sf-bootstrap/README.md` | One-time External Client App bootstrap |

## Submission status

App Store + Google Play submission requires manual steps tracked in [GitHub issues](https://github.com/dzeder/ohanafy-field/issues). See `HANDOFF.md` for the current readiness state.

## License

Proprietary — Ohanafy Inc. All rights reserved.
