#!/usr/bin/env bash
# Verifies a PR is ready to merge

PR_BRANCH=$(git rev-parse --abbrev-ref HEAD)

echo "═══════════════════════════════════════"
echo "  Pre-Merge Checklist: $PR_BRANCH"
echo "═══════════════════════════════════════"
echo ""

echo "Required before merge:"
echo "  [ ] TypeScript: npx tsc --noEmit → 0 errors"
echo "  [ ] Lint: npx eslint src/ app/ → 0 warnings"
echo "  [ ] Tests: npx jest --coverage → thresholds met"
echo "  [ ] New screen/component: /a11y-audit run"
echo "  [ ] New list: FlashList + estimatedItemSize"
echo "  [ ] New AI feature: FeedbackCapture component added"
echo "  [ ] New ZPL template: Labelary verified"
echo "  [ ] Dark mode: tested on both themes"
echo "  [ ] Offline: tested in airplane mode"
echo ""

# Ask for confirmation
read -p "Have you verified all items above? (y/N): " CONFIRM
if [ "$CONFIRM" != "y" ]; then
  echo "❌ Merge blocked. Complete the checklist first."
  exit 1
fi

echo "✅ Checklist confirmed. Proceeding with merge."
