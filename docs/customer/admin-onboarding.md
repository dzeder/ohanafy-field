# Ohanafy Field — Admin Onboarding Guide

> Audience: Salesforce administrator at a customer org enabling Ohanafy Field for the first time.

This guide walks you through "I have a license" to "my reps are placing orders from their phones." Budget 30–45 minutes.

## What you'll need before you start

- Admin access to a Salesforce org with the **Ohanafy Plan** managed package (`ohfy__`) already installed at v0.x or higher (the version that includes `ohfy__Commitment__c.Was_Created_Offline__c` + `Offline_Items__c`)
- License keys for Ohanafy Field (one per rep)
- An Apple Developer account (or your reps' iOS devices enrolled in your MDM)
- A Google Play account or your Android MDM
- An Anthropic API key (for the AI features; we'll wire this in Step 3)
- Optional: Zebra ZQ520 or ZQ630 printers for any reps who'll print shelf talkers

## Architecture in one paragraph

Ohanafy Field is a **mobile UI/UX layer** over your existing Ohanafy Plan data model — it does **not** introduce a separate `ohfy_field__` namespace. Orders placed in the field land as `ohfy__Commitment__c` records (with line items serialized into the `Offline_Items__c` field, which your existing Ohanafy trigger materializes into `ohfy__Commitment_Item__c` rows). Visit notes land as standard Salesforce `Activity` records. There is nothing new to install on the Salesforce side beyond a Connected App.

## Overview

You'll do these things, in this order:

1. Verify your Ohanafy Plan version
2. Configure the Connected App (OAuth)
3. Provide the Anthropic API key
4. Grant reps access to `ohfy__Commitment__c` + Activity
5. Distribute the mobile app to reps
6. Verify a test rep can sign in and place an order

Steps 1–4 happen in Salesforce. Step 5 is App Store / Play Store / MDM. Step 6 is on a phone.

---

## Step 1 — Verify your Ohanafy Plan version

Ohanafy Field requires a recent enough version of the `ohfy__` managed package to have the offline-commitment fields:

1. Setup → Installed Packages → find **Ohanafy Plan** (or **OHFY-Data_Model**)
2. Confirm version is at or above the release that includes `ohfy__Commitment__c.Was_Created_Offline__c` and `Offline_Items__c` (your account team will confirm the exact version)
3. Setup → Object Manager → `Commitment` → Fields → verify both fields exist

If your version is older, contact your Ohanafy account team to schedule the package upgrade before continuing.

## Step 2 — Configure the Connected App

The mobile app authenticates via OAuth 2.0 PKCE.

**Settings:**
- Connected App name: `Ohanafy Field Mobile`
- Callback URL: `com.ohanafy.field://oauth/callback`
- OAuth Scopes: **Manage user data via APIs (api)**, **Perform requests at any time (refresh_token, offline_access)**
- PKCE: **Required** (no client secret on mobile public clients)
- IP Relaxation: **Relax IP restrictions** (mobile clients move around)

To create:

1. Setup → Apps → External Client Apps → **New External Client App**
2. Fill the settings above (External Client Apps is Salesforce's modern OAuth path; it works identically to a Connected App for our PKCE flow)
3. Save, wait ~2 minutes for activation
4. Copy the **Consumer Key** — you'll need this in Step 5 when you configure the mobile app build

> Reference XML for the canonical settings is at `scripts/sf-bootstrap/force-app/main/default/connectedApps/Ohanafy_Field_Mobile.connectedApp-meta.xml` in the Ohanafy Field repo.

## Step 3 — Provide the Anthropic API key

The mobile AI features (voice command interpretation, pre-call insights) call Anthropic Claude. Until Ohanafy publishes a managed Custom Metadata Type for this, the API key is configured at app build time:

1. Generate an Anthropic API key at console.anthropic.com → Settings → API Keys
2. Send the key to your Ohanafy account team — they bake it into your org's mobile build

> **Roadmap:** v1.1 will fetch this key from a `ohfy__AI_Config__mdt` Custom Metadata record at first sign-in and store it in iOS Keychain / Android Keystore via `expo-secure-store`, so it's never in the bundle.

## Step 4 — Grant reps access to `ohfy__Commitment__c` and Activity

Reps need **Create + Edit** on `ohfy__Commitment__c` and standard Activity (Task). Most rep profiles already have Activity; Commitment may need explicit grants.

1. Setup → Profiles (or your existing Permission Set for sales reps)
2. Object Settings → `Commitment` → grant **Read, Create, Edit**
3. Verify field-level security on at minimum: `Customer__c`, `Date__c`, `Involved_Sales_Rep__c`, `Notes__c`, `Was_Created_Offline__c`, `Offline_Items__c`, `Distributor_Status__c`
4. Activity: standard Task object — usually already accessible

For the multi-role staff (managers, drivers, warehouse), v1.0 routes everyone to a single Field Sales Rep tab set or to a "no access yet" screen if they have no role. v1.1 ships dedicated tab sets per role.

> **Roadmap:** v1.1 will ship six pre-configured Permission Sets (`Field_Sales_Rep`, `Sales_Manager`, `Driver`, `Driver_Manager`, `Warehouse_Worker`, `Warehouse_Manager`) for one-click assignment, plus a seventh `App_Admin` set for the Admin Console.

## Step 5 — Distribute the mobile app

For pilot deployment we strongly recommend **MDM distribution** rather than the public App Store / Play Store, so you control updates.

### iOS (TestFlight or MDM)

- **TestFlight (early pilot):** Apple Business Manager → distribute the build to your reps via TestFlight. They install the **TestFlight** app, accept the invite, install Ohanafy Field. ~10 minutes per rep.
- **MDM (production):** push the .ipa via Jamf, Intune, Workspace ONE, etc. The bundle ID is `com.ohanafy.field`. Configure the URL scheme `com.ohanafy.field://` for the OAuth callback.

### Android (Play Store closed track or MDM)

- **Play Store closed track:** invite reps' Google accounts; they install via Play Store after accepting the invite.
- **MDM (production):** push the .aab to your fleet. Package name: `com.ohanafy.field`.

The app build the Ohanafy team produced for you has your org's My Domain URL + Connected App Consumer Key + Anthropic key pre-baked. Reps just tap "Sign in with Salesforce" and authorize.

## Step 6 — Test rep verification

Pick a test rep with access to `ohfy__Commitment__c`. Hand them a phone. They should see:

1. Welcome → "Sign in with Salesforce" → OAuth → biometric setup → onboarding wizard → home
2. Home shows their territory's accounts (rep ↔ accounts via `ohfy__Territory__c` + `ohfy__Account_Route__c`)
3. They tap an account → pre-call AI insight loads (3-sec timeout — non-blocking; if AI is unreachable, a deterministic fallback shows)
4. They tap "New Order" → add a line item via stepper or voice ("add 2 kegs Pale Ale" → Accept)
5. They tap "Place Order" → return to accounts; bottom shows "1 change pending sync"
6. Within ~30 seconds (or next foreground), the order syncs and appears in Salesforce as `ohfy__Commitment__c` with `Was_Created_Offline__c=true`. The Salesforce-side trigger materializes the line items as `ohfy__Commitment_Item__c` rows from `Offline_Items__c`.

If the test rep can complete that flow, your installation is working.

## Common issues

**"No access yet" screen on login**
The user is recognized but has no role mapping. v1.0 fixture loader requires either `daniel.zeder@ohanafy.com` (admin) or `daniel.zeder+salesrep@ohanafy.com` (rep) — production builds use a different fixture or the live SF Permission Set loader (v1.1).

**OAuth fails with "redirect_uri_mismatch"**
The Connected App callback URL doesn't match the mobile app's URL scheme. Verify it's exactly `com.ohanafy.field://oauth/callback` (no trailing slash, no `https://`).

**AI insight never appears**
Either the Anthropic API key wasn't baked into your build, or the user lacks **API access** in their profile. The insight is a non-blocking 3-second call — if it fails, the deterministic fallback (urgency derived from `daysSinceLastOrder`) still renders.

**Reps' orders show "Sync Failed" after 3 attempts**
The most common cause is **field-level security on `ohfy__Commitment__c`** — make sure your reps have **Edit** on every field listed in Step 4. Open the failed sync queue item in your local logs (or contact support with the error message) for specifics.

## Support

- Salesforce-side issues: open a ticket in your Ohanafy account portal
- Mobile bugs: tap **Settings → Contact Support** in the app for a pre-filled email
- Custom integration questions: reach out via your account team

---

*Maintained by the Ohanafy Field team. Last updated for Ohanafy Field v1.0.0.*
