#!/usr/bin/env bash
# Appends significant commits to a daily log for retro and handoff

COMMIT_MSG=$(git log -1 --pretty=%B)
COMMIT_HASH=$(git log -1 --pretty=%h)
TIMESTAMP=$(date '+%H:%M')
BRANCH=$(git rev-parse --abbrev-ref HEAD)

# Only log feat:, fix:, test:, a11y:, perf:, and docs: commits
if echo "$COMMIT_MSG" | grep -qE "^(feat|fix|test|a11y|perf|docs|refactor)\("; then
  LOG_FILE="DAILY_LOG_$(date '+%Y-%m-%d').md"

  if [ ! -f "$LOG_FILE" ]; then
    echo "# Daily Log — $(date '+%B %d, %Y')" > "$LOG_FILE"
    echo "" >> "$LOG_FILE"
  fi

  echo "- [$TIMESTAMP] \`$COMMIT_HASH\` — $COMMIT_MSG" >> "$LOG_FILE"
fi
