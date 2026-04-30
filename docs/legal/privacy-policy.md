# Ohanafy Field — Privacy Policy

**Last updated:** April 30, 2026
**Effective:** April 30, 2026

This Privacy Policy describes how Ohanafy, Inc. ("Ohanafy," "we," "us") collects, uses, and shares information in connection with the **Ohanafy Field** mobile application (the "App") on iOS and Android.

Ohanafy Field is a business-to-business ("B2B") tool licensed to beverage distributors and breweries for use by their employees ("you," "user"). All customer business data accessed by the App lives in your employer's Salesforce organization, governed by your employer's data agreement with Salesforce. Ohanafy does not operate any database that stores your employer's customer data.

---

## 1. Information we collect

### 1.1 Information you provide directly

- **Salesforce login credentials.** When you sign in, OAuth 2.0 authentication tokens are returned by Salesforce and stored on your device only (in iOS Keychain or Android Keystore via `expo-secure-store`). We never see or store your password.
- **Visit notes and order line items.** Content you create in the App is written to your employer's Salesforce organization through the App's sync engine.

### 1.2 Information collected automatically

- **Crash reports** (via Sentry): stack traces, device model, operating system version, app version, an installation-scoped UUID for crash deduplication. No customer business data, no PII beyond an opaque user identifier.
- **Product analytics** (via PostHog): event names ("opened account detail," "tapped mic," "placed order"), screen names, an anonymous user identifier. We do not collect the contents of orders, visit notes, or any account information through analytics.
- **Performance metrics**: AI command latency, sync queue duration, screen render times. Used to improve the App.

### 1.3 Information processed on your device only

The following are processed entirely on your device and **not transmitted, stored, or shared by Ohanafy**:

- **Microphone audio.** When you use voice commands, audio is captured by the operating system's speech recognition framework (Apple Speech / Android SpeechRecognizer) and converted to text on-device. The audio buffer is discarded immediately. Only the resulting text transcript is stored on your device and used to generate an AI command.
- **Camera images.** Barcode scanning happens on-device. Camera frames are not stored.
- **Biometric data.** Face ID, Touch ID, and fingerprint authentication is handled by the operating system. The App never receives biometric data.
- **Approximate location.** When permitted, used in-session to surface nearby accounts. Not persisted off-device.

### 1.4 What we do **not** collect

- Consumer personal information (names, emails, addresses of individual consumers — only the business contacts your employer has stored in their Salesforce org)
- Payment card data or banking information
- Health, fitness, or medical information
- Device contacts, photos, calendar, or files outside the App
- Browsing history outside the App
- Advertising identifiers (IDFA / GAID)

---

## 2. How we use information

We use the information described above to:

1. Authenticate you to your employer's Salesforce organization.
2. Provide the App's features (offline data, voice commands, AI insights, label printing, sync).
3. Diagnose crashes and fix bugs (via Sentry).
4. Understand which features are used so we can improve the App (via PostHog).
5. Improve the AI features by allowing the App's on-device learning agent to remember your corrections (your corrections stay on your device).
6. Communicate with you about service issues, security updates, and major version releases.

We do **not** use your information to:
- Build advertising profiles or sell data to advertisers
- Track you across other apps or websites
- Train Ohanafy's machine-learning models on your data
- Make automated decisions that have legal or significant similar effects on you

---

## 3. AI features and Anthropic

When you use the AI features (voice command interpretation, account intelligence, note cleanup), the App sends a prompt to Anthropic's Claude API. The prompt may include:

- The text transcript of your voice command (≤500 characters)
- The name of the account you are viewing and aggregate metrics (days since last order, last visit date)
- A short list of products from the catalog

The prompt does **not** include:
- Consumer personal information
- Payment data
- Salesforce authentication tokens
- Any data about other users in your organization

Anthropic processes the prompt under their enterprise data handling policy and does not retain prompts or responses for training their models, per Anthropic's terms (https://www.anthropic.com/legal/privacy).

---

## 4. Where data is stored

| Data | Where it lives |
|---|---|
| Account, contact, order, visit records | Your employer's Salesforce organization |
| On-device cache of the above | Your device's encrypted local database (WatermelonDB / SQLite). Wiped on app uninstall or via Settings → Clear Local Data. |
| Salesforce OAuth tokens | iOS Keychain / Android Keystore via `expo-secure-store` |
| Crash reports | Sentry (US data center) |
| Product analytics events | PostHog (US data center) |
| AI prompts and responses | Anthropic API (transient — not stored after the API call returns) |
| Label preview renders | Labelary public API (template-only; no user data) |

**No Ohanafy-operated database stores your customer business data.** We do not have a server-side copy of your accounts, orders, visits, or contacts. All such data is governed by your employer's existing agreement with Salesforce.

---

## 5. Sharing your information

We share information only with the third parties listed above, each of whom acts as our service provider under contract:

| Service | Data shared | Purpose | Privacy policy |
|---|---|---|---|
| Anthropic | AI prompts (no PII) | AI features | https://www.anthropic.com/legal/privacy |
| Sentry | Crash reports, install UUID | Crash diagnostics | https://sentry.io/privacy/ |
| PostHog | Anonymous event data | Product analytics | https://posthog.com/privacy |
| Labelary | ZPL template strings (no user data) | Label preview rendering | https://labelary.com/privacy.html |
| Salesforce | All CRM data (governed by your employer) | App functionality | per your employer's MSA |

We do not sell, rent, or trade your information.

We may disclose information if required by law, valid legal process, or to protect the rights, property, or safety of Ohanafy, our users, or the public.

---

## 6. Data retention and deletion

- **On your device:** local data is removed when you uninstall the App, or on demand via Settings → Clear Local Data.
- **In your employer's Salesforce org:** retention is governed by your employer's data policies and Salesforce data agreement.
- **Sentry crash reports:** retained for 90 days, then automatically purged.
- **PostHog event data:** retained for 365 days, then automatically purged.

To request deletion of your account-level data held by Ohanafy (the analytics and crash records associated with your installation UUID), email `privacy@ohanafy.com` from the email address associated with your Salesforce account. We will complete the request within 30 days.

---

## 7. Security

- All network traffic is encrypted with HTTPS / TLS 1.2 or higher.
- Salesforce authentication uses OAuth 2.0 with PKCE.
- Tokens are stored in operating-system-level secure storage (iOS Keychain, Android Keystore).
- The App supports device-level biometric authentication (Face ID, Touch ID, fingerprint) as an optional second-factor app-lock.
- Customer business data on the device is protected by the operating system's full-disk encryption (iOS Data Protection, Android File-Based Encryption).

No system is perfectly secure. If you believe your account has been compromised, contact `security@ohanafy.com` immediately.

---

## 8. Your rights

Depending on where you live, you may have the right to:

- Access the personal information we hold about you
- Request correction of inaccurate information
- Request deletion of your information
- Object to or restrict certain processing
- Lodge a complaint with a data protection authority

To exercise these rights, email `privacy@ohanafy.com`.

For California residents (CCPA/CPRA): we do not "sell" personal information as that term is defined under California law, and we do not share personal information for cross-context behavioral advertising.

For users in the European Economic Area, the United Kingdom, or Switzerland: the legal basis for our processing is (a) performance of a contract (App functionality), (b) our legitimate interests in operating and improving the App, and (c) compliance with legal obligations.

---

## 9. Children

Ohanafy Field is a B2B tool for licensed adults. The App is not directed at children under 18 and we do not knowingly collect personal information from children.

---

## 10. International data transfers

Sentry, PostHog, Anthropic, Salesforce, and Labelary process data in the United States. By using the App you consent to the transfer of information to the United States.

---

## 11. Changes to this policy

We may update this policy from time to time. When we make a material change, we will notify you through the App and update the "Last updated" date. Your continued use of the App after a change constitutes acceptance of the updated policy.

---

## 12. Contact

- **Privacy questions:** `privacy@ohanafy.com`
- **Security issues:** `security@ohanafy.com`
- **General support:** `support@ohanafy.com`

**Ohanafy, Inc.**
Mailing address: (to be added)

---

*This policy is hosted at the URL provided in the App Store and Google Play listings, and within the App at Settings → Privacy Policy.*
