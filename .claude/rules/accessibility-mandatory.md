# Rule: Accessibility Is Mandatory

**Scope:** All .tsx component files

Accessibility is part of the definition of done — not a post-launch task.

Every PR that adds a new interactive element must include:
- `accessibilityRole`
- `accessibilityLabel`
- `accessibilityHint` (unless the action is completely obvious from the label)

Every PR that adds a new list must include:
- `accessibilityLabel` with item count on the FlashList

Every PR that adds a loading state must include:
- `accessibilityLiveRegion="polite"` so screen readers announce when content loads

**The test:** Run `/a11y-audit [changed file]` before marking any component PR as done.
