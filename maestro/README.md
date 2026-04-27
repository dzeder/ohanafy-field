# Maestro E2E flows

End-to-end tests for Ohanafy Field. Run on iOS simulators or Android emulators
with the [Maestro CLI](https://maestro.mobile.dev).

## Setup

```bash
brew tap mobile-dev-inc/tap
brew install maestro
```

## Run a single flow

```bash
maestro test maestro/flows/onboarding.yaml
```

## Run the whole suite

```bash
maestro test maestro/flows/
```

## Test mode

All flows set `MAESTRO_TEST_MODE=true`. The app reads this env var to:

- Skip Salesforce OAuth — fall through with the user identified by `MAESTRO_FIXTURE_USER` (defaults to `daniel.zeder@ohanafy.com`)
- Use seed data instead of live Salesforce sync
- Expose a few `debug-*` testIDs that test code uses to inject transcripts, trigger sync manually, etc.

These hooks are gated on `process.env.MAESTRO_TEST_MODE === 'true'` so they're
stripped from production builds.

## Flows

| Flow | Source | Purpose |
|---|---|---|
| `onboarding.yaml` | Bible §9 Day 5 | 5-step onboarding wizard |
| `account-visit.yaml` | Bible §9 Day 5 | Open account → place order → confirm |
| `voice-order.yaml` | Bible §9 Day 5 | Voice command → CommandFeedback → Accept |
| `offline-sync.yaml` | Bible §9 Day 5 | Place order offline, reconnect, sync |
| `zpl-print.yaml` | Bible §9 Day 5 | Label preview + simulated print |
| `ai-correction-learning.yaml` | Bible Appendix E | 3 corrections → memory created |
| `role-detection.yaml` | Roles §12 | Each role lands on the right tab set |
| `permission-gate.yaml` | Roles §12 | Manager-only features hidden for Sales Rep |
| `role-switch.yaml` | Roles §12 | Multi-role user switches roles |
| `no-permission.yaml` | Roles §12 | User with no Permission Sets sees the screen |
| `admin-console.yaml` | Roles §12 | Admin sees the App Admin role |

## Helpers

`helpers/go-offline.yaml` and `helpers/go-online.yaml` toggle airplane mode in
a cross-platform way. Used by `offline-sync.yaml`.
