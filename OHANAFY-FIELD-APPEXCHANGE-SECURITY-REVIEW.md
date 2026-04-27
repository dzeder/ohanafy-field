# Ohanafy Field — AppExchange Security Review
## Planning Guide & Checklist v1.0

> **What this is:** A complete guide to passing the Salesforce AppExchange Security Review for the Ohanafy Field managed package. The Security Review is a mandatory gate before any AppExchange listing. It regularly kills launch timelines because teams discover requirements late in development. This doc exists so you discover them on Day 1.
>
> **Who owns this:** The lead Salesforce developer on Ohanafy Field. Every code decision in the managed package (`packages/sfdx-package/`) must be made with this checklist in front of them.
>
> **Honest timeline:** First submission to approval: 3–6 months. Plan for at least one rejection cycle. Start the submission process as soon as the first deployable version exists — do not wait for feature-complete.

---

## Table of Contents

- [§1 — The Process Overview](#1--the-process-overview)
- [§2 — Pre-Submission Requirements](#2--pre-submission-requirements)
- [§3 — Apex Security Requirements](#3--apex-security-requirements)
- [§4 — Lightning Web Component Requirements](#4--lightning-web-component-requirements)
- [§5 — Mobile App Requirements (React Native)](#5--mobile-app-requirements-react-native)
- [§6 — Third-Party Library Audit](#6--third-party-library-audit)
- [§7 — Penetration Testing Requirements](#7--penetration-testing-requirements)
- [§8 — Data Handling Requirements](#8--data-handling-requirements)
- [§9 — Documentation Requirements](#9--documentation-requirements)
- [§10 — PMD Static Analysis Setup](#10--pmd-static-analysis-setup)
- [§11 — Pre-Submission Checklist](#11--pre-submission-checklist)
- [§12 — Submission Process](#12--submission-process)
- [§13 — Common Rejection Reasons](#13--common-rejection-reasons)
- [§14 — Post-Approval Requirements](#14--post-approval-requirements)
- [Appendix A — PMD Ruleset](#appendix-a--pmd-ruleset)
- [Appendix B — Required Documentation Templates](#appendix-b--required-documentation-templates)

---

## §1 — The Process Overview

### The sequence

```
1. Salesforce Partner Community account
          ↓
2. ISV/OEM Partner Agreement signed
          ↓
3. Package development in packaging org
          ↓
4. Partner Community listing created (draft)
          ↓
5. Security Review submission
          ↓
   ┌──────────────────────────────────┐
   │  Salesforce Security Review Team │
   │  - Automated scanner (PMD, SAST) │
   │  - Manual code review            │
   │  - Penetration testing           │
   │  - Documentation review          │
   └──────────────────────────────────┘
          ↓
6. Review result: Pass / Reject with findings
          ↓ (if rejected)
7. Remediate findings → resubmit
          ↓
8. Approval → listing goes live
```

### What's reviewed

Salesforce reviews **three things:**

1. **The managed package** — every line of Apex, every LWC, every custom object, every permission set, every custom setting
2. **Connected apps and OAuth** — how the mobile app authenticates, what scopes it requests, how tokens are stored
3. **Third-party integrations** — any external service the package calls (Anthropic API, Labelary, etc.)

The React Native app itself is **not directly reviewed by Salesforce** — it's reviewed by Apple App Store and Google Play. However, the Connected App and OAuth implementation in the package is reviewed.

### Cost

- Security Review fee: $150 USD per submission (as of 2026)
- Resubmission fee: $150 per resubmission
- Pen test vendor: $3,000–$8,000 depending on scope and vendor
- Budget: $10,000–$15,000 total including multiple submission attempts

---

## §2 — Pre-Submission Requirements

These must be true before you can even submit. None of them are fast.

### 2.1 Salesforce Partner Community account

- Register at `partners.salesforce.com`
- Select ISV Partner track
- Acceptance requires business review — can take 2–4 weeks
- **Start this before you write the first line of Apex**

### 2.2 Namespace registration

- Register your namespace (`ohfy_field`) in a Developer Edition org
- This is your **packaging org** — all managed package development happens here
- **The namespace cannot be changed after registration.** Choose carefully.
- The namespace must not conflict with any existing AppExchange package — search first

### 2.3 Security Review prerequisites

Before Salesforce will accept a submission:
- [ ] Your AppExchange listing is created (even as a draft)
- [ ] The package is uploaded from the packaging org (at least one version exists)
- [ ] You have a Salesforce-certified penetration test report (or use their approved vendor)
- [ ] All documentation in §9 is complete

### 2.4 Environment setup

You need three distinct Salesforce environments:

| Environment | Purpose |
|---|---|
| **Packaging org** | Developer Edition with namespace registered. All Apex and LWC is developed and packaged here. Never used for testing with real data. |
| **Development sandbox** | Scratch org or sandbox for active development. Connected to the packaging org via SFDX. Has Ohanafy core package installed. |
| **Review org** | A clean org (Enterprise Edition or Developer Edition) that has never had the package installed. Used for Security Review submission. Reviewers install and test here. |

---

## §3 — Apex Security Requirements

These are the most common rejection reasons. Every Apex class in `packages/sfdx-package/force-app/main/default/classes/` must pass all of them.

### 3.1 Sharing rules (critical)

Every Apex class must declare its sharing model explicitly. No exceptions.

```apex
// CORRECT — explicit sharing declaration
public with sharing class OhfyFieldVisitService {
  // with sharing = enforces Salesforce record-level security
  // Records the current user can't see in Salesforce, they can't see here
}

// CORRECT — for system-context operations where sharing must be bypassed
public without sharing class OhfyFieldSyncBatchJob implements Database.Batchable<sObject> {
  // without sharing = runs as system, bypasses record-level security
  // ONLY use when the business requirement demands it
  // DOCUMENT WHY in a comment above the class
}

// WRONG — no sharing keyword = inherited context = unpredictable and rejected
public class OhfyFieldVisitService {  // ← REJECTED
}
```

**Rule:** Default to `with sharing` for every class. Use `without sharing` only for batch jobs, scheduled jobs, or other cases where the business logic requires system-level access. Document every `without sharing` with a comment explaining why.

### 3.2 SOQL injection prevention

Never concatenate user input into a SOQL string. Always use bind variables.

```apex
// WRONG — SOQL injection vulnerability, immediate rejection
String query = 'SELECT Id FROM Account WHERE Name = \'' + accountName + '\'';
List<Account> accounts = Database.query(query);

// CORRECT — bind variable, safe
List<Account> accounts = [
  SELECT Id FROM Account WHERE Name = :accountName
];

// CORRECT — dynamic SOQL (necessary sometimes) with proper escaping
String query = 'SELECT Id FROM Account WHERE ' + String.escapeSingleQuotes(fieldName) + ' = :value';
// But prefer static SOQL whenever possible
```

### 3.3 SOQL in loops (governor limits + rejection)

```apex
// WRONG — SOQL inside a for loop, rejected
for (ohfy_field__Visit__c visit : visits) {
  Account acc = [SELECT Name FROM Account WHERE Id = :visit.ohfy_field__Account__c];
  // This hits governor limits AND is a security review rejection
}

// CORRECT — bulk query outside the loop
Set<Id> accountIds = new Set<Id>();
for (ohfy_field__Visit__c visit : visits) {
  accountIds.add(visit.ohfy_field__Account__c);
}
Map<Id, Account> accountMap = new Map<Id, Account>(
  [SELECT Id, Name FROM Account WHERE Id IN :accountIds]
);
for (ohfy_field__Visit__c visit : visits) {
  Account acc = accountMap.get(visit.ohfy_field__Account__c);
}
```

### 3.4 DML in loops

```apex
// WRONG — DML inside a for loop, rejected
for (OhfyFieldOrderPayload payload : payloads) {
  ohfy_field__Order__c order = new ohfy_field__Order__c(/* ... */);
  insert order;  // ← REJECTED
}

// CORRECT — collect and bulk insert
List<ohfy_field__Order__c> ordersToInsert = new List<ohfy_field__Order__c>();
for (OhfyFieldOrderPayload payload : payloads) {
  ordersToInsert.add(new ohfy_field__Order__c(/* ... */));
}
insert ordersToInsert;
```

### 3.5 Field-level security (FLS) enforcement

Every field access in Apex that originates from user input must check FLS. Salesforce automated scanner flags any field access in a `with sharing` class that doesn't check FLS.

```apex
// WRONG — direct field access without FLS check
public String getAccountName(Id accountId) {
  Account acc = [SELECT Name FROM Account WHERE Id = :accountId];
  return acc.Name;  // ← Scanner may flag this
}

// CORRECT — use WITH SECURITY_ENFORCED (Salesforce recommended)
public String getAccountName(Id accountId) {
  Account acc = [
    SELECT Name FROM Account WHERE Id = :accountId
    WITH SECURITY_ENFORCED
  ];
  return acc.Name;
}

// ALTERNATIVE — Schema.SObjectField FLS check (older pattern)
if (Schema.SObjectType.Account.fields.Name.isAccessible()) {
  Account acc = [SELECT Name FROM Account WHERE Id = :accountId];
  return acc.Name;
}
return null;
```

**Recommendation:** Use `WITH SECURITY_ENFORCED` in all new SOQL. It's cleaner and the scanner recognizes it.

### 3.6 No hardcoded IDs or credentials

```apex
// WRONG — hardcoded Salesforce record ID, rejected
private static final String DEFAULT_PRICEBOOK_ID = '01s000000000000AAA';

// CORRECT — query for it
private static Id getStandardPricebookId() {
  return Test.isRunningTest()
    ? Test.getStandardPricebookId()
    : [SELECT Id FROM Pricebook2 WHERE IsStandard = true LIMIT 1].Id;
}
```

```apex
// WRONG — any credential in Apex, immediately rejected
private static final String API_KEY = 'sk-ant-api03-...';

// CORRECT — use Custom Metadata or Named Credentials
ohfy_field__AI_Config__mdt config = [
  SELECT ohfy_field__ApiKey__c FROM ohfy_field__AI_Config__mdt LIMIT 1
];
```

### 3.7 @AuraEnabled methods — security requirements

Every `@AuraEnabled` method that the LWC or mobile app calls must validate its inputs.

```apex
// Required pattern for every @AuraEnabled method
@AuraEnabled
public static SyncResult syncVisit(String visitJson) {
  // 1. Null check inputs
  if (String.isBlank(visitJson)) {
    throw new AuraHandledException('visitJson cannot be blank');
  }

  // 2. Size limit check (prevent DoS via huge payloads)
  if (visitJson.length() > 32768) {  // 32KB limit
    throw new AuraHandledException('Payload too large');
  }

  // 3. Deserialize safely (not JSON.deserializeUntyped unless necessary)
  OhfyFieldVisitPayload payload;
  try {
    payload = (OhfyFieldVisitPayload) JSON.deserialize(
      visitJson, OhfyFieldVisitPayload.class
    );
  } catch (JSONException e) {
    throw new AuraHandledException('Invalid JSON: ' + e.getMessage());
  }

  // 4. ID validation
  if (!isValidSalesforceId(payload.accountId)) {
    throw new AuraHandledException('Invalid account ID');
  }

  // 5. Actual work
  // ...
}

private static Boolean isValidSalesforceId(String id) {
  if (String.isBlank(id)) return false;
  try {
    Id sfId = Id.valueOf(id);
    return sfId.getSobjectType() == ohfy__Account__c.SObjectType;
  } catch (StringException e) {
    return false;
  }
}
```

### 3.8 Exception handling — no swallowed exceptions

```apex
// WRONG — swallowed exception, reviewer will look for these
try {
  insert order;
} catch (DmlException e) {
  // do nothing
}

// CORRECT — log and surface
try {
  insert order;
} catch (DmlException e) {
  logger.logException(e, 'OhfyFieldSyncAdapter.syncOrder');
  throw new AuraHandledException(
    'Failed to save order: ' + e.getDmlMessage(0)
  );
}
```

### 3.9 Test class requirements (75% coverage minimum for deployment)

Salesforce requires 75% overall code coverage to deploy to production. The Security Review will also look at test quality.

```apex
@isTest
private class OhfyFieldSyncAdapterTest {

  // Use @testSetup for data shared across tests — not @isTest methods with direct DML
  @testSetup
  static void setupTestData() {
    Account testAccount = TestDataFactory.createAccount();
    Product2 testProduct = TestDataFactory.createProduct();
    // etc.
  }

  @isTest
  static void syncVisit_withValidPayload_createsVisitRecord() {
    // Arrange
    Account acc = [SELECT Id FROM Account LIMIT 1];
    String payload = JSON.serialize(new Map<String, Object>{
      'accountId' => acc.Id,
      'visitDate' => Datetime.now().format(),
      'note' => 'Test visit note'
    });

    // Act
    Test.startTest();
    OhfyFieldSyncAdapter.SyncResult result =
      OhfyFieldSyncAdapter.syncVisit(payload);
    Test.stopTest();

    // Assert
    System.assertEquals(true, result.success, 'Sync should succeed');
    System.assertNotEquals(null, result.recordId, 'Record ID should be returned');

    ohfy_field__Visit__c created = [
      SELECT Id, ohfy_field__Note__c
      FROM ohfy_field__Visit__c
      WHERE Id = :result.recordId
    ];
    System.assertEquals('Test visit note', created.ohfy_field__Note__c);
  }

  @isTest
  static void syncVisit_withBlankPayload_throwsAuraHandledException() {
    try {
      OhfyFieldSyncAdapter.syncVisit('');
      System.assert(false, 'Should have thrown exception');
    } catch (AuraHandledException e) {
      System.assert(e.getMessage().contains('cannot be blank'));
    }
  }

  @isTest
  static void syncVisit_withOversizePayload_throwsAuraHandledException() {
    String oversizePayload = 'x'.repeat(33000);
    try {
      OhfyFieldSyncAdapter.syncVisit(oversizePayload);
      System.assert(false, 'Should have thrown exception');
    } catch (AuraHandledException e) {
      System.assert(e.getMessage().contains('too large'));
    }
  }
}
```

**Coverage target for Security Review:** 90%+ on all Apex classes. 75% is the deployment floor; reviewers look more favorably on higher coverage.

---

## §4 — Lightning Web Component Requirements

### 4.1 LockerService compliance

Every LWC runs inside Salesforce's LockerService sandbox. Common failures:

```javascript
// WRONG — direct DOM manipulation, blocked by LockerService
document.querySelector('.my-class').style.color = 'red';

// CORRECT — use the @api, @track, and template refs
@track myStyle = 'color: red;';
// In template: <div style={myStyle}>

// WRONG — accessing window directly in ways LockerService blocks
window.parent.location; // blocked
window.opener; // blocked

// WRONG — eval() or Function() constructor, blocked
const fn = new Function('return 42');

// WRONG — accessing other components' internals across namespace
const childEl = this.template.querySelector('c-other-component');
childEl._privateProperty; // blocked
```

### 4.2 XSS prevention in LWC

```html
<!-- WRONG — renders raw HTML, XSS risk, rejected -->
<div lwc:dom="manual" onclick={handleClick}></div>
<!-- Plus: component.template.querySelector(...).innerHTML = userInput -->

<!-- CORRECT — use data binding which auto-escapes -->
<div>{userInput}</div>

<!-- For intentional HTML rendering: use lightning-formatted-rich-text
     which sanitizes the input -->
<lightning-formatted-rich-text value={sanitizedHtml}></lightning-formatted-rich-text>
```

### 4.3 Content Security Policy (CSP)

No inline scripts. No `eval()`. No external stylesheets loaded dynamically. All JavaScript must be in `.js` files in the component bundle. External resources must be added to the org's CSP Trusted Sites.

For Ohanafy Field, the LWC components (`ohanafyFieldActivity` and the Admin Console) must not load any external resources at runtime — all dependencies are bundled or come from Salesforce's CDN.

### 4.4 LWC security checklist

- [ ] No `innerHTML` assignments with user data
- [ ] No `eval()` or `Function()` constructor
- [ ] No `document.write()`
- [ ] No cross-namespace DOM access
- [ ] No synchronous `XMLHttpRequest`
- [ ] All `@wire` methods handle `error` property
- [ ] All `@AuraEnabled` calls have error handling
- [ ] CSP Trusted Sites configured for any external domains

---

## §5 — Mobile App Requirements (React Native)

The React Native app is not reviewed by Salesforce directly, but the **Connected App integration** is. Requirements:

### 5.1 OAuth scope minimization

Request only the OAuth scopes you actually use. The Security Review will reject overly broad scopes.

**Required scopes for Ohanafy Field:**
- `api` — REST API access to Ohanafy objects
- `refresh_token` — for offline token refresh
- `offline_access` — to call the API without user interaction

**Do NOT request:**
- `full` — too broad; rejected
- `visualforce` — not needed; rejected if requested
- `web` — not needed for mobile

### 5.2 Token storage requirements

Security Review verifies the OAuth security model through documentation. Your submission must include:

- Description of how tokens are stored (iOS Keychain via `expo-secure-store`)
- Description of token refresh mechanism
- Description of token revocation handling (Force Logout from Admin Console)
- Confirmation that tokens are never logged, never included in error reports, and never stored in plaintext

### 5.3 PKCE enforcement

The mobile app's OAuth flow must use PKCE (Proof Key for Code Exchange). Non-PKCE mobile OAuth flows are rejected. The `expo-auth-session` implementation in the Product Bible uses PKCE correctly — confirm `usePKCE: true` is present in the `AuthRequest` constructor.

### 5.4 Deep link security

The OAuth redirect URI (`com.ohanafy.field://oauth/callback`) must be validated in the `expo-auth-session` callback to prevent open redirect attacks. The Expo AuthSession library handles this automatically, but document it in your submission.

---

## §6 — Third-Party Library Audit

Every npm package used in LWCs and every external service called from Apex must be disclosed and justified.

### 6.1 Libraries in the managed package (LWC bundles)

For Ohanafy Field, the Admin Console LWC bundles minimal external libraries. Any library bundled into the LWC must:
- Have no known CVEs (check at `npmjs.com` and `snyk.io`)
- Be actively maintained (last commit within 12 months)
- Have a compatible license (MIT, Apache 2.0, BSD — not GPL unless Ohanafy has a commercial license)
- Not make external network calls of its own

**The Admin Console LWC should have zero bundled third-party libraries.** Use only Salesforce's base components (`lightning-*`) and standard browser APIs.

### 6.2 External services called from Apex

Every external callout from Apex must be declared as a Named Credential or Remote Site Setting.

| Service | How called | Security Review requirement |
|---|---|---|
| Anthropic API | From mobile app (not Apex) for v1.0 | Document in submission — not a managed package callout |
| Labelary API | From mobile app (not Apex) | Same |
| Any future Apex callouts | Must use Named Credentials | Required for review |

**For v1.0:** No Apex callouts to external services. All AI and ZPL calls are from the React Native app directly. This simplifies the Security Review significantly.

If future versions add Apex callouts (e.g., for the Apex proxy architecture for AI), each must use Salesforce Named Credentials and be declared in the security submission.

### 6.3 External JavaScript resources in LWC

Any JavaScript loaded from an external CDN in a LWC must be declared in the package's `staticresources` instead. The Security Review scanner flags any external script loads from unknown CDNs.

```html
<!-- WRONG — loading from external CDN -->
<script src="https://cdn.example.com/library.js"></script>

<!-- CORRECT — bundle in staticresources -->
<script src={libraryUrl}></script>
<!-- Where libraryUrl resolves to a Static Resource in the org -->
```

---

## §7 — Penetration Testing Requirements

The AppExchange Security Review requires a penetration test for any app that handles financial or sensitive business data. Ohanafy Field handles order data and account financial history — a pen test is required.

### 7.1 Salesforce-approved vendors

Salesforce maintains a list of approved penetration testing vendors. You must use one of them — your own internal pen test is not accepted. Current approved vendors (verify current list at `appexchangehelp.salesforce.com`):

- Bishop Fox
- Coalfire
- Rapid7
- WhiteHat Security
- Veracode
- Synopsys

**Cost estimate:** $3,000–$8,000 depending on scope and vendor. Budget $5,000.

### 7.2 Pen test scope for Ohanafy Field

The pen test must cover:
- All `@AuraEnabled` Apex methods
- The OAuth/Connected App flow
- The Admin Console Lightning app
- The Sync Monitor admin actions (retry/discard sync items)
- Any REST API endpoints exposed by the package

The React Native app itself is typically out of scope for the Salesforce-required pen test (Apple and Google cover that). However, pen testing the API endpoints the mobile app calls is in scope.

### 7.3 Timeline

The pen test takes 2–4 weeks from engagement to report. The report must be submitted with your Security Review application.

**Start the pen test engagement at the same time you start the Security Review submission — not after you think you're ready.** The pen test will find issues that need fixing, which takes time.

---

## §8 — Data Handling Requirements

### 8.1 Data residency

All customer data stays in their Salesforce org. Ohanafy Field does not store any customer data outside of:
- Their Salesforce org (custom objects in the managed package)
- Their mobile devices (WatermelonDB, which syncs to/from their Salesforce org)

No Ohanafy-operated databases contain customer data. This must be stated explicitly in the submission and in the privacy policy.

### 8.2 PII handling

Ohanafy Field handles:
- Business contact names and phone numbers (account contacts) — not consumer PII
- Visit notes authored by the rep — may contain customer names
- Order data — financial business data

It does NOT handle:
- Consumer PII (names, emails, addresses of individual consumers)
- Payment card data
- Healthcare data

This must be stated in the AppExchange listing's Data Use section.

### 8.3 Data retention in the mobile app

WatermelonDB data on the device:
- Is wiped on app uninstall
- Can be manually cleared by the rep in Settings → Clear Local Data
- Is cleared and re-synced on every Full Resync (configurable in Admin Console)
- Is protected by device-level encryption (iOS Data Protection, Android File-Based Encryption)

### 8.4 Encryption in transit

- All Salesforce API calls: HTTPS/TLS 1.2+
- All Anthropic API calls: HTTPS/TLS 1.2+
- All Labelary API calls: HTTPS (HTTP is allowed by Labelary but must use HTTPS for this app)

**Note for Security Review:** Update the Labelary API call in `src/zpl/preview.ts` to use `https://api.labelary.com` not `http://`. The review will flag unencrypted HTTP callouts.

---

## §9 — Documentation Requirements

The Security Review requires all of the following documentation to be submitted.

### 9.1 Required documents (must exist before submission)

| Document | Description | Owner |
|---|---|---|
| Privacy Policy | What data is collected, how it's used, how it's deleted. Must be hosted at a public URL (e.g., `ohanafy.com/field/privacy`). | Legal / Product |
| Terms of Service | Governs use of the app. Must be accessible from the app and the AppExchange listing. | Legal |
| Data Use Disclosure | AppExchange-specific form. Declares data collected, third-party services used, data residency. | Product |
| Architecture Overview | 1-2 page document describing the system components, data flows, and external integrations. | Engineering |
| Connected App Security Doc | Description of OAuth flow, token storage, PKCE implementation, token revocation. | Engineering |
| Third-Party Service Disclosure | List of every external service called by the package or mobile app, with justification. | Engineering |
| Penetration Test Report | From an approved vendor (see §7). | Security |

### 9.2 Architecture overview template

```markdown
# Ohanafy Field — Architecture Overview
(Submitted with AppExchange Security Review)

## System Components

### Managed Package (Salesforce)
- Custom Objects: [list all ohfy_field__*__c objects]
- Custom Metadata: [ohfy_field__AI_Config__mdt, ohfy_field__Admin_Config__mdt]
- Apex Classes: [list all classes with sharing model]
- LWCs: [list all components]
- Permission Sets: [list all 6 permission sets + App Admin]
- Connected App: ohanafy_field (OAuth 2.0 PKCE, scopes: api, refresh_token, offline_access)

### Mobile Application (React Native / Expo)
- Platform: iOS 16+ and Android 10+
- Distribution: Apple App Store, Google Play Store
- Authentication: Salesforce Connected App OAuth 2.0 PKCE
- Local storage: SQLite (WatermelonDB) — device only, encrypted at rest
- External calls: Anthropic Claude API (AI features), Labelary API (ZPL preview)

### Data Flow
1. Rep opens app → authenticates via Salesforce OAuth
2. App syncs account/product/order data from Salesforce to local SQLite
3. Rep creates orders/visits offline → stored in SQLite sync queue
4. On network reconnect → sync queue flushed to Salesforce via REST API
5. AI features (voice, insights) → direct call from device to Anthropic API
6. ZPL preview → direct call from device to Labelary API
7. ZPL print → Bluetooth to Zebra printer (no network involved)

### No shared infrastructure
Ohanafy does not operate any database or server that stores customer data.
All customer data resides in their Salesforce org or their mobile devices.

## External Services

| Service | Purpose | Data sent | Auth |
|---|---|---|---|
| Anthropic API | AI voice commands and insights | Visit context, voice transcript (no PII) | API key in device SecureStore |
| Labelary API | ZPL label preview rendering | ZPL string only (no customer data) | None (public API) |
| Sentry | Crash reporting | Stack traces, device info (no customer data) | DSN key |
| PostHog | Product analytics | Usage events (no customer data, no PII) | API key |

## Security Controls

| Control | Implementation |
|---|---|
| Authentication | Salesforce OAuth 2.0 PKCE |
| Token storage | iOS Keychain / Android Keystore via expo-secure-store |
| Biometric lock | expo-local-authentication (FaceID/TouchID/Fingerprint) |
| Data encryption in transit | HTTPS/TLS 1.2+ for all API calls |
| Data encryption at rest | Device OS encryption (iOS Data Protection, Android FBE) |
| Permission enforcement | Salesforce Permission Sets, read at auth time |
| Audit logging | ohfy_field__Admin_Audit_Log__c (immutable Salesforce object) |
```

---

## §10 — PMD Static Analysis Setup

PMD (Project Mess Detector) is the static analysis tool Salesforce uses in its automated scanner. Run it locally before every submission to catch issues early.

### 10.1 Install PMD

```bash
# Install PMD (macOS via Homebrew)
brew install pmd

# Or download from https://pmd.github.io/ and add to PATH

# Verify
pmd --version
```

### 10.2 Salesforce-specific ruleset

Save as `scripts/pmd-ruleset.xml` (full content in Appendix A):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<ruleset name="Ohanafy Field Apex Rules"
         xmlns="http://pmd.sourceforge.net/ruleset/2.0.0">

  <description>Security Review compliance ruleset for Ohanafy Field</description>

  <!-- Salesforce Security Review critical rules -->
  <rule ref="category/apex/security.xml/ApexSharingViolations" />
  <rule ref="category/apex/security.xml/ApexSOQLInjection" />
  <rule ref="category/apex/security.xml/ApexXSSFromURLParam" />
  <rule ref="category/apex/security.xml/ApexCRUDViolation" />
  <rule ref="category/apex/security.xml/ApexOpenRedirect" />
  <rule ref="category/apex/security.xml/ApexInsecureEndpoint" />

  <!-- Performance rules (also flagged in review) -->
  <rule ref="category/apex/performance.xml/AvoidSoqlInLoops" />
  <rule ref="category/apex/performance.xml/AvoidDmlStatementsInLoops" />
  <rule ref="category/apex/performance.xml/AvoidSoslInLoops" />

  <!-- Best practices -->
  <rule ref="category/apex/bestpractices.xml/AvoidGlobalModifier" />
  <rule ref="category/apex/bestpractices.xml/DebugsShouldUseLoggingLevel" />

  <!-- Error handling -->
  <rule ref="category/apex/errorprone.xml/EmptyCatchBlock" />
  <rule ref="category/apex/errorprone.xml/AvoidHardcodingId" />

</ruleset>
```

### 10.3 Run PMD

```bash
# Run PMD on all Apex in the SFDX package
pmd check \
  --dir packages/sfdx-package/force-app/main/default/classes/ \
  --rulesets scripts/pmd-ruleset.xml \
  --format text \
  --fail-on-violation

# For CI integration:
pmd check \
  --dir packages/sfdx-package/force-app/main/default/classes/ \
  --rulesets scripts/pmd-ruleset.xml \
  --format xml \
  --report-file reports/pmd-results.xml
```

### 10.4 Add PMD to CI

```yaml
# Add to .github/workflows/ci.yml

  apex-security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup PMD
        run: |
          wget https://github.com/pmd/pmd/releases/download/pmd_releases/7.0.0/pmd-dist-7.0.0-bin.zip
          unzip pmd-dist-7.0.0-bin.zip
          echo "$PWD/pmd-bin-7.0.0/bin" >> $GITHUB_PATH
      - name: Run PMD on Apex
        run: |
          pmd check \
            --dir packages/sfdx-package/force-app/main/default/classes/ \
            --rulesets scripts/pmd-ruleset.xml \
            --format text \
            --fail-on-violation
```

**Zero PMD violations is the target.** The CI gate blocks any merge that introduces PMD violations.

### 10.5 Salesforce Code Analyzer (local)

Salesforce also has their own scanner that goes beyond PMD:

```bash
# Install Salesforce CLI Scanner plugin
sf plugins install @salesforce/sfdx-scanner

# Run the full scanner
sf scanner run \
  --target packages/sfdx-package/force-app/main/default/classes/ \
  --category Security \
  --format table

# Run against specific severity
sf scanner run \
  --target packages/sfdx-package/force-app/main/default/ \
  --severity-threshold 2 \
  --format csv \
  --outfile reports/sf-scanner-results.csv
```

Severity 1 violations (Critical) block submission. Severity 2 violations (High) require written justification if you cannot fix them. Severity 3+ are advisory.

---

## §11 — Pre-Submission Checklist

Complete every item before submitting. This checklist maps to the exact items Salesforce reviewers check.

### Salesforce Partner requirements
- [ ] Partner Community account active and in good standing
- [ ] ISV/OEM Partner Agreement signed
- [ ] Namespace registered (`ohfy_field`)
- [ ] Package uploaded from packaging org (at least version 1.0)
- [ ] AppExchange listing created in draft

### Apex code quality
- [ ] Every Apex class has explicit sharing declaration (`with sharing` or `without sharing`)
- [ ] All `without sharing` classes have a comment explaining why
- [ ] Zero SOQL injection vulnerabilities (no string concatenation in SOQL)
- [ ] Zero SOQL in loops
- [ ] Zero DML in loops
- [ ] All `@AuraEnabled` methods validate inputs (null check, size limit, type check)
- [ ] All `@AuraEnabled` methods handle exceptions and surface human-readable errors
- [ ] No hardcoded IDs anywhere
- [ ] No hardcoded credentials anywhere
- [ ] `WITH SECURITY_ENFORCED` used in all SOQL that accesses user-visible data
- [ ] Test coverage ≥ 90% across all Apex classes
- [ ] All test methods use `Test.startTest()` / `Test.stopTest()`
- [ ] No `@SuppressWarnings` annotations that hide real issues

### PMD and scanner
- [ ] `pmd check` returns zero violations on the full ruleset
- [ ] `sf scanner run --category Security` returns zero Severity 1 violations
- [ ] All Severity 2 violations documented with written justification

### LWC quality
- [ ] No `innerHTML` assignments with user data
- [ ] No `eval()` or `Function()` constructor
- [ ] No synchronous XHR
- [ ] All external resources are in Static Resources, not CDN links
- [ ] LockerService compliance verified (test in a scratch org, not just local)
- [ ] All `@wire` methods handle both `data` and `error` cases
- [ ] CSP Trusted Sites configured for all external domains

### Mobile app security
- [ ] OAuth flow uses PKCE (`usePKCE: true` confirmed)
- [ ] Only required OAuth scopes requested (`api`, `refresh_token`, `offline_access`)
- [ ] All API calls use HTTPS (no HTTP endpoints)
- [ ] Labelary call uses `https://api.labelary.com` (not `http://`)
- [ ] No OAuth tokens logged to Sentry or any analytics service
- [ ] Token storage documented (iOS Keychain / Android Keystore)
- [ ] Force Logout flow implemented and tested

### Documentation
- [ ] Privacy Policy hosted at public URL
- [ ] Terms of Service hosted at public URL
- [ ] Architecture Overview document complete (template in §9.2)
- [ ] Connected App Security document complete
- [ ] Third-Party Service Disclosure complete
- [ ] Data Use Disclosure filled in AppExchange Partner Portal
- [ ] Penetration Test report received from approved vendor

### AppExchange listing content
- [ ] App name: "Ohanafy Field"
- [ ] Short description (< 100 chars)
- [ ] Long description (accurate, no false claims)
- [ ] Screenshots: at minimum 3 (each role's primary screen recommended)
- [ ] Demo video (strongly recommended — reviewers watch them)
- [ ] Supported Editions: specify (Professional, Enterprise, Unlimited)
- [ ] License type selected (per-user, per-site, or free)
- [ ] Industries: select Manufacturing + Retail + other applicable
- [ ] Support contact information
- [ ] Installation instructions documented

---

## §12 — Submission Process

### 12.1 Submit via Partner Community

1. Log in to `partners.salesforce.com`
2. Navigate to **AppExchange** → **My Listings** → select Ohanafy Field draft
3. Click **Start Security Review**
4. Complete the Security Review Questionnaire (30–60 minutes)
5. Upload all required documentation
6. Submit the penetration test report
7. Provide the Review Org credentials (username/password for the clean org with your package installed)
8. Pay the $150 submission fee
9. Submit

### 12.2 During review

- Review timeline: 4–8 weeks from submission
- Salesforce may send follow-up questions by email — respond within 5 business days or the review is paused
- You can check status at any time in the Partner Community
- Do not submit updates to the package during an active review

### 12.3 If rejected

Salesforce sends a rejection with specific findings categorized by severity. For each finding:

1. Understand exactly what the reviewer flagged
2. Fix the issue in the packaging org and re-run PMD/scanner
3. Test the fix in the Review Org
4. Prepare a written response explaining how each finding was addressed
5. Upload the updated package version
6. Pay the $150 resubmission fee
7. Resubmit

**Do not argue with findings.** Even if you believe a finding is incorrect, the fastest path to approval is to fix it. You can request clarification before fixing, but keep it brief.

---

## §13 — Common Rejection Reasons

Based on real AppExchange rejection patterns. Fix all of these proactively.

### Apex rejections (most common)

| Issue | Frequency | Fix |
|---|---|---|
| Missing sharing declaration on Apex class | Very common | Add `with sharing` to every class |
| CRUD/FLS violations — accessing fields without security check | Very common | Add `WITH SECURITY_ENFORCED` to all SOQL |
| SOQL in for loop | Common | Collect IDs, query outside loop |
| Hardcoded Salesforce ID | Common | Query for the record ID at runtime |
| Empty catch block | Common | Log the exception, never swallow it |
| No null check on @AuraEnabled method inputs | Common | Always validate inputs |
| Test methods with no assertions | Common | Every `@isTest` method must have `System.assert*` calls |
| `@SuppressWarnings` hiding real violations | Occasional | Fix the real issue |

### LWC rejections

| Issue | Frequency | Fix |
|---|---|---|
| External CDN script in LWC | Common | Move to Static Resource |
| Unescaped user input in template | Occasional | Use `{variable}` binding, not `innerHTML` |
| LockerService violation in test | Occasional | Test LWCs in a real scratch org, not just locally |

### Documentation rejections

| Issue | Frequency | Fix |
|---|---|---|
| Privacy Policy missing or inaccessible | Very common | Host at a real URL before submission |
| Data Use Disclosure incomplete | Common | Every field in the Partner Portal form must be filled |
| Architecture doc missing external service disclosures | Common | List every external service, even Sentry and PostHog |
| Pen test scope didn't cover all @AuraEnabled methods | Occasional | Ensure pen test scope doc lists all endpoints |

### Mobile / OAuth rejections

| Issue | Frequency | Fix |
|---|---|---|
| Non-PKCE OAuth flow | Occasional | Confirm `usePKCE: true` |
| Overly broad OAuth scopes | Occasional | Remove `full` scope, use only what's needed |
| Insufficient documentation of token storage | Common | Write the Connected App security doc explicitly |
| HTTP (not HTTPS) callout | Occasional | Audit every external URL in the codebase |

---

## §14 — Post-Approval Requirements

Approval is not a one-time event. Ongoing requirements:

### Annual security review

AppExchange requires an annual security review refresh for packages that handle sensitive data. Same process, same fee, but typically faster if no major architectural changes.

### Patch versions

Minor bug fix releases (patch versions) typically do not require a new security review. Major versions (new features, new external integrations, new OAuth scopes) require a full re-review.

### CVE monitoring

Ohanafy is responsible for monitoring CVEs in third-party dependencies and patching promptly. Salesforce may reach out if a critical CVE is reported for a library used in your package. You have 30 days to release a patched version or your listing may be suspended.

### AppExchange monitoring

Salesforce monitors AppExchange listings for compliance. Reviews are triggered by:
- Customer complaints
- Significant version updates
- New CVEs in dependencies
- Changes to data handling disclosures

### Maintain the review org

Keep the review org (clean installation with test credentials) live and accessible. Salesforce's support team uses it to reproduce issues reported by customers.

---

## Appendix A — PMD Ruleset

Save as `scripts/pmd-ruleset.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<ruleset name="Ohanafy Field Security Review Ruleset"
         xmlns="http://pmd.sourceforge.net/ruleset/2.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://pmd.sourceforge.net/ruleset/2.0.0
           http://pmd.sourceforge.net/ruleset_2_0_0.xsd">

  <description>
    Apex PMD ruleset aligned to Salesforce AppExchange Security Review requirements.
    Zero violations required before security review submission.
    This ruleset is also enforced in CI on every push.
  </description>

  <!-- ═══════════════════════════════════════════
       SECURITY — Critical. Rejection guaranteed.
       ═══════════════════════════════════════════ -->

  <!-- Sharing model not declared -->
  <rule ref="category/apex/security.xml/ApexSharingViolations">
    <priority>1</priority>
  </rule>

  <!-- SOQL injection via string concatenation -->
  <rule ref="category/apex/security.xml/ApexSOQLInjection">
    <priority>1</priority>
  </rule>

  <!-- XSS from URL parameters -->
  <rule ref="category/apex/security.xml/ApexXSSFromURLParam">
    <priority>1</priority>
  </rule>

  <!-- XSS from escape-unsafe methods -->
  <rule ref="category/apex/security.xml/ApexXSSFromEscapeFalse">
    <priority>1</priority>
  </rule>

  <!-- CRUD/FLS violations -->
  <rule ref="category/apex/security.xml/ApexCRUDViolation">
    <priority>1</priority>
  </rule>

  <!-- Open redirect vulnerability -->
  <rule ref="category/apex/security.xml/ApexOpenRedirect">
    <priority>1</priority>
  </rule>

  <!-- HTTP callout (not HTTPS) -->
  <rule ref="category/apex/security.xml/ApexInsecureEndpoint">
    <priority>1</priority>
  </rule>

  <!-- Dangerous permissions in Apex -->
  <rule ref="category/apex/security.xml/ApexDangerousMethods">
    <priority>1</priority>
  </rule>

  <!-- ═══════════════════════════════════════════
       PERFORMANCE — Flagged in security review.
       ═══════════════════════════════════════════ -->

  <!-- SOQL inside for loop (governor limit risk) -->
  <rule ref="category/apex/performance.xml/AvoidSoqlInLoops">
    <priority>1</priority>
  </rule>

  <!-- DML inside for loop -->
  <rule ref="category/apex/performance.xml/AvoidDmlStatementsInLoops">
    <priority>1</priority>
  </rule>

  <!-- SOSL inside for loop -->
  <rule ref="category/apex/performance.xml/AvoidSoslInLoops">
    <priority>1</priority>
  </rule>

  <!-- ═══════════════════════════════════════════
       ERROR HANDLING — Required for good review.
       ═══════════════════════════════════════════ -->

  <!-- Empty catch blocks -->
  <rule ref="category/apex/errorprone.xml/EmptyCatchBlock">
    <priority>2</priority>
  </rule>

  <!-- Hardcoded Salesforce IDs -->
  <rule ref="category/apex/errorprone.xml/AvoidHardcodingId">
    <priority>2</priority>
  </rule>

  <!-- NullPointerException risks -->
  <rule ref="category/apex/errorprone.xml/ApexCSRF">
    <priority>2</priority>
  </rule>

  <!-- ═══════════════════════════════════════════
       BEST PRACTICES — Advisory but improve score.
       ═══════════════════════════════════════════ -->

  <!-- Avoid global modifier unless required -->
  <rule ref="category/apex/bestpractices.xml/AvoidGlobalModifier">
    <priority>3</priority>
  </rule>

  <!-- System.debug should use LoggingLevel -->
  <rule ref="category/apex/bestpractices.xml/DebugsShouldUseLoggingLevel">
    <priority>3</priority>
  </rule>

  <!-- Unused local variables -->
  <rule ref="category/apex/bestpractices.xml/UnusedLocalVariable">
    <priority>3</priority>
  </rule>

</ruleset>
```

---

## Appendix B — Required Documentation Templates

### Privacy Policy outline

Host at `https://ohanafy.com/field/privacy`. Minimum required sections:

1. **What information we collect** — Salesforce authentication tokens (stored on device), usage analytics (PostHog — events only, no PII), crash reports (Sentry — stack traces, device info, no PII), account/order/visit data from the customer's Salesforce org
2. **How we use information** — App functionality, crash diagnostics, product improvement
3. **Data storage** — Customer business data stays in the customer's Salesforce org; device data stays on the device; no Ohanafy-operated databases store customer data
4. **Data sharing** — Sentry (crash reports), PostHog (analytics), Anthropic (AI features — visit context only, no PII), Labelary (ZPL preview — label templates only)
5. **Data retention** — Salesforce org data governed by Ohanafy master subscription agreement; device data cleared on uninstall
6. **User rights** — How customers can request data deletion; contact email
7. **Changes to this policy** — How customers are notified
8. **Contact** — privacy@ohanafy.com

### Third-party service disclosure (for Security Review submission)

```markdown
# Ohanafy Field — Third-Party Service Disclosure

## Services called from the managed package (Apex)
None. The managed package makes no external callouts.

## Services called from the mobile application
| Service | URL | Purpose | Data sent | Auth |
|---|---|---|---|---|
| Anthropic Claude API | https://api.anthropic.com | AI features | Voice transcript (≤500 chars), account context (no PII) | API key in SecureStore |
| Labelary | https://api.labelary.com | ZPL label preview | ZPL template string only | None |
| Sentry | https://sentry.io | Crash reporting | Stack traces, device OS version, app version. No customer data, no PII. | DSN key |
| PostHog | https://app.posthog.com | Product analytics | Usage events (button taps, feature usage). No customer data, no PII. | API key |

## Data handling for AI features
When a rep uses voice commands or requests an AI insight:
- The account context (account name, days since last order, last visit note) is included in the API call
- The account name is included to provide accurate AI responses
- No consumer PII (individual customer names, payment data) is included
- Transcripts are not stored by Anthropic beyond the API call (per Anthropic's enterprise data handling policy)
- Ohanafy does not store voice transcripts on any server; the raw transcript is stored only in the rep's local WatermelonDB
```
