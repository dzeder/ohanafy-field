#!/usr/bin/env bash
# scripts/link-env.sh
# Symlink the worktree's .env.local to a shared file under ~/.config/ohanafy-field/
# so credentials persist across Conductor worktrees / branches.
#
# Usage:
#   bash scripts/link-env.sh        # idempotent — safe to run on any worktree

set -euo pipefail

SHARED_DIR="$HOME/.config/ohanafy-field"
SHARED_ENV="$SHARED_DIR/.env.local"
LOCAL_ENV="$(pwd)/.env.local"

mkdir -p "$SHARED_DIR"
chmod 700 "$SHARED_DIR"

# First-time bootstrap
if [ ! -f "$SHARED_ENV" ]; then
  if [ -f "$LOCAL_ENV" ] && [ ! -L "$LOCAL_ENV" ]; then
    # Promote this worktree's existing .env.local to the shared location
    mv "$LOCAL_ENV" "$SHARED_ENV"
    chmod 600 "$SHARED_ENV"
    echo "✓ Promoted $LOCAL_ENV → $SHARED_ENV"
  elif [ -f .env.example ]; then
    cp .env.example "$SHARED_ENV"
    chmod 600 "$SHARED_ENV"
    echo "✓ Created $SHARED_ENV from .env.example. Fill in values before running the app."
  else
    touch "$SHARED_ENV"
    chmod 600 "$SHARED_ENV"
    echo "✓ Created empty $SHARED_ENV. Add keys per .env.example."
  fi
fi

# Link this worktree's .env.local
if [ -L "$LOCAL_ENV" ]; then
  current_target=$(readlink "$LOCAL_ENV")
  if [ "$current_target" = "$SHARED_ENV" ]; then
    echo "✓ $LOCAL_ENV already linked → $SHARED_ENV"
    exit 0
  else
    echo "⚠  $LOCAL_ENV is a symlink pointing at $current_target — replacing with link to $SHARED_ENV"
    rm "$LOCAL_ENV"
  fi
elif [ -f "$LOCAL_ENV" ]; then
  echo "⚠  $LOCAL_ENV is a real file (not a symlink). Move or remove it manually first, then re-run." >&2
  exit 1
fi

ln -s "$SHARED_ENV" "$LOCAL_ENV"
echo "✓ Linked $LOCAL_ENV → $SHARED_ENV"
echo ""
echo "  Edit this file from any worktree:"
echo "  $SHARED_ENV"
