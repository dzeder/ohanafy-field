# Ohanafy Field — Submission-Readiness Handoff

**Sprint:** 7-day solo build, 2026-04-25 → 2026-04-27 (compressed from the 7-day plan)
**Status:** Code-complete v1.0.0. Submission requires manual store-side actions.
**Branch:** all 7 day-PRs merged to `master`.

## Build state

| Gate | Status |
|---|---|
| TypeScript strict | ✅ 0 errors |
| ESLint (max-warnings=0) | ✅ 0 errors |
| Jest unit tests | ✅ 83/83 passing across 13 suites + 3 snapshots |
| GitHub Actions CI | ✅ green on master |
| Maestro flows defined | ✅ 11 (6 Bible + 5 Roles §12); pending device run |
| Production iOS build | ⏳ requires `eas build --platform ios --profile production` (manual) |
| Production Android build | ⏳ requires `eas build --platform android --profile production` (manual) |

## Manual actions before submission

These are blocked on accounts/devices the AI can't operate. All tracked in GitHub issues:

### iOS App Store
- [ ] **#12** Apple Developer membership active under the Ohanafy org
- [ ] **#12** `com.ohanafy.field` bundle ID reserved
- [ ] **#1** `eas build --platform ios --profile production`
- [ ] App Store Connect: 3 sets of screenshots (6.7" iPhone, 12.9" iPad, 6.1" iPhone) — capture from `npx expo start` running on simulators
- [ ] App Store Connect: privacy manifest already in repo at `PrivacyInfo.xcprivacy` — Xcode will pick it up at build time
- [ ] App Store Connect: app description, keywords, support URL — see `OHANAFY-FIELD-PRODUCT-BIBLE.md` §21.1 for draft copy
- [ ] App Store Review test account: see Bible §21.1 (`appreview@ohanafy.field.test`, sandbox with 5 accounts + 10 products)
- [ ] Submit for App Review

### Google Play
- [ ] **#12** Play Console membership active
- [ ] **#12** `com.ohanafy.field` package name reserved
- [ ] **#1** `eas build --platform android --profile production`
- [ ] Play Console: phone + 7" tablet + 10" tablet screenshots (≥2 each)
- [ ] Play Console: short + full description (Bible §21.2 has the draft)
- [ ] Play Console: Data Safety form — see Bible §21.2 table
- [ ] Submit for Play Review (likely closed track first for the pilot)

### Salesforce-side
- [ ] **#11** `ohfy_field` namespace registered in 2GP DevHub
- [ ] `sf project deploy validate --target-org ohanafy-sandbox --source-dir packages/sfdx-package` — validates the 6 custom objects + Connected App against the dev sandbox
- [ ] `sf package version create --package "Ohanafy Field" --installation-key-bypass --wait 30` — produces the install URL for customers
- [ ] AppExchange listing draft: pen test results required (Bishop Fox / Coalfire / etc per `OHANAFY-FIELD-APPEXCHANGE-SECURITY-REVIEW.md`)
- [ ] Privacy Policy hosted at `https://ohanafy.com/field/privacy` (outline in Security Review Appendix B)

## Open issues at handoff

Run `gh issue list --label harness` for the full unblock tracker. Status snapshot:

- ✅ **Closed (8):** #1 eas-cli · #3 Anthropic key · #4 Sentry · #5 PostHog · #6 ohfy__ pkg · #7 .env.local · #10 sf CLI + pmd · #14 customer docs (this PR)
- ⏳ **Open (6):**
  - #2 — actually closed; check
  - #8 Xcode.app install
  - #9 Android Studio + AVD
  - #11 SFDX namespace registration
  - #12 Apple + Google Play memberships verified
  - #13 Zebra ZQ520 paired (deferrable; stub works in dev)

## What's deferred to v1.1 (intentional)

Documented in `CHANGELOG.md`:

1. **Native Zebra Link-OS bridge** — TypeScript stub in `src/zpl/printer.ts` keeps every call site stable. Single-file swap when the native module ships.
2. **Real implementations of 5 non-Sales-Rep tab sets** — placeholders in `app/(tabs)/{team,approvals,reports,deliveries,dispatch,routes,exceptions,picklist,inbound,operations,inventory,workers}.tsx` use a shared `<RoleTabPlaceholder>`.
3. **Apex permission-set assignment helpers + admin console controllers** — package skeleton is ready; PMD CI gate is wired.
4. **Production Anthropic key path** — fetch from `ohfy_field__AI_Config__mdt` post-auth, store in SecureStore. Currently uses `EXPO_PUBLIC_ANTHROPIC_API_KEY` env (dev only).
5. **Maestro `debug-*` testID hooks** — flows are spec'd; the in-app `MAESTRO_TEST_MODE` shims need device build.
6. **Real-device performance measurements** — code-level perf is in place; needs iPhone SE 3 + Instruments to confirm Bible §9 Day 6 targets.

## Repo structure cheatsheet

```
ohanafy-field/
├── app/                       # Expo Router routes (16 tabs + auth + onboarding + guide + label + order + visit + account)
├── src/                       # All app code (ai, auth, components, data, db, hooks, navigation, notifications, observability, permissions, store, sync, zpl)
├── packages/sfdx-package/     # 2GP managed package (6 custom objects + Connected App)
├── scripts/                   # Bootstrap scripts (setup-harness, link-env, sf-bootstrap)
├── maestro/                   # 11 E2E flows + helpers
├── __tests__/unit/            # 83 Jest tests
├── docs/customer/             # Customer admin onboarding guide
├── .claude/                   # Claude Code agents/skills/rules/hooks/commands (Session 0 harness)
├── README.md                  # Quickstart + architecture + day links
├── CHANGELOG.md               # v1.0.0 release notes
├── HARNESS-VERIFICATION.md    # Session 0 §2 checklist results
├── PrivacyInfo.xcprivacy      # iOS privacy manifest
├── OHANAFY-FIELD-PRODUCT-BIBLE.md          # Day-by-day plan + retros
├── OHANAFY-FIELD-ROLES-AND-ADMIN.md        # 6 roles + permission matrix
├── OHANAFY-FIELD-APPEXCHANGE-SECURITY-REVIEW.md  # Apex rules + PMD
└── OHANAFY-FIELD-HARNESS.md                # Session 0 reference
```

## How to start a follow-up session

Per `CLAUDE.md` daily startup ritual:

1. Read `CLAUDE.md`
2. Read this `HANDOFF.md`
3. Check `gh issue list -R dzeder/ohanafy-field` for the current state
4. Identify what you're working on — pilot iteration, v1.1 native module, post-launch fix?
5. State the plan, wait for confirmation, then begin

For Conductor worktrees on a new machine: `bash scripts/link-env.sh` to wire the shared `.env.local`.
