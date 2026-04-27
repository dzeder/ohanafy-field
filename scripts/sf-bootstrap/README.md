# sf-bootstrap

One-time SFDX project for the Ohanafy Field Mobile OAuth client.

## Status

- ✅ `sf` CLI installed (advances issue #10 — P1)
- ✅ Authed to the dev sandbox as alias `ohanafy-sandbox`
- ⚠ **Connected App deploy blocked** — see "Known issue" below
- 🔁 Pivoted to UI-based **External Client App** for the dev sandbox

## Known issue: Connected App creation disabled in scratch / dev orgs

```
You can't create a connected app. To enable connected app creation,
contact Salesforce Customer Support.
```

As of recent Salesforce releases, classic Connected App creation is disabled in many scratch / Developer Edition orgs. Salesforce wants new clients on **External Client Apps**.

**Implications:**
- The `Ohanafy_Field_Mobile.connectedApp-meta.xml` here is kept for the **AppExchange managed package** (where Connected Apps are still required for ISV-distributed apps) — this file moves to `packages/sfdx-package/force-app/main/default/connectedApps/` on Day 4.
- The dev sandbox uses an **External Client App** created via the UI (see manual steps below) for OAuth testing during Days 1–3.
- The mobile OAuth flow is identical regardless of which kind of app — same endpoints, same PKCE, same scopes.

## Manual one-time setup (dev sandbox)

In your main browser (logged in to the sandbox):

1. Setup → Apps → **External Client Apps** → Settings → ensure External Client Apps are enabled
2. Setup → Apps → **External Client Apps** → **New External Client App**
3. Fill:
   - **External Client App Name:** `Ohanafy Field Mobile`
   - **API Name:** `Ohanafy_Field_Mobile`
   - **Contact Email:** `daniel.zeder@ohanafy.com`
   - **Distribution State:** Local
4. Configure **OAuth Settings**:
   - **Enable OAuth:** ✓
   - **Callback URL:** `com.ohanafy.field://oauth/callback`
   - **OAuth Scopes:** `Manage user data via APIs (api)`, `Perform requests at any time (refresh_token, offline_access)`
   - **Require Proof Key for Code Exchange (PKCE):** ✓
   - **Require Secret for Web Server Flow:** ✗ (mobile public client)
   - **Require Secret for Refresh Token Flow:** ✗
5. Save and wait ~2 minutes for activation
6. Copy the **Consumer Key** (shown on the External Client App detail page)

Paste back to Claude (or just into `~/.config/ohanafy-field/.env.local`):

```
EXPO_PUBLIC_SF_INSTANCE_URL=https://enterprise-fun-8206-dev-ed.scratch.my.salesforce.com
EXPO_PUBLIC_SF_CLIENT_ID=<the Consumer Key>
```

## Auth (already done)

```bash
cd scripts/sf-bootstrap
sf org login web \
  --instance-url https://enterprise-fun-8206-dev-ed.scratch.my.salesforce.com \
  --alias ohanafy-sandbox
```

## Deploy attempts (for the record)

```bash
# This fails on the dev sandbox — kept as documentation:
sf project deploy start --target-org ohanafy-sandbox --source-dir force-app
```
