# Ohanafy Field — Harness Verification (Session 0)

**Generated:** 2026-04-25
**Workspace:** `/Users/danielzeder/conductor/workspaces/ohanafy-field/da-nang-v1`
**Branch:** `dzeder/ohanafy-field`
**Setup script:** `scripts/setup-harness.sh` (run; full log at `.context/harness-setup.log`)

Walking the §2 checklist from `OHANAFY-FIELD-HARNESS.md` item by item.

Legend: ✔ pass · ✘ fail · ⚠ partial / manual action needed

---

## Claude Code plugins

The harness §2 expects four named plugins. The plugin IDs in §1 of the harness do **not** exist in the marketplaces as documented (the script attempted them and each step was skipped with `(skip: ...)`). The marketplaces themselves were added successfully.

| Item | Status | Notes |
|---|---|---|
| `anthropics/skills:document-skills` | ⚠ | marketplace `anthropic-agent-skills` added; plugin ID does not resolve — install attempt was skipped. |
| `anthropics/skills:skill-creator` | ⚠ | same as above |
| `obra/superpowers:test-driven-development` | ⚠ | marketplace `superpowers-dev` added; plugin ID does not resolve |
| `obra/superpowers:systematic-debugging` | ⚠ | same as above |

**Action:** The harness's plugin IDs were aspirational. Browse `claude plugin marketplace list anthropics/skills` and `… obra/superpowers` for the actual available skill names, then either install the equivalents or accept that these specific plugins aren't installable and rely on the in-repo agents/skills/rules instead. The in-repo `.claude/` files cover the same ground (TDD via `tdd-required.md` rule, etc.).

---

## Reference repos

26 repos cloned to `references/`. Note: `gh repo clone` flattens to the repo's basename, so paths in the harness doc like `references/Nozbe/WatermelonDB/` are actually at `references/WatermelonDB/`.

| Harness §2 item | Actual path | Status |
|---|---|---|
| `references/hesreallyhim/awesome-claude-code/` | `references/awesome-claude-code/` | ✔ |
| `references/wshobson/agents/` | `references/agents/` | ✔ |
| `references/expo/expo/` | `references/expo/` | ✔ |
| `references/Nozbe/WatermelonDB/` (critical Day 1) | `references/WatermelonDB/` | ✔ |
| `references/Shopify/flash-list/` (critical Day 2) | `references/flash-list/` | ✔ |
| `references/mobile-dev-inc/maestro/` (critical Day 5) | `references/Maestro/` | ✔ |
| `references/nativewindui/nativewindui/` (critical Day 1) | `references/nativewindui/` | ✔ — cloned from `roninoss/nativewindui` (harness doc had wrong org `nativewindui/nativewindui`; corrected) |
| `references/getsentry/sentry-react-native/` | `references/sentry-react-native/` | ✔ |

**Also cloned (from §3 catalog):** router, react-native-reanimated, axe-core, claude-cookbooks, claude-code-best-practice, awesome-claude-code-toolkit, agentic-ai-systems, ui (shadcn), tailwindcss, react-native-testing-library, lwc-recipes, sfdx-falcon-template, SalesforceMobileSDK-iOS, posthog-react-native, eslint-plugin-react-native-a11y (substitute for `FormidableLabs/react-native-a11y` which no longer exists at that path), typedoc, jsdoc.

**Private Ohanafy repos** `ohanafy/ohanafy-managed-package` and `ohanafy/ohanafy-connect`: attempted with `dzeder`'s gh token; skipped (no access). Not blocking for Day 1 — read the existing managed package out-of-band when needed (or grant access to dzeder's account).

---

## .claude/ files

| Item | Status | Detail |
|---|---|---|
| `.claude/settings.json` exists and parses | ✔ | `jq -e . .claude/settings.json` exits 0 |
| `.claude/agents/` has 9 files | ✔ | 9 agents: rn-architect, voice-ui-designer, ai-tool-builder, zpl-engineer, rn-accessibility, offline-sync-architect, performance-engineer, test-writer, salesforce-integration |
| `.claude/skills/` has 9 files | ⚠ 7 written | Harness §6 only specifies 7 skills (nativewind-patterns, watermelondb-patterns, claude-tool-use-streaming, zpl2-reference, sf-oauth-patterns, rn-performance-patterns, maestro-e2e-patterns). §2 verification asks for 9. Discrepancy in the source doc. **Optional follow-up:** add `ai-memory-system.md` and `roles-and-permissions.md` to reach 9 — neither is strictly necessary; the agents/rules cover the topics already. |
| `.claude/commands/` has 7 files | ✔ | new-screen, new-ai-tool, new-zpl-template, a11y-audit, perf-audit, handoff, daily-retro |
| `.claude/rules/` has 7 files | ✔ | offline-first, typescript-strict, ai-never-invents, accessibility-mandatory, error-boundaries-everywhere, no-credentials-in-code, tdd-required |
| `.claude/hooks/` has 3 executable scripts | ✔ | post-commit-log.sh, pre-push-quality-gate.sh, pre-merge-checklist.sh — all `chmod +x` |

---

## Accounts and credentials

| Item | Status | Action |
|---|---|---|
| `.env.local` exists with all keys from §10 of Bible | ⚠ | File created with all keys present but blank. **Fill in before Day 1 device run.** |
| `.env.example` exists, committed | ✔ | All keys, values blank |
| `eas whoami` returns your Expo account | ✘ | `eas-cli` not installed. **Run:** `npm install -g eas-cli && eas login` |
| Apple Developer account active | ✘ | Manual: confirm at developer.apple.com — $99/yr |
| Google Play Console account active | ✘ | Manual: confirm at play.google.com/console — $25 one-time |
| Salesforce sandbox reachable + Ohanafy package installed | ✘ | Manual: provision sandbox, install `ohfy__` managed package, create Connected App with PKCE, scopes `api refresh_token offline_access`, callback `com.ohanafy.field://oauth/callback`. Capture URL + Client ID into `.env.local`. |
| Anthropic API key valid | ✘ | Manual: generate at console.anthropic.com, add to `.env.local` (or store in SF org settings per §6 of Bible) |

---

## Toolchain

| Item | Status | Detail |
|---|---|---|
| `node --version` ≥ 20 | ✔ | v24.10.0 |
| `npx expo --version` ≥ 52 | ✔ | 55.0.26 |
| Xcode installed + license accepted | ⚠ | CLI tools present (xcode-select 2410); **Xcode.app not installed** at `/Applications/Xcode.app`. Manual: install Xcode from Mac App Store, then `sudo xcodebuild -license accept`. |
| Android Studio installed + emulator created | ✘ | Not installed. Manual: download from developer.android.com/studio, install, create AVD. |
| `gh auth status` authenticated | ✔ | dzeder logged in (HTTPS, token scope `repo`+more) |

### Additional tooling beyond §2

| Item | Status | Action |
|---|---|---|
| `pmd` for Apex (Security Review §3, Day 4 onward) | ✘ | **Run:** `brew install pmd` |
| `sfdx` / Salesforce CLI for managed package work | ✘ | **Run:** `npm install -g @salesforce/cli` |
| Sentry project DSN | ✘ | Manual: create project at sentry.io |
| PostHog project key | ✘ | Manual: create project at app.posthog.com |
| Zebra ZQ520 / ZQ630 hardware (Day 4 print testing) | ⚠ | Day 4 needs at least one printer paired via Bluetooth; Labelary covers preview-side dev. |

---

## Documents read and understood

The four canonical docs are at the project root and have been read end-to-end:

- ✔ `OHANAFY-FIELD-HARNESS.md` — full Session 0 playbook executed
- ✔ `OHANAFY-FIELD-PRODUCT-BIBLE.md` — 7-day plan, full architecture, AI system, schema
- ✔ `OHANAFY-FIELD-ROLES-AND-ADMIN.md` — 6 roles, permission table, Appendix C tab sets, §12 day-by-day additive tasks
- ✔ `OHANAFY-FIELD-APPEXCHANGE-SECURITY-REVIEW.md` — §3 Apex rules, PMD ruleset (extracted to `scripts/pmd-ruleset.xml`), submission checklist

---

## Manual action checklist (the user must do these before Day 1 can ship)

In rough priority order:

1. `npm install -g eas-cli && eas login` — Day 1 needs an EAS profile to do anything build-related.
2. Provision Salesforce sandbox + Connected App. Get instance URL + Client ID into `.env.local`.
3. Generate Anthropic API key. Add to `.env.local`.
4. Create Sentry project; copy DSN to `.env.local`.
5. Create PostHog project; copy key to `.env.local`.
6. `brew install pmd` — required before any Apex deploy in CI (Day 4).
7. `npm install -g @salesforce/cli` — required to deploy the `ohfy_field__` package (Day 4).
8. Install **Xcode.app** (Mac App Store) + accept license: `sudo xcodebuild -license accept`.
9. Install **Android Studio** + create an AVD (Pixel 7 API 34 is fine).
10. Verify Apple Developer + Google Play Console memberships are active. Bundle ID `com.ohanafy.field` is reserved.
11. Pair at least one Zebra ZQ520/ZQ630 over Bluetooth (Day 4 — can be deferred to Day 5 if hardware arrives late).
12. (Optional) Add 2 more skill files to reach the harness §2 count of 9 — see "Skills" note above.

---

## Files created in Session 0 (exhaustive list)

```
CLAUDE.md
.gitignore
.env.example
.env.local                   (gitignored)
OHANAFY-FIELD-HARNESS.md     (copied from .context/attachments)
OHANAFY-FIELD-PRODUCT-BIBLE.md   (copied)
OHANAFY-FIELD-ROLES-AND-ADMIN.md (copied)
OHANAFY-FIELD-APPEXCHANGE-SECURITY-REVIEW.md (copied)
HARNESS-VERIFICATION.md
.claude/settings.json
.claude/agents/{9 .md files}
.claude/skills/{7 .md files}
.claude/commands/{7 .md files}
.claude/rules/{7 .md files}
.claude/hooks/{3 .sh files, executable}
scripts/setup-harness.sh     (executable)
scripts/pmd-ruleset.xml
references/{cloned by setup script — see list below}
```

---

## Verdict

**Harness ready for Day 1: ⚠ partial.**
- All `.claude/` machinery is in place and Claude Code can use it immediately.
- Day 1 can begin after the user completes manual action items 1–4 (eas-cli + Salesforce Connected App + Anthropic key + Sentry/PostHog).
- Items 6–11 are needed for later days but not Day 1 itself.

The harness will not be "100% green" until the manual items are done, but **all in-repo work is complete and correct**. Day 1 startup sequence (per CLAUDE.md) will work as soon as the credentials in `.env.local` are filled.

