# Data Safety + App Privacy — Both Stores

Authoritative answers for **Google Play → Data safety form** and **App Store Connect → App Privacy**.

Data flows are derived directly from `app.json` permissions, the SDKs in `package.json`, and the data architecture documented in Bible §17.3 + Security Review §8.

## Source-of-truth audit (permissions ↔ purpose)

| Source | Declared in | Purpose | Maps to data type |
|---|---|---|---|
| `NSCameraUsageDescription` | `app.json:21` | Scan product barcodes during visits | Camera (no images persisted off-device) |
| `NSMicrophoneUsageDescription` | `app.json:22` | Voice command transcription | Audio — processed on-device only, transcript is text |
| `NSFaceIDUsageDescription` | `app.json:23` | Biometric app-lock | None (Apple OS-level, no data leaves device) |
| `NSLocationWhenInUseUsageDescription` | `app.json:24` | Show nearby accounts, route stops | Approximate location (in-session only, not persisted) |
| `NSBluetoothAlwaysUsageDescription` | `app.json:25` | Pair Zebra ZQ520/ZQ630 thermal printer | None (printer comms only, no health/fitness data) |
| `RECORD_AUDIO` | `app.json:37` | Voice command transcription | Audio — on-device only |
| `USE_BIOMETRIC` / `USE_FINGERPRINT` | `app.json:38, 43` | Biometric app-lock | None |
| `BLUETOOTH_CONNECT` / `BLUETOOTH_SCAN` | `app.json:39, 40` | Pair printer | None |
| `ACCESS_FINE_LOCATION` | `app.json:41` | Show nearby accounts | Approximate location (in-session) |
| `CAMERA` | `app.json:42` | Scan barcodes | Camera |

**Mismatch check: passed.** Every permission has a corresponding declared purpose in the form below. No "drive-by" permissions.

---

## Google Play — Data safety form

For each section, the form expects three answers per data type: collected? / shared? / required-or-optional? / purpose.

### Personal info

| Data type | Collected? | Shared? | Required/Optional | Processed ephemerally? | Purpose(s) |
|---|---|---|---|---|---|
| Name | No | — | — | — | — |
| Email address | **Yes** | No | Required | No | App functionality (Salesforce login) |
| User IDs | **Yes** | With Sentry | Required | No | App functionality + Crash reporting |
| Address | No | — | — | — | — |
| Phone number | No | — | — | — | — |
| Race and ethnicity | No | — | — | — | — |
| Political or religious beliefs | No | — | — | — | — |
| Sexual orientation | No | — | — | — | — |
| Other info | No | — | — | — | — |

### Financial info

| Data type | Collected? | Shared? | Required/Optional | Processed ephemerally? | Purpose(s) |
|---|---|---|---|---|---|
| User payment info | No | — | — | — | — |
| Purchase history | No | — | — | — | — |
| Credit score | No | — | — | — | — |
| **Other financial info** (B2B order amounts) | **Yes** | No | Required | No | App functionality |

### Health and fitness

All **No** — app does not handle health or fitness data.

### Messages

All **No** — app does not handle SMS, email, or other messages.

### Photos and videos

| Data type | Collected? | Shared? | Required/Optional | Processed ephemerally? | Purpose(s) |
|---|---|---|---|---|---|
| Photos | No | — | — | — | — |
| Videos | No | — | — | — | — |

### Audio files

| Data type | Collected? | Shared? | Required/Optional | Processed ephemerally? | Purpose(s) |
|---|---|---|---|---|---|
| Voice or sound recordings | No | — | — | **Yes — transcribed on-device, not persisted** | App functionality |
| Music files | No | — | — | — | — |
| Other audio files | No | — | — | — | — |

> **Note for reviewers:** Audio is captured by `@react-native-voice/voice` for on-device speech-to-text. The audio buffer never leaves the device; only the resulting text transcript is stored. We answer "Not collected" because the audio itself is not persisted or transmitted, per Google's definition of "collected."

### Files and docs

All **No** — app does not collect user files.

### Calendar

All **No**.

### Contacts

All **No** — app reads from the customer's Salesforce org via authenticated API; does not access device contacts.

### App activity

| Data type | Collected? | Shared? | Required/Optional | Processed ephemerally? | Purpose(s) |
|---|---|---|---|---|---|
| App interactions | **Yes** | With PostHog | Required | No | Analytics, App functionality |
| In-app search history | No | — | — | — | — |
| Installed apps | No | — | — | — | — |
| Other user-generated content (visit notes, order line items) | **Yes** | No | Required | No | App functionality |
| Other actions | No | — | — | — | — |

### Web browsing

All **No**.

### App info and performance

| Data type | Collected? | Shared? | Required/Optional | Processed ephemerally? | Purpose(s) |
|---|---|---|---|---|---|
| Crash logs | **Yes** | With Sentry | Required | No | Analytics, Developer communications, App functionality |
| Diagnostics | **Yes** | With Sentry | Required | No | Analytics |
| Other app performance data | **Yes** | With Sentry / PostHog | Required | No | Analytics |

### Device or other IDs

| Data type | Collected? | Shared? | Required/Optional | Processed ephemerally? | Purpose(s) |
|---|---|---|---|---|---|
| Device or other IDs | **Yes** | With Sentry / PostHog | Required | No | Analytics, App functionality |

### Security practices

- **Is all of the user data collected by your app encrypted in transit?** Yes (HTTPS/TLS 1.2+ for every external call — Salesforce, Anthropic, Sentry, PostHog, Labelary).
- **Do you provide a way for users to request that their data be deleted?** Yes — see `docs/legal/privacy-policy.md` § "Your rights"; users can request deletion via privacy@ohanafy.com.

---

## App Store Connect — App Privacy

Use these answers in **App Store Connect → App Privacy → Set up Privacy**.

### Data Used to Track You

**None.** Ohanafy Field does not use any data to track users across apps and websites owned by other companies. No advertising identifiers used.

### Data Linked to You

| Category → Data type | Purpose | Linked? |
|---|---|---|
| **Contact Info → Email Address** | App Functionality | Yes (linked to user identity for Salesforce auth) |
| **Identifiers → User ID** | App Functionality, Analytics | Yes |
| **User Content → Other User Content** (visit notes, order line items) | App Functionality | Yes |
| **Diagnostics → Crash Data** | App Functionality, Analytics | Yes |
| **Diagnostics → Performance Data** | App Functionality, Analytics | Yes |
| **Diagnostics → Other Diagnostic Data** | App Functionality, Analytics | Yes |
| **Usage Data → Product Interaction** | App Functionality, Analytics | Yes |

### Data Not Linked to You

None — all collected data is linked to the authenticated user.

### Data Not Collected

- Health & Fitness
- Financial Info → Payment Info / Credit Info / Other Financial Info that is consumer-PII (we do collect B2B order amounts, but those are business records, not personal financial info — covered under "Other User Content")
- Location → Precise Location (we use approximate location only, in-session, never persisted off-device → declared as "Not Collected" per Apple's definition since it's not transmitted)
- Sensitive Info
- Contacts (device contacts — we read Salesforce contact records via authenticated API, which is **business data**, not device contact data)
- User Content → Photos or Videos / Audio Data / Gameplay Content / Customer Support / Emails or Text Messages
- Browsing History
- Search History
- Identifiers → Device ID *(see note below)*
- Purchases
- Other Data

> **Note on `Device ID`:** Sentry collects an installation-scoped UUID for crash deduplication. Per Apple's definition this counts as a User ID, not a Device ID. Already covered above.

---

## Third-party SDKs disclosed

| SDK | Data sent | Purpose | Privacy URL |
|---|---|---|---|
| Anthropic Claude API | Voice transcript text (≤500 char), account context (no PII) | AI features | https://www.anthropic.com/legal/privacy |
| Sentry | Stack traces, device OS, app version, installation UUID | Crash reporting | https://sentry.io/privacy/ |
| PostHog | Event names, screen names, anonymous user ID | Product analytics | https://posthog.com/privacy |
| Labelary | ZPL template string only (no user data) | Label preview rendering | https://labelary.com/privacy.html |
| Salesforce | All CRM data flows through customer's own Salesforce org under their existing data agreement | App functionality | (governed by customer's MSA with Salesforce) |

## iOS Privacy Manifest (`PrivacyInfo.xcprivacy`)

Already committed at repo root. Declares:
- `NSPrivacyAccessedAPICategoryFileTimestamp` — WatermelonDB file system access
- `NSPrivacyAccessedAPICategoryDiskSpace` — SQLite ops
- `NSPrivacyAccessedAPICategoryUserDefaults` — expo-secure-store
- `NSPrivacyTracking: false`
- `NSPrivacyTrackingDomains: []`
