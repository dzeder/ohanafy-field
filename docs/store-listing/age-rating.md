# Age Rating Questionnaire — Both Stores

Target rating: **Apple 4+ / Google IARC: Everyone**.

Ohanafy Field is a B2B field-sales tool. It does not contain consumer-facing content of any kind — no user-generated public feed, no advertising, no purchasing, no chat. The only "content" is business data the user pulls from their own Salesforce org.

## Apple App Store — Age Rating

In App Store Connect → App Privacy → App Information → Age Rating, answer **None** to every category:

| Category | Answer |
|---|---|
| Cartoon or Fantasy Violence | None |
| Realistic Violence | None |
| Prolonged Graphic or Sadistic Realistic Violence | None |
| Profanity or Crude Humor | None |
| Mature/Suggestive Themes | None |
| Horror/Fear Themes | None |
| Medical/Treatment Information | None |
| Alcohol, Tobacco, or Drug Use or References | **Infrequent/Mild** *(see note)* |
| Simulated Gambling | None |
| Sexual Content or Nudity | None |
| Graphic Sexual Content and Nudity | None |
| Contests | None |
| Unrestricted Web Access | No |
| Gambling | No |

> **Note on Alcohol/Tobacco:** The app references beer, wine, and spirits product categories because it is a beverage-distributor sales tool. These references are professional/industry context (product names, SKUs, pricing). The app is intended for licensed B2B users only and does not promote alcohol consumption. Selecting "Infrequent/Mild" is conservative — Apple typically resolves a B2B alcohol-distributor app at 4+ given the professional context. If reviewer escalates, we accept a 17+ rating without contesting.

**Final rating expected:** 4+ (or 17+ if Apple escalates the alcohol reference; both are acceptable for B2B distribution).

### Made for Kids

**No.** The app is designed for licensed adult B2B users.

### Sign-In Required

**Yes.** Salesforce credentials required. Demo creds provided in App Review Information.

## Google Play — IARC Questionnaire

Open: Play Console → Policy → App content → Content rating → Start questionnaire.

### Category selection

Select category: **Reference, news, or educational** (B2B productivity tool — no game/social/entertainment fit).

### Reference / news / educational answers

| Question | Answer |
|---|---|
| Does the app contain or enable users to share violent content? | No |
| Does the app contain or enable users to share content depicting bullying or harassment? | No |
| Does the app contain or enable users to share sexual content? | No |
| Does the app contain or enable users to share crude humor? | No |
| Does the app reference or enable users to share content related to discrimination? | No |
| Does the app contain or enable users to share content related to drug, alcohol, or tobacco use? | **Yes — references** *(beverage product catalog)* |
| → Is the content educational, documentary, scientific, or news-related? | **Yes** (B2B inventory and order entry — professional context) |
| Does the app contain or enable users to share gambling content? | No |
| Does the app contain user-generated content? | **Yes** — visit notes and order line items, visible only to the authenticated user and their organization |
| → Is user-generated content moderated? | **Yes** — content stays within the customer's Salesforce org under the customer's own data governance |
| Does the app contain or enable real-money gambling? | No |
| Does the app share user location with other users? | No |
| Does the app allow users to interact or exchange content with other users? | No |
| Does the app allow users to purchase digital content? | No |

**Expected IARC rating:** Everyone (E) or Everyone 10+ (E10+) given the alcohol-reference + educational-context combo. Both are acceptable.

## Target Audience (Play Console)

Open: Play Console → Policy → App content → Target audience.

| Field | Answer |
|---|---|
| Target age groups | **18+** only |
| Appeals to children | **No** |
| Designed for Families program | **No** |
| Stores stops or sells alcohol-related goods | **No** (we are a tool for licensed distributors; we do not sell alcohol ourselves) |
| Restricted to 18+ | **Yes** — confirm in app description and listing |

> **Why 18+:** alcohol-product context. Even though the app does not sell, prepare, or promote consumption, the safe answer for an alcohol-adjacent B2B tool is to gate the audience to legal-drinking-age users globally.

## Apple Made for Kids

Not applicable — adult B2B tool.

## Final ratings expected

| Store | Rating | Audience |
|---|---|---|
| App Store | 4+ (best case) / 17+ (if escalated) | All / 17+ |
| Google Play | Everyone or Everyone 10+ | 18+ via target audience gate |

Both ratings are submission-acceptable.
