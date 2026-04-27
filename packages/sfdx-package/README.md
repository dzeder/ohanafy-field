# Ohanafy Field — Managed Package (SFDX)

The 2GP managed package for Ohanafy Field. Namespace: `ohfy_field__`.

## Contents

- **Connected App** — `Ohanafy_Field_Mobile.connectedApp-meta.xml` migrated from `scripts/sf-bootstrap/` (PKCE-enabled, scopes `api refresh_token offline_access`, callback `com.ohanafy.field://oauth/callback`)
- **6 custom objects** (per Roles doc §12):
  - `Admin_Config__mdt` — org-wide settings (sync interval, feature flags)
  - `Admin_Audit_Log__c` — immutable audit trail
  - `ZPL_Template__c` — custom label templates per org
  - `Territory_Assignment__c` — manual rep ↔ account mapping fallback
  - `Notification_Rule__c` — configurable notification rules
  - `AI_Config__mdt` — encrypted AI settings (API key, prompts)

## Build & deploy

```bash
# Authenticate to a DevHub
sf org login web --set-default-dev-hub

# Validate metadata against the dev sandbox
cd packages/sfdx-package
sf project deploy validate --target-org ohanafy-sandbox

# Create a new package version (DevHub)
sf package version create --package "Ohanafy Field" --installation-key-bypass --wait 30
```

## CI gate

PMD runs on every push when any `*.cls` exists under `force-app/main/default/classes/`. Zero violations required (Security Review §3). The Apex classes themselves arrive on Day 5 — managers' approvals + admin console controllers.

## What ships in v1.0.0

- Day 1: nothing (mobile-only)
- Day 4: 6 custom objects + Connected App
- Day 5: Apex permission set assignment helpers, admin console controllers
- Day 7: AppExchange listing screenshots + Privacy Policy link

## Namespace

Existing managed package: `ohfy__` (do not modify). New module: `ohfy_field__`.
