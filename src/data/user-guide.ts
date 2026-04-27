// User Guide content — sourced from OHANAFY-FIELD-PRODUCT-BIBLE.md Appendix F.
// Bundled into the app build so it's offline by default. Searchable via the
// Guide screen.

export interface GuideSection {
  id: string;
  title: string;
  body: string;
}

export const GUIDE_SECTIONS: GuideSection[] = [
  {
    id: 'getting-started',
    title: '1. Getting Started',
    body: `Setting up Ohanafy Field takes about 5 minutes. After downloading the app:

1. Sign in with Salesforce. Tap "Sign in with Salesforce" and log in with your Ohanafy credentials. Ohanafy Field connects to your Salesforce org to load your territory.

2. Let the app sync. On first launch, Ohanafy Field downloads your accounts, products, and order history. This takes 30 to 60 seconds on a good connection. After that, everything is available offline.

3. Pair your Zebra printer. If you have a Zebra ZQ520 or ZQ630 printer, go to Settings → Printers to pair it. You can also do this during onboarding. The app works without a printer — you just won't be able to print labels.

4. Enable Face ID / Touch ID. When prompted, allow biometric unlock. This lets you open the app with one glance instead of typing your PIN each time.

After setup, your account list will be on the home screen, sorted alphabetically. Accounts needing attention (not visited in 21+ days) are highlighted and can be filtered with the Needs Attention button.`,
  },
  {
    id: 'account-visits',
    title: '2. Account Visits',
    body: `Before you walk in:
Open the account from your list. Ohanafy Field shows you an AI insight at the top of the account screen — the most important thing to know before you knock. This might be a stale reorder, a flagged issue from your last visit, or a selling opportunity.

Tap thumbs-up if the insight was helpful. Tap thumbs-down if it wasn't. This feedback helps the AI learn what matters to you and your accounts.

During the visit:
- Use the Voice button (microphone icon, bottom right) to log notes and orders hands-free.
- The Visit History section shows your last 3 visits with notes.
- The Last Order summary shows the last placed order and its status.

After the visit:
Tap "Log Visit" to save the visit to Ohanafy Field. You can add or edit your notes before saving. If you're offline, the visit is saved locally and syncs when you get signal.`,
  },
  {
    id: 'taking-orders',
    title: '3. Taking Orders',
    body: `Tap "New Order" from the account detail screen to open the order entry screen.

Adding items:
- Browse products by category (Beer Kegs / Beer Cases / Energy / Other).
- Tap a product to add it; use the +/- stepper to change quantity.
- Swipe left on a line item to remove it.
- The order total updates automatically.

Using voice to order:
Tap the mic button and speak naturally. For example: "Add 2 kegs Pale Ale", "Put a case of Modelo on the order", "Three Red Bull Sugarfrees".

The AI will show you what it understood. Tap Accept to add it, Edit to change it, or Reject to start over.

Confirming the order:
Tap "Confirm Order" to review the full order. Add a delivery date and any notes, then tap "Place Order." If you're offline, the order is saved locally (shown as "Pending Sync") and submitted to Salesforce when you reconnect.`,
  },
  {
    id: 'voice-commands',
    title: '4. Voice Commands',
    body: `Ohanafy Field understands natural speech. You don't need to use specific phrases — speak the way you normally would.

Order commands:
- "Add [quantity] [product]" — adds to current order
- "Put [quantity] [product] on the order" — same
- "Remove the [product]" — removes from order
- "Change the [product] to [quantity]" — updates quantity

Note commands:
- "Note [text]" — logs a visit note
- "Log that [text]" — same
- "Remember [text]" — same

Tips for better accuracy:
- Speak clearly and at a normal pace — the app handles natural speech.
- If the AI gets a product name wrong, tap Edit and correct it; the AI learns from your corrections over time.`,
  },
  {
    id: 'label-printing',
    title: '5. Label Printing',
    body: `Ohanafy Field can print shelf talkers, product cards, and delivery receipts directly to your Zebra ZQ520 or ZQ630.

Before printing:
- Your Zebra printer must be paired via Bluetooth (Settings → Printers).
- Load the correct label stock (see your label type's size below).
- The printer must be powered on and within Bluetooth range (~30 feet).

Printing a shelf talker:
1. From an account detail or order screen, tap "Print Label".
2. Select "Shelf Talker".
3. Choose the product.
4. Tap the preview to verify the label looks correct.
5. Tap "Print".

The shelf talker prints in seconds. Hand it to the buyer while you're still in the store.

Label sizes:
- Shelf talker: 2.5" × 1.5" — Zebra ZP #10010044 or equivalent
- Product card: 4" × 3" — Zebra #800274-605 or equivalent
- Delivery receipt: 4" × 6" — Zebra #800274-607 or equivalent

If the printer won't connect:
1. Make sure Bluetooth is enabled on your phone.
2. Make sure the printer is powered on (green status light).
3. Try "Forget Printer" and re-pair in Settings → Printers.
4. Check that the label stock is loaded correctly (media sensing light should be off).`,
  },
  {
    id: 'ai-features',
    title: '6. AI Features',
    body: `Ohanafy Field's AI gets smarter the more you use it. Here's how it works.

AI visit prep: Before each visit, the AI analyzes your account's order history and visit notes to surface one key insight. This is not a generic tip — it's specific to this account's data.

AI voice commands: When you speak, the AI interprets your words into app actions. It understands products by partial name, common abbreviations, and context.

How the AI learns:
Every time you accept, edit, or reject an AI suggestion, the app learns. After several corrections:
- The AI gets better at recognizing your product shorthand.
- Account-specific patterns are remembered (e.g., The Rail always orders in pairs).
- Your note style is learned over time.

Reviewing your AI memories:
Go to Settings → AI Memory to see what the AI has learned. You can edit or delete any memory. Memories are saved to Salesforce, so they're available on any device you use.

A badge that says "customer-calibrated" on an AI insight means the AI used past corrections and feedback from your visits to this specific account — the insight is more personalized than the default.`,
  },
  {
    id: 'troubleshooting',
    title: '7. Troubleshooting',
    body: `The app won't sync:
- Check that you have signal (the offline banner will say "Offline" if not).
- Tap "Sync Now" in Settings to manually trigger a sync.
- Check Settings → Sync Status for any failed items.
- If items show "Failed after 3 attempts", contact support with the error details.

Voice commands are inaccurate:
- Speak clearly and at a normal pace.
- Try moving to a quieter location.
- If a specific product name is consistently misheard, use Edit to correct it — the AI will learn the correct mapping after 2 to 3 corrections.
- As a last resort, add items manually using the product search.

Printer won't print:
- Check Bluetooth is on and the printer is powered and within range.
- Check the printer has label stock loaded.
- Try a calibration print from the printer menu (hold the feed button).
- Re-pair the printer in Settings → Printers.

An order shows "Sync Failed":
- This usually means a Salesforce session issue. Go to Settings → Account and tap "Refresh Connection".
- If the error persists, export the order as a PDF (tap the order → Share) and enter it manually as a backup.

Contacting support:
Email support@ohanafy.com. Tap "Contact Support" in Settings for a pre-filled email with your device info and app version.`,
  },
];

export interface SearchHit {
  section: GuideSection;
  matches: string[];
}

export function searchGuide(query: string): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (q.length === 0) return [];
  const hits: SearchHit[] = [];
  for (const section of GUIDE_SECTIONS) {
    const matches: string[] = [];
    const titleHit = section.title.toLowerCase().includes(q);
    if (titleHit) matches.push(section.title);
    for (const line of section.body.split('\n')) {
      if (line.toLowerCase().includes(q) && line.trim().length > 0) {
        matches.push(line.trim());
        if (matches.length >= 3) break;
      }
    }
    if (matches.length > 0) hits.push({ section, matches });
  }
  return hits;
}
