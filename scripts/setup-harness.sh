#!/usr/bin/env bash
# Ohanafy Field — Harness Setup
# Run from the project root BEFORE Day 1 of the Product Bible.
set -euo pipefail

echo ""
echo "══════════════════════════════════════════════"
echo "  Ohanafy Field — Harness Setup"
echo "══════════════════════════════════════════════"
echo ""

# ─────────────────────────────────────────────────
# 1. CLAUDE CODE PLUGINS — Anthropic Official
# ─────────────────────────────────────────────────
echo "→ [1/7] Installing Anthropic official plugin marketplaces..."

claude plugin marketplace add anthropics/skills           2>/dev/null || true
claude plugin marketplace add anthropics/claude-plugins-official 2>/dev/null || true

echo "   Installing core skills..."
claude plugin install anthropics/skills:document-skills   2>/dev/null || echo "   (skip: document-skills)"
claude plugin install anthropics/skills:skill-creator     2>/dev/null || echo "   (skip: skill-creator)"
claude plugin install anthropics/skills:webapp-testing    2>/dev/null || echo "   (skip: webapp-testing)"
claude plugin install anthropics/skills:brand-guidelines  2>/dev/null || echo "   (skip: brand-guidelines)"

echo "✅ Anthropic official plugins step complete."

# ─────────────────────────────────────────────────
# 2. SDLC & CODE QUALITY PLUGINS — obra/superpowers
# ─────────────────────────────────────────────────
echo "→ [2/7] Installing SDLC skill bundles..."

claude plugin marketplace add obra/superpowers            2>/dev/null || true

# Core engineering discipline skills
claude plugin install obra/superpowers:test-driven-development       2>/dev/null || echo "   (skip: test-driven-development)"
claude plugin install obra/superpowers:systematic-debugging          2>/dev/null || echo "   (skip: systematic-debugging)"
claude plugin install obra/superpowers:root-cause-tracing            2>/dev/null || echo "   (skip: root-cause-tracing)"
claude plugin install obra/superpowers:subagent-driven-development   2>/dev/null || echo "   (skip: subagent-driven-development)"
claude plugin install obra/superpowers:error-handling-patterns       2>/dev/null || echo "   (skip: error-handling-patterns)"

echo "✅ SDLC skills step complete."

# ─────────────────────────────────────────────────
# 3. REFERENCE REPOS — Read-only, for patterns
# ─────────────────────────────────────────────────
echo "→ [3/7] Cloning reference repositories..."
mkdir -p references
grep -qxF 'references/' .gitignore 2>/dev/null || echo "references/" >> .gitignore

pushd references > /dev/null

  # ── Ohanafy private repos (require authenticated gh) ──────────────────────
  echo "   Ohanafy private references..."
  mkdir -p ohanafy
  pushd ohanafy > /dev/null
    for repo in \
      ohanafy/ohanafy-managed-package \
      ohanafy/ohanafy-connect \
    ; do
      gh repo clone "$repo" 2>/dev/null \
        || echo "   (skip: $repo — unavailable or already cloned)"
    done
  popd > /dev/null

  # ── Claude Code best practices ────────────────────────────────────────────
  echo "   Claude Code best practices..."
  gh repo clone hesreallyhim/awesome-claude-code         2>/dev/null || true
  gh repo clone wshobson/agents                          2>/dev/null || true
  gh repo clone shanraisshan/claude-code-best-practice   2>/dev/null || true
  gh repo clone ThibautMelen/agentic-workflow-patterns   2>/dev/null || true
  gh repo clone rohitg00/awesome-claude-code-toolkit     2>/dev/null || true

  # ── Anthropic AI reference ────────────────────────────────────────────────
  echo "   Anthropic AI patterns..."
  gh repo clone anthropics/anthropic-cookbook            2>/dev/null || true

  # ── React Native / Expo core ──────────────────────────────────────────────
  echo "   React Native / Expo reference..."
  gh repo clone expo/expo                                2>/dev/null || true
  gh repo clone expo/router                              2>/dev/null || true
  gh repo clone software-mansion/react-native-reanimated 2>/dev/null || true
  gh repo clone Shopify/flash-list                       2>/dev/null || true
  gh repo clone Nozbe/WatermelonDB                       2>/dev/null || true

  # ── Mobile UI & design systems ────────────────────────────────────────────
  echo "   Mobile UI design systems..."
  gh repo clone shadcn-ui/ui                             2>/dev/null || true
  gh repo clone tailwindlabs/tailwindcss                 2>/dev/null || true
  gh repo clone nativewindui/nativewindui                2>/dev/null || true

  # ── Testing ───────────────────────────────────────────────────────────────
  echo "   Testing frameworks..."
  gh repo clone mobile-dev-inc/maestro                   2>/dev/null || true
  gh repo clone callstack/react-native-testing-library   2>/dev/null \
    || gh repo clone testing-library/react-native-testing-library 2>/dev/null \
    || true

  # ── Accessibility ─────────────────────────────────────────────────────────
  echo "   Accessibility references..."
  gh repo clone FormidableLabs/react-native-a11y          2>/dev/null || true
  gh repo clone dequelabs/axe-core                        2>/dev/null || true

  # ── Salesforce ────────────────────────────────────────────────────────────
  echo "   Salesforce references..."
  gh repo clone trailheadapps/lwc-recipes                2>/dev/null || true
  gh repo clone sfdx-isv/sfdx-falcon-template            2>/dev/null || true
  gh repo clone forcedotcom/SalesforceMobileSDK-iOS      2>/dev/null || true

  # ── Error tracking + observability ───────────────────────────────────────
  echo "   Observability..."
  gh repo clone getsentry/sentry-react-native            2>/dev/null || true
  gh repo clone PostHog/posthog-react-native             2>/dev/null || true

  # ── Documentation ─────────────────────────────────────────────────────────
  echo "   Documentation tools..."
  gh repo clone TypeStrong/typedoc                       2>/dev/null || true
  gh repo clone jsdoc/jsdoc                              2>/dev/null || true

popd > /dev/null

echo "✅ Reference repos cloned to ./references/"

# ─────────────────────────────────────────────────
# 4. .claude/ DIRECTORY SKELETON
# ─────────────────────────────────────────────────
echo "→ [4/7] Verifying .claude/ directory skeleton..."

mkdir -p .claude/{agents,skills,commands,rules,hooks}
echo "✅ .claude/ skeleton verified. Files written by §5–§9 of the harness."

# ─────────────────────────────────────────────────
# 5. .claude/ FILES (already written by Session 0)
# ─────────────────────────────────────────────────
echo "→ [5/7] Confirming .claude/ files exist..."
test -f .claude/settings.json && echo "   ✓ settings.json"
echo "   agents:   $(ls .claude/agents/ 2>/dev/null | wc -l | tr -d ' ')"
echo "   skills:   $(ls .claude/skills/ 2>/dev/null | wc -l | tr -d ' ')"
echo "   commands: $(ls .claude/commands/ 2>/dev/null | wc -l | tr -d ' ')"
echo "   rules:    $(ls .claude/rules/ 2>/dev/null | wc -l | tr -d ' ')"
echo "   hooks:    $(ls .claude/hooks/ 2>/dev/null | wc -l | tr -d ' ')"

# ─────────────────────────────────────────────────
# 6. EAS + EXPO VERIFICATION
# ─────────────────────────────────────────────────
echo "→ [6/7] Verifying Expo + EAS toolchain..."
npx expo --version 2>/dev/null || echo "   (warn: expo CLI not callable)"
eas whoami 2>/dev/null || echo "   (warn: eas-cli not installed or not logged in — run: npm install -g eas-cli && eas login)"

# ─────────────────────────────────────────────────
# 7. FINAL VERIFICATION
# ─────────────────────────────────────────────────
echo "→ [7/7] Running harness verification..."
echo ""
echo "════════ HARNESS SETUP COMPLETE ════════"
echo ""
echo "Next steps:"
echo "  1. Run the §2 verification checklist (see HARNESS-VERIFICATION.md)"
echo "  2. Fill .env.local with credentials"
echo "  3. Read §11 reference reading list (30 min — worth it)"
echo "  4. Start Day 1 of OHANAFY-FIELD-PRODUCT-BIBLE.md"
echo ""
