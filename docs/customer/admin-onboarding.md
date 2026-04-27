# Ohanafy Field — Admin Onboarding Guide

> Audience: Salesforce administrator at a customer org installing Ohanafy Field for the first time.

This guide walks you through every step from "I have a license" to "my reps are placing orders from their phones." Budget 30–45 minutes.

## What you'll need before you start

- Admin access to a Salesforce org with the **Ohanafy Plan** managed package (`ohfy__`) already installed
- License keys for Ohanafy Field (one per rep)
- An Apple Developer account (or your reps' iOS devices enrolled in your MDM)
- A Google Play account or your Android MDM
- Optional: Zebra ZQ520 or ZQ630 printers for any reps who'll print shelf talkers

## Overview

You'll do these things, in this order:

1. Install the `ohfy_field__` managed package
2. Configure the Connected App / External Client App
3. Set up the AI Config Custom Metadata
4. Assign Permission Sets to each user
5. Distribute the mobile app to reps
6. Verify a test rep can sign in and place an order

Steps 1–4 happen in Salesforce. Step 5 is App Store / Play Store / MDM. Step 6 is on a phone.

---

## Step 1 — Install the `ohfy_field__` managed package

You'll receive a managed-package install URL from your Ohanafy account team. Open it from inside your target Salesforce org.

1. Click **Install for All Users** (recommended) or **Install for Specific Profiles** if you want a phased rollout.
2. Approve the third-party access prompts (Anthropic, Sentry, PostHog) — these are pre-declared in the package and required for AI / observability.
3. Wait for the install email confirmation (~5 minutes).

After install, verify the 6 custom objects exist:

- `ohfy_field__Admin_Config__mdt`
- `ohfy_field__Admin_Audit_Log__c`
- `ohfy_field__ZPL_Template__c`
- `ohfy_field__Territory_Assignment__c`
- `ohfy_field__Notification_Rule__c`
- `ohfy_field__AI_Config__mdt`

Setup → Object Manager → search "ohfy_field" — you should see all six.

## Step 2 — Configure the Connected App

The mobile app authenticates via OAuth 2.0 PKCE against a Connected App. The package ships one preconfigured.

1. Setup → App Manager → search **"Ohanafy Field Mobile"**
2. Click the dropdown → **View** → confirm the OAuth settings:
   - Callback URL: `com.ohanafy.field://oauth/callback`
   - OAuth Scopes: **Manage user data via APIs (api)**, **Perform requests at any time (refresh_token, offline_access)**
   - PKCE: **Required**
   - IP Relaxation: **Relax IP restrictions** (mobile clients move around)
3. Copy the **Consumer Key** — you'll send this to Ohanafy support along with your org's My Domain URL so the right values are pre-baked into the device installer.

> If your security team requires that you create your own Connected App instead of using the bundled one, open `packages/sfdx-package/force-app/main/default/connectedApps/Ohanafy_Field_Mobile.connectedApp-meta.xml` for the canonical settings.

## Step 3 — Configure AI

The mobile AI features call Anthropic Claude. The API key is stored as **protected** Custom Metadata so it never appears in any export.

1. Setup → Custom Metadata Types → **AI Config** → Manage Records → New
2. Set:
   - **Label:** `Default`
   - **Anthropic API Key:** paste your Anthropic API key (created at console.anthropic.com)
3. Save

The mobile app fetches this value over the authenticated REST API the first time a rep signs in, then stores it in iOS Keychain / Android Keystore via `expo-secure-store` — never in the mobile bundle, never logged.

## Step 4 — Assign Permission Sets to users

Ohanafy Field uses **role-based access control**. Every user gets one or more of these Permission Sets (all in the `ohfy_field__` namespace):

| Permission Set | Who gets it | Tabs they see |
|---|---|---|
| `ohfy_field__Field_Sales_Rep` | Outside reps | Accounts, Route, Orders, Settings |
| `ohfy_field__Sales_Manager` | Sales managers | Team, Accounts, Approvals, Reports, Settings |
| `ohfy_field__Driver` | Delivery drivers | Route, Deliveries, Settings |
| `ohfy_field__Driver_Manager` | Dispatch / fleet managers | Dispatch, Routes, Exceptions, Reports, Settings |
| `ohfy_field__Warehouse_Worker` | Pick / pack staff | Pick List, Inbound, Settings |
| `ohfy_field__Warehouse_Manager` | Warehouse managers | Operations, Inventory, Workers, Reports, Settings |
| `ohfy_field__App_Admin` | You (the Salesforce admin) | Admin Console (Lightning) + role switcher |

To assign:

1. Setup → Permission Sets → click the Permission Set → **Manage Assignments** → **Add Assignment**
2. Select users → **Assign**

Multi-role staff (e.g., a sales manager who also does deliveries during shortages) get **multiple Permission Sets**. The mobile app will render a role switcher in Settings so they can swap modes.

> **App Admin scope:** The `App_Admin` Permission Set grants access to the Admin Console (a Lightning app for managing the package's settings and audit log). It does **not** automatically grant access to each functional role's tab set — admins assign themselves to functional roles too if they want to use the mobile app's day-to-day features.

## Step 5 — Distribute the mobile app

For pilot deployment we strongly recommend **MDM distribution** rather than the public App Store / Play Store, so you control updates.

### iOS (TestFlight or MDM)

- **TestFlight (early pilot):** Apple Business Manager → distribute the build to your reps via TestFlight. They install the **TestFlight** app, accept the invite, install Ohanafy Field. ~10 minutes per rep.
- **MDM (production):** push the .ipa via Jamf, Intune, Workspace ONE, etc. The bundle ID is `com.ohanafy.field`. Configure the URL scheme `com.ohanafy.field://` for the OAuth callback.

### Android (Play Store closed track or MDM)

- **Play Store closed track:** invite reps' Google accounts; they install via Play Store after accepting the invite.
- **MDM (production):** push the .aab to your fleet. Package name: `com.ohanafy.field`.

For both platforms, the app picks up your org's My Domain URL automatically — reps just tap "Sign in with Salesforce" and authorize.

## Step 6 — Test rep verification

Pick a test rep with the **Field Sales Rep** Permission Set. Hand them a phone. They should see:

1. Welcome screen → "Sign in with Salesforce" → OAuth → biometric setup → onboarding wizard → home
2. Home shows their territory's accounts (one rep ↔ many accounts via `Territory_Assignment__c`)
3. They tap an account → see a pre-call AI insight (the AI is calling Anthropic, validated against their account history)
4. They tap "New Order" → add a line item via the stepper or by voice
5. They tap "Place Order" → screen returns to accounts; the bottom shows "1 change pending sync"
6. Within ~30 seconds (or on next foreground), the sync engine flushes the queue and the order appears in Salesforce as `ohfy_field__Order__c`

If the test rep can complete that flow, your installation is working.

## Common issues

**"No access yet" screen on login**
The user has no `ohfy_field__` Permission Set assigned. Go back to Step 4.

**OAuth fails with "redirect_uri_mismatch"**
The Connected App callback URL doesn't match the mobile app's URL scheme. Verify it's exactly `com.ohanafy.field://oauth/callback` (no trailing slash, no `https`).

**AI insight never appears**
Either the AI Config Custom Metadata is missing, or the user lacks **API access** in their profile. The AI insight is a non-blocking 3-second call — if it fails, the deterministic fallback still renders.

**Reps' orders show "Sync Failed" after 3 attempts**
Open `ohfy_field__SyncLog__c` to see the error. The most common cause is field-level security on `ohfy_field__Order__c` — make sure your reps have at least Read + Create on every field of that object.

## Support

- Salesforce-side issues: open a ticket in your Ohanafy account portal
- Mobile bugs: tap **Settings → Contact Support** in the app for a pre-filled email
- Custom integration questions: reach out via your account team

---

*Maintained by the Ohanafy Field team. Last updated for Ohanafy Field v1.0.0.*
