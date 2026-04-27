---
name: a11y-audit
description: Runs an accessibility audit on a screen or component. Checks VoiceOver/TalkBack compliance, tap target sizes, Dynamic Type support, and color contrast. Usage: /a11y-audit [screen-or-component-path]
---

For the specified file, audit:

1. **Interactive elements** — every TouchableOpacity/Pressable/Button has:
   - `accessibilityRole`
   - `accessibilityLabel` (no "tap to" — just what it is)
   - `accessibilityHint` (what happens)
   - `accessibilityState` if disabled or selected

2. **Tap targets** — every interactive element:
   - Minimum 44×44pt (use `hitSlop` if smaller)
   - Report all elements that may be too small

3. **Images** — every Image has:
   - `accessibilityLabel` if meaningful
   - `accessible={false}` if decorative

4. **Lists** — every FlashList/FlatList:
   - Has `accessibilityLabel` with item count
   - Items announce their key information

5. **Dynamic Type** — no fixed heights on Text containers, `allowFontScaling` not false

6. **Loading/error states** — have `accessibilityLiveRegion="polite"`

7. **Custom actions** — swipe-to-delete has keyboard/screen reader alternative

Report: a numbered list of violations with file:line and the fix. Severity: high/medium/low.
