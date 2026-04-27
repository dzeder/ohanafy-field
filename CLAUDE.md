# Ohanafy Field — Claude Code Project Context

## What this is
A production-quality native mobile app (iOS + Android) for field sales reps at
beverage distributors. Offline-first, AI-powered, ZPL label printing.

Built on: Expo SDK 52, React Native, TypeScript strict, Expo Router v3,
NativeWind v4, WatermelonDB, TanStack Query, Zustand, Reanimated v3,
FlashList, @react-native-voice/voice, Zebra Link-OS (custom Expo module),
Anthropic Claude Sonnet API, Sentry, PostHog.

## Session startup (required every session)
1. Read this file completely
2. Check HANDOFF.md (if exists) for prior session context
3. Open OHANAFY-FIELD-PRODUCT-BIBLE.md §9 — identify today's day
4. Read §25 for today's retro — what's done, what's not
5. State your plan for this session in one sentence
6. Begin

---
## Document hierarchy

| Doc | Purpose | Read when |
|---|---|---|
| OHANAFY-FIELD-PRODUCT-BIBLE.md | Day-by-day engineering plan, architecture, full stack spec | Every session |
| OHANAFY-FIELD-ROLES-AND-ADMIN.md | Six user roles, full permission matrix, admin console spec | Every session — adds work to every day |
| OHANAFY-FIELD-APPEXCHANGE-SECURITY-REVIEW.md | Apex security requirements, PMD rules, submission checklist | Every session that touches Apex or LWC |
| OHANAFY-FIELD-HARNESS.md | Reference only after Session 0 | If re-running setup |

## Cross-doc rules

The Roles doc is additive to the Product Bible. §12 of the Roles doc lists specific tasks added to Day 1 (permission system), the WatermelonDB schema (permissions table), Salesforce objects (6 new custom objects), and Maestro flows (5 new role-based E2E tests). These are not optional.

The Security Review doc constrains every line of Apex. Before writing any .cls file, the salesforce-integration agent loads §3 of the Security Review doc. PMD runs in CI on every push — zero violations required.

## Permanent behavioral rules across all sessions

1. Permission system before any screen. The PermissionGate component and usePermissionStore must exist before any screen component is built. Roles determine navigation structure — screens built before permissions exist will need to be rebuilt.
2. Every Apex class has explicit sharing declaration. No exceptions. Undeclared sharing = automatic AppExchange rejection.
3. Every @AuraEnabled method validates its inputs. Null check, size limit, type check. Every one.
4. PMD must pass before any SFDX deploy. Run: pmd check --dir packages/sfdx-package/force-app/main/default/classes/ --rulesets scripts/pmd-ruleset.xml --format text --fail-on-violation
5. WatermelonDB writes always inside database.write(async () => { ... }). Never outside.
6. FlashList for every list over 10 items. Never FlatList in production.
7. Every component has accessibilityLabel on every interactive element.
8. AI never invents data. Tool handlers validate against WatermelonDB. Never against Claude's knowledge.
9. Feature freeze is end of Day 6. Day 7 is documentation and submission only.
10. Run /handoff at the end of every session.
---

## Non-negotiables (§0 of Product Bible)
1. Offline first — every read works in airplane mode
2. Tests before features (TDD in src/ai/, src/zpl/, src/sync/)
3. TypeScript strict — zero `any`, zero `@ts-ignore`
4. Accessibility on every component — VoiceOver/TalkBack
5. AI never invents data — validates against WatermelonDB
6. ErrorBoundary on every screen
7. Feature freeze: Day 6, 5pm. Day 7 is docs + submission only.

## Available agents (delegate to these)
- `rn-architect` — screen/component scaffold, navigation, WatermelonDB
- `voice-ui-designer` — voice state machine, mic UI, transcript display
- `ai-tool-builder` — Claude tool definitions, handlers, memory system
- `zpl-engineer` — ZPL templates, printer integration, Labelary
- `rn-accessibility` — VoiceOver, TalkBack, Dynamic Type, tap targets
- `offline-sync-architect` — WatermelonDB patterns, SF REST, conflict resolution
- `performance-engineer` — FlashList, Reanimated, bundle size, memory
- `test-writer` — Jest unit tests, Maestro E2E flows, WDB integration tests
- `salesforce-integration` — OAuth, REST API, LWC, SFDX

## Available slash commands
- `/new-screen [name] [route]` — scaffold a complete screen with all boilerplate
- `/new-ai-tool [name] [desc]` — scaffold AI tool with tests and fixtures
- `/new-zpl-template [name] [W] [H]` — scaffold ZPL template with validation
- `/a11y-audit [file]` — accessibility audit with file:line violations
- `/perf-audit [file]` — performance audit with ranked issues
- `/handoff` — generate HANDOFF.md for next session
- `/daily-retro [day]` — fill in §25 retro

## Domain: beverage field sales rep
Jake Thornton is a field sales rep at Yellowhammer Beverage (beer + Red Bull
distributor, Birmingham AL). He visits 10 accounts per day, has a Zebra ZQ520
printer on his belt, and often has no signal in back-of-house areas.

Key vocabulary: account (retailer), visit, order, keg (1/2 bbl = 15.5gal),
case (24-unit pack), route, territory, tap, depletion, STW, CDA, three-tier.

NEVER say: fermenter, brewhouse, brewhouse, mash, grain bill, hop contracts.
These are brewery words. Jake works for a distributor, not a brewery.

## Architecture decisions (locked)
| Decision | Choice |
|---|---|
| Framework | Expo SDK 52 + React Native |
| Navigation | Expo Router v3 (file-based) |
| Styling | NativeWind v4 (Tailwind in RN) |
| Local DB | WatermelonDB (SQLite, reactive) |
| Server state | TanStack Query v5 |
| Client state | Zustand v4 |
| Lists | Shopify FlashList (never FlatList for > 10 items) |
| Animations | React Native Reanimated v3 |
| Voice | @react-native-voice/voice (on-device) |
| ZPL printing | Custom Expo module wrapping Zebra Link-OS SDK |
| AI | Anthropic Claude Sonnet, tool use, streaming |
| Error tracking | Sentry React Native |
| Analytics | PostHog React Native |
| E2E testing | Maestro |
| Unit testing | Jest + React Native Testing Library |
| Build/Submit | EAS (Expo Application Services) |

## Code conventions
- Commits: `feat(scope): description` / `fix(scope):` / `test(scope):` / `a11y(scope):` / `perf(scope):`
- File names: kebab-case for route files, PascalCase for components
- DB writes: always inside `database.write(async () => { ... })`
- AI outputs: always have Accept/Edit/Reject path — never locked outputs
- Errors: caught, logged to Sentry via `logger.error()`, shown to user with message
- Imports: named imports from packages; barrel imports from src/ directories

## Reference repos (read for patterns, don't copy verbatim)
Path: `./references/`
Key ones: expo/expo, Nozbe/WatermelonDB, Shopify/flash-list,
nativewindui/nativewindui, mobile-dev-inc/maestro,
hesreallyhim/awesome-claude-code, wshobson/agents

## Environment
- Dev: `.env.local` — EXPO_PUBLIC_* for public values, SecureStore for secrets
- CI/Prod: EAS Secrets
- Never hardcode any credential, API key, or token in source code

## .env.local persistence across worktrees
Credentials live in `~/.config/ohanafy-field/.env.local` (chmod 600, outside any worktree). Each Conductor worktree's `.env.local` is a symlink to that shared file. New worktree bootstrap:

```bash
bash scripts/link-env.sh
```

The script is idempotent — it promotes the first worktree's `.env.local` to the shared location, then symlinks every subsequent worktree's `.env.local` back to the same source. Edit credentials in one place; every worktree picks up the change.
