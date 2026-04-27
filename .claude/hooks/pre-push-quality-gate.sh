#!/usr/bin/env bash
# Blocks push if quality gates fail

set -e
echo "→ Running pre-push quality gate..."

# 1. TypeScript check
echo "   Checking TypeScript..."
npx tsc --noEmit || {
  echo "❌ TypeScript errors found. Fix before pushing."
  exit 1
}

# 2. Lint check
echo "   Checking lint..."
npx eslint src/ app/ --ext .ts,.tsx --max-warnings 0 || {
  echo "❌ ESLint warnings/errors found. Fix before pushing."
  exit 1
}

# 3. Test check (fast — no coverage on push, only in CI)
echo "   Running tests..."
npx jest --passWithNoTests --bail 1 || {
  echo "❌ Tests failing. Fix before pushing."
  exit 1
}

# 4. Credential scan (simple)
echo "   Scanning for credentials..."
if git diff HEAD~1..HEAD --name-only | xargs grep -l "sk-ant-\|00D[A-Z0-9]\{15\}" 2>/dev/null; then
  echo "❌ Possible credential in diff. Check and remove before pushing."
  exit 1
fi

echo "✅ Quality gate passed. Pushing."
