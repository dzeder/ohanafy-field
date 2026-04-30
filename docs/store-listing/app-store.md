# App Store Connect — Listing Copy (iOS)

Paste-in copy for App Store Connect → App Information + Version 1.0.

## App Information

| Field | Value | Limit |
|---|---|---|
| Name | `Ohanafy Field` | 30 chars (12 used) |
| Subtitle | `Beverage Field Sales` | 30 chars (20 used) |
| Bundle ID | `com.ohanafy.field` | — |
| SKU | `ohanafy-field-001` | — |
| Primary Category | `Business` | — |
| Secondary Category | `Productivity` | — |
| Content Rights | Does not use third-party content | — |
| Age Rating | `4+` | — |

## Version 1.0 — What's New

```
Initial release of Ohanafy Field.

A field sales tool built for beverage distributor reps who work where signal is unreliable. Voice-driven order entry, AI insights at the door, and on-the-spot label printing — all designed to work fully offline and sync the moment connectivity returns.
```

## Promotional Text (170 char max — editable post-release without re-review)

```
Voice orders, AI account intel, ZPL label printing — built for beverage reps who work where signal drops. Fully offline. Salesforce-native sync.
```

(140 chars used)

## Description (4000 char max)

```
Ohanafy Field is the field execution tool for beverage distributor sales reps. Built ground-up for the realities of the route — back-of-house with no signal, hands full at the bar, ten accounts to hit before lunch — Ohanafy Field gets the rep in and out faster while capturing more of what happens.

OFFLINE-FIRST, EVERYWHERE
Every read works without a network connection. Account list, order history, product catalog, last visit notes — all cached on device. Place orders and log visits in airplane mode and the sync engine flushes them automatically the moment signal returns. No more "I'll write that up when I get back to the truck."

VOICE-DRIVEN ORDER ENTRY
Tap the mic and speak naturally. "Add four cases of Yuengling Lager and three half-barrels of IPA." The on-device speech recognition transcribes in real time; Claude-powered AI interprets the command, builds the line items, and asks for confirmation before applying anything. Edit, accept, or undo with a single tap. The AI learns from corrections — the more you use it, the more accurate it gets for your specific products and shorthand.

AI ACCOUNT INTELLIGENCE
The moment you open an account, the InsightBanner shows what matters: days since last order, depletion patterns, suggested SKUs based on this account's history, and an urgency indicator. Pre-call prep that used to take fifteen minutes happens before you walk through the door. Every insight has a thumbs-up / thumbs-down so the system gets smarter over time.

PRINT ON THE SPOT
Pair a Zebra ZQ520 or ZQ630 Bluetooth printer and print shelf talkers, product feature cards, and delivery receipts directly from the app — no laptop, no shared printer, no waiting. Generate professional point-of-sale collateral and leave it with the buyer before the competition mails a flyer.

SALESFORCE-NATIVE
Built on Ohanafy's Salesforce platform. Authenticates via OAuth 2.0 with PKCE. Reads and writes to your existing Account, Contact, Order, and Activity records. Field activity flows back to managers in real time — no separate system to maintain.

BUILT FOR THE WAY REPS ACTUALLY WORK
- Tap targets sized for one-handed operation while moving
- Dark mode for early-morning warehouse runs
- VoiceOver and TalkBack support throughout
- iPad split-pane layout for desk planning
- Biometric app lock keeps your sales data private

REQUIREMENTS
- iOS 16 or later
- Salesforce org with Ohanafy installed
- Optional: Zebra ZQ520 or ZQ630 Bluetooth printer

ABOUT OHANAFY
Ohanafy is the modern operations platform for the beverage industry. Ohanafy Field is the mobile execution layer that complements the back-office. Reach us at support@ohanafy.com.
```

(2,724 chars — well under 4,000)

## Keywords (100 char max, comma-separated, no spaces after commas)

```
field sales,beverage,distributor,offline,voice,ZPL,Zebra,CRM,Salesforce,route,delivery,beer,wine
```

(99 chars used)

## URLs

| Field | Value |
|---|---|
| Support URL | `https://support.ohanafy.com` |
| Marketing URL | `https://ohanafy.com/field` |
| Privacy Policy URL | `<from Phase C.4 — paste GitHub Pages URL>` |
| Copyright | `© 2026 Ohanafy, Inc.` |

## Build / Submission selections (in App Store Connect UI)

- Routing app coverage file: **None**
- Sign-in required: **Yes** (Salesforce credentials)
- Content rights: **No, it does not contain, show, or access third-party content**
- Advertising identifier (IDFA): **No**
- Export Compliance: **No** — uses only HTTPS/TLS (covered by `ITSAppUsesNonExemptEncryption=false` in `app.json:26`)

## Submission notes (paste into App Review Information → Notes)

```
See attached reviewer notes (docs/store-listing/reviewer-notes.md). Demo Salesforce credentials provided.

Bluetooth permission justification: This app pairs with Zebra ZQ520/ZQ630 thermal printers to print shelf talkers and delivery receipts in the field. Bluetooth is used solely for printer communication. Core app functionality is fully testable without a printer paired.

Microphone permission justification: This app uses on-device speech recognition for hands-free order entry while the rep is at a bar or warehouse. The mic activates only when the user explicitly taps the mic button.

Location permission justification: Optional, used to show nearby accounts and surface route stops. Not required to use the app.

Camera permission justification: Used to scan product barcodes during visits. Optional.

Face ID / biometric permission justification: Optional app-lock to keep sales data private if the device is misplaced.
```
