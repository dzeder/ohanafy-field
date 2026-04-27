# Ohanafy Field — Harness Setup Guide
## Run This Before Day 1 of the Product Bible

> **What this is:** The complete pre-build harness for Ohanafy Field. Installs Claude Code skills, clones all reference repositories, and writes every file in `.claude/` — agents, skills, commands, rules, hooks — so that Claude Code starts Day 1 with expert context across every domain it will touch.
>
> **When to run:** Night before Day 1. Budget 45–60 minutes. The harness pays back 10× over the week.
>
> **How Claude Code uses this:** *"Read OHANAFY-FIELD-HARNESS.md. Run §1 setup script. Confirm §2 checklist passes. Then you are ready to start Day 1 of OHANAFY-FIELD-PRODUCT-BIBLE.md."*

---

## Table of Contents

- [§1 — Master Setup Script](#1--master-setup-script)
- [§2 — Setup Verification Checklist](#2--setup-verification-checklist)
- [§3 — Reference Repository Catalog](#3--reference-repository-catalog)
- [§4 — `.claude/settings.json`](#4--claudesettingsjson)
- [§5 — Agent Definitions](#5--agent-definitions)
- [§6 — Skill Files](#6--skill-files)
- [§7 — Slash Commands](#7--slash-commands)
- [§8 — Rules](#8--rules)
- [§9 — Hooks](#9--hooks)
- [§10 — `CLAUDE.md` (Production Version)](#10--claudemd-production-version)
- [§11 — Reference Reading List](#11--reference-reading-list)

---

## §1 — Master Setup Script

Save as `scripts/setup-harness.sh`. Run once, tonight.

```bash
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
claude plugin install anthropics/skills:document-skills   # docx, pdf, pptx, xlsx — for user guide PDF export
claude plugin install anthropics/skills:skill-creator     # meta-skill for writing new project skills
claude plugin install anthropics/skills:webapp-testing    # Playwright + Maestro testing patterns
claude plugin install anthropics/skills:brand-guidelines  # enforces Ohanafy brand tokens across outputs

echo "✅ Anthropic official plugins installed."

# ─────────────────────────────────────────────────
# 2. SDLC & CODE QUALITY PLUGINS — obra/superpowers
# ─────────────────────────────────────────────────
echo "→ [2/7] Installing SDLC skill bundles..."

claude plugin marketplace add obra/superpowers            2>/dev/null || true

# Core engineering discipline skills
claude plugin install obra/superpowers:test-driven-development       # red-green-refactor enforcement
claude plugin install obra/superpowers:systematic-debugging          # structured debugging protocol
claude plugin install obra/superpowers:root-cause-tracing            # finds root cause before fixing symptoms
claude plugin install obra/superpowers:subagent-driven-development   # delegates to specialist subagents
claude plugin install obra/superpowers:error-handling-patterns       # consistent error handling across codebase

echo "✅ SDLC skills installed."

# ─────────────────────────────────────────────────
# 3. REFERENCE REPOS — Read-only, for patterns
# ─────────────────────────────────────────────────
echo "→ [3/7] Cloning reference repositories..."
mkdir -p references
echo "references/" >> .gitignore 2>/dev/null || true

pushd references

  # ── Ohanafy private repos (require authenticated gh) ──────────────────────
  echo "   Ohanafy private references..."
  mkdir -p ohanafy
  pushd ohanafy
    for repo in \
      ohanafy/ohanafy-managed-package \
      ohanafy/ohanafy-connect \
    ; do
      gh repo clone "$repo" 2>/dev/null \
        || echo "   (skip: $repo — unavailable or already cloned)"
    done
  popd

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
  gh repo clone expo/expo                                2>/dev/null || true   # source + examples
  gh repo clone expo/router                              2>/dev/null || true   # Expo Router v3 patterns
  gh repo clone software-mansion/react-native-reanimated 2>/dev/null || true   # animation patterns
  gh repo clone Shopify/flash-list                       2>/dev/null || true   # FlashList API + perf guide
  gh repo clone Nozbe/WatermelonDB                       2>/dev/null || true   # WDB patterns, migrations, tests

  # ── Mobile UI & design systems ────────────────────────────────────────────
  echo "   Mobile UI design systems..."
  gh repo clone shadcn-ui/ui                             2>/dev/null || true   # component patterns (NativeWind port reference)
  gh repo clone tailwindlabs/tailwindcss                 2>/dev/null || true   # Tailwind core for NativeWind
  gh repo clone nativewindui/nativewindui                2>/dev/null || true   # NativeWind v4 component examples

  # ── Testing ───────────────────────────────────────────────────────────────
  echo "   Testing frameworks..."
  gh repo clone mobile-dev-inc/maestro                   2>/dev/null || true   # Maestro E2E engine
  gh repo clone testing-library/react-native-testing-library 2>/dev/null || true

  # ── Accessibility ─────────────────────────────────────────────────────────
  echo "   Accessibility references..."
  gh repo clone FormidableLabs/react-native-a11y          2>/dev/null || true   # a11y patterns for RN
  gh repo clone dequelabs/axe-core                        2>/dev/null || true   # axe accessibility rules (patterns apply to RN)

  # ── Salesforce ────────────────────────────────────────────────────────────
  echo "   Salesforce references..."
  gh repo clone trailheadapps/lwc-recipes                2>/dev/null || true
  gh repo clone sfdx-isv/sfdx-falcon-template            2>/dev/null || true
  gh repo clone forcedotcom/SalesforceMobileSDK-iOS      2>/dev/null || true   # iOS auth patterns (reference only)

  # ── Error tracking + observability ───────────────────────────────────────
  echo "   Observability..."
  gh repo clone getsentry/sentry-react-native            2>/dev/null || true   # Sentry RN integration patterns
  gh repo clone PostHog/posthog-react-native             2>/dev/null || true   # PostHog analytics patterns

  # ── Documentation ─────────────────────────────────────────────────────────
  echo "   Documentation tools..."
  gh repo clone TypeStrong/typedoc                       2>/dev/null || true   # TypeDoc for API docs
  gh repo clone jsdoc/jsdoc                              2>/dev/null || true   # JSDoc patterns

popd

echo "✅ Reference repos cloned to ./references/"

# ─────────────────────────────────────────────────
# 4. .claude/ DIRECTORY SKELETON
# ─────────────────────────────────────────────────
echo "→ [4/7] Creating .claude/ directory skeleton..."

mkdir -p .claude/{agents,skills,commands,rules,hooks}
echo "✅ .claude/ skeleton created. Files written by §5–§9 of this script."

# ─────────────────────────────────────────────────
# 5. WRITE ALL .claude/ FILES
# (Agents, skills, commands, rules, hooks — full content)
# ─────────────────────────────────────────────────
echo "→ [5/7] Writing .claude/ agent, skill, command, rule, and hook files..."
# (Content written by §5–§9 below — run write-claude-files.sh or copy manually)
echo "   See §5–§9 of OHANAFY-FIELD-HARNESS.md for all file content."
echo "   Run: node scripts/write-claude-files.js"

# ─────────────────────────────────────────────────
# 6. EAS + EXPO VERIFICATION
# ─────────────────────────────────────────────────
echo "→ [6/7] Verifying Expo + EAS toolchain..."
npx expo --version
eas whoami
echo "✅ Expo + EAS verified."

# ─────────────────────────────────────────────────
# 7. FINAL VERIFICATION
# ─────────────────────────────────────────────────
echo "→ [7/7] Running harness verification..."
echo ""
echo "════════ HARNESS SETUP COMPLETE ════════"
echo ""
echo "Next steps:"
echo "  1. Run the §2 verification checklist"
echo "  2. Fill brand token placeholders in tailwind.config.js"
echo "  3. Read §11 reference reading list (30 min — worth it)"
echo "  4. Start Day 1 of OHANAFY-FIELD-PRODUCT-BIBLE.md"
echo ""
```

---

## §2 — Setup Verification Checklist

Run through every item before starting Day 1. Every `[ ]` must become `[x]`.

### Claude Code plugins
- [ ] `claude plugin list` shows `anthropics/skills:document-skills`
- [ ] `claude plugin list` shows `anthropics/skills:skill-creator`
- [ ] `claude plugin list` shows `obra/superpowers:test-driven-development`
- [ ] `claude plugin list` shows `obra/superpowers:systematic-debugging`

### Reference repos
- [ ] `references/hesreallyhim/awesome-claude-code/` exists and has content
- [ ] `references/wshobson/agents/` exists
- [ ] `references/expo/expo/` exists
- [ ] `references/Nozbe/WatermelonDB/` exists (critical for Day 1 schema work)
- [ ] `references/Shopify/flash-list/` exists (critical for Day 2 list performance)
- [ ] `references/mobile-dev-inc/maestro/` exists (critical for Day 5 E2E)
- [ ] `references/nativewindui/nativewindui/` exists (critical for Day 1 component scaffold)
- [ ] `references/getsentry/sentry-react-native/` exists

### .claude/ files
- [ ] `.claude/settings.json` exists and parses as valid JSON
- [ ] `.claude/agents/` has 9 agent `.md` files
- [ ] `.claude/skills/` has 9 skill `.md` files
- [ ] `.claude/commands/` has 7 command `.md` files
- [ ] `.claude/rules/` has 7 rule `.md` files
- [ ] `.claude/hooks/` has 3 hook shell scripts (all executable)

### Accounts and credentials
- [ ] `.env.local` exists with all keys from §10 of the Product Bible
- [ ] `eas whoami` returns your Expo account
- [ ] Apple Developer account active (check developer.apple.com)
- [ ] Google Play Console account active
- [ ] Salesforce sandbox reachable and Ohanafy package installed
- [ ] Anthropic API key valid (`curl` test in §1 Product Bible)

### Toolchain
- [ ] `node --version` ≥ 20
- [ ] `npx expo --version` ≥ 52
- [ ] Xcode installed and license accepted (`sudo xcodebuild -license accept`)
- [ ] Android Studio installed with emulator created
- [ ] `gh auth status` authenticated

---

## §3 — Reference Repository Catalog

Every repo below is cloned to `references/` and available for Claude Code to read. This table explains *what* to read from each and *when* it matters.

### Group A — Claude Code Meta (Read These First)

| Repo | What to read | When it matters |
|---|---|---|
| `hesreallyhim/awesome-claude-code` | `README.md` — the full curated list. Sections: CLAUDE.md examples, Hooks, Slash Commands, Skills, Agents | Day 0: shapes your `.claude/` architecture |
| `wshobson/agents` | All agent `.md` files — each is a Claude Code subagent definition. Study the front-matter schema and description patterns | Day 0: copy the agent authoring style |
| `shanraisshan/claude-code-best-practice` | `README.md` + the example slash commands + the CLAUDE.md example | Day 0: best reference for CLAUDE.md structure |
| `ThibautMelen/agentic-workflow-patterns` | The Mermaid diagrams + each pattern folder's `README` | Day 0: understand subagent orchestration before building agents |
| `rohitg00/awesome-claude-code-toolkit` | Scan the hooks folder — 20 production-ready hooks. Scan the rules folder — 15 rules to adapt | Day 0: harvest rules and hooks directly |
| `anthropics/anthropic-cookbook` | `tool_use/` folder — all tool use patterns. `multimodal/` — if voice transcription screenshots matter | Day 3 (AI tools) |

### Group B — React Native & Expo Core

| Repo | What to read | When it matters |
|---|---|---|
| `expo/expo` | `packages/expo-router/` README + `apps/router-e2e/` examples. `packages/expo-auth-session/` README. `packages/expo-secure-store/` README | Day 1 (auth + navigation) |
| `expo/router` | `docs/` — file-based routing guide. `examples/` — tab layout, auth flow, dynamic routes | Day 1 |
| `Nozbe/WatermelonDB` | `docs/` — all of it. `src/__tests__/` — test patterns. `CONTRIBUTING.md` for migration authoring | Day 1 (schema) + Day 2 (queries) |
| `software-mansion/react-native-reanimated` | `docs/fundamentals/` — shared values, worklets. `docs/animations/` — spring, timing. Examples for the voice button pulse animation | Day 3 (voice UI animations) |
| `Shopify/flash-list` | `README.md` — `estimatedItemSize` guide. `src/FlashList.tsx` — props interface. `benchmarks/` — why it's faster than FlatList | Day 2 (account list performance) |

### Group C — Mobile UI & Design

| Repo | What to read | When it matters |
|---|---|---|
| `nativewindui/nativewindui` | All component examples — especially `BottomSheet`, `ActionSheet`, `Toast`, `Modal`. The `dark:` variant patterns | Day 1–2 (component scaffold) |
| `shadcn-ui/ui` | Not the code (it's web) — read the component API designs and naming conventions as the design reference for what our NativeWind components should feel like | Day 1 (component architecture) |
| `tailwindlabs/tailwindcss` | `docs/dark-mode.md` — dark mode strategy. `docs/responsive-design.md` — breakpoint patterns adapted for `useWindowDimensions()` | Day 1 (theming) |

### Group D — Testing

| Repo | What to read | When it matters |
|---|---|---|
| `mobile-dev-inc/maestro` | `docs/` — the full YAML syntax. `samples/` — real flow examples. Offline testing section | Day 5 (E2E suite) |
| `testing-library/react-native-testing-library` | `docs/api.md` — `renderHook`, `fireEvent`, `waitFor`. `docs/queries.md` — `getByRole`, `getByLabelText` | Day 2–5 (unit tests) |

### Group E — Accessibility

| Repo | What to read | When it matters |
|---|---|---|
| `FormidableLabs/react-native-a11y` | `README.md` + the accessible component examples. Focus order patterns. | Day 6 (a11y pass) |
| `dequelabs/axe-core` | `lib/rules/` — read the rule descriptions for: `button-name`, `image-alt`, `label`, `color-contrast`. The principles translate directly to React Native | Day 6 (a11y checklist) |

### Group F — Salesforce

| Repo | What to read | When it matters |
|---|---|---|
| `trailheadapps/lwc-recipes` | The `force-app/main/default/lwc/` folder — wire adapters, custom events, pubsub patterns | Day 4 (LWC field activity feed) |
| `forcedotcom/SalesforceMobileSDK-iOS` | `libs/SalesforceSDKCore/` — OAuth PKCE flow implementation (for understanding, not copying). The token refresh pattern. | Day 1 (SF auth) |

### Group G — Observability

| Repo | What to read | When it matters |
|---|---|---|
| `getsentry/sentry-react-native` | `README.md` performance tracing section. `src/integrations/` — how to instrument screens | Day 1 (Sentry init) |
| `PostHog/posthog-react-native` | `README.md` — capture events, identify users, feature flags API | Day 1 (PostHog init) |

---

## §4 — `.claude/settings.json`

```json
{
  "$schema": "https://anthropic.com/claude-code/settings.schema.json",
  "model": "claude-opus-4-5",
  "tools": {
    "enabled": ["bash", "view", "str_replace", "create_file"]
  },
  "hooks": {
    "postCommit":  ".claude/hooks/post-commit-log.sh",
    "prePush":     ".claude/hooks/pre-push-quality-gate.sh",
    "preMerge":    ".claude/hooks/pre-merge-checklist.sh"
  },
  "contextFiles": [
    "CLAUDE.md",
    "OHANAFY-FIELD-PRODUCT-BIBLE.md"
  ],
  "ignorePatterns": [
    "references/**",
    "node_modules/**",
    ".expo/**",
    "android/**",
    "ios/**",
    "*.generated.*"
  ]
}
```

---

## §5 — Agent Definitions

Every agent file lives in `.claude/agents/`. Each has a YAML front-matter `description` that determines when Claude Code invokes it. The description is the most important field — write it to be specific and to include file patterns or trigger phrases.

### `rn-architect.md`

```markdown
---
name: rn-architect
description: Expert in React Native (Expo SDK 52), TypeScript strict mode, Expo Router v3, NativeWind v4, and WatermelonDB. Trigger when creating new screens, components, navigation structures, or the database schema. Also trigger when asked about performance, bundle size, or platform-specific behavior differences between iOS and Android.
---

You are a senior React Native architect specializing in Expo-managed workflow apps. You have deep expertise in:

**Navigation:** Expo Router v3 — file-based routing, typed routes, deep linking, tab layouts, modal routes, auth guards via `_layout.tsx`

**Styling:** NativeWind v4 — `dark:` variants, `useColorScheme()`, platform-specific classes (`ios:`, `android:`), custom Tailwind theme extension, avoiding hardcoded colors

**Data:** WatermelonDB — schema design, model classes with decorators (`@field`, `@children`, `@lazy`), reactive queries with `useLiveQuery`, migrations, JSI adapter for performance, `database.write()` transaction pattern

**Performance:** FlashList over FlatList always, `React.memo` with custom comparators, `useMemo` for sorted/filtered data, `useCallback` for stable handlers, Reanimated worklets on UI thread

**Platform parity:** Never assume iOS and Android behave the same. Always check: keyboard avoidance (`KeyboardAvoidingView` behavior differs), safe areas (`useSafeAreaInsets`), status bar, font rendering, gesture handling

**Rules you enforce:**
- Every component has TypeScript props interface — no implicit `any`
- Every screen is wrapped in `<ErrorBoundary screenName="...">` 
- Every list uses FlashList with measured `estimatedItemSize`
- Every navigation param is typed via `expo-router`'s typed routes
- No inline styles — NativeWind classes only (except `StyleSheet.hairlineWidth` equivalents)

Reference `references/expo/expo/`, `references/Nozbe/WatermelonDB/docs/`, and `references/nativewindui/nativewindui/` for patterns.
```

### `voice-ui-designer.md`

```markdown
---
name: voice-ui-designer
description: Specialist in mobile voice UX for noisy environments. Trigger when working on VoiceButton.tsx, VoiceStateMachine.ts, TranscriptDisplay.tsx, CommandFeedback.tsx, or any file related to speech recognition or voice commands. Also trigger when the user says "voice", "mic", "speech", or "dictation".
---

You are a voice UX designer and React Native engineer. You specialize in building voice interfaces that work in loud, distracting real-world environments (bars, warehouses, truck cabs).

**Voice UX principles you apply:**
1. **Forgiving input** — the interface assumes the user spoke correctly; it never blames the user for misrecognition
2. **Instant feedback** — interim transcript must appear within 200ms of first word; users need to see the system is hearing them
3. **Graceful degradation** — if recognition fails, offer to retry; never crash or show an error screen
4. **Confirmation before action** — nothing changes until the user accepts; the AI suggests, the human confirms
5. **One tap to undo** — every voice action can be rejected with one tap

**State machine you enforce:**
IDLE → LISTENING → PROCESSING → CONFIRMING → IDLE
- IDLE → LISTENING: requires microphone permission (handle gracefully if denied)
- LISTENING → PROCESSING: on silence > 1.5s or manual stop
- PROCESSING → CONFIRMING: on AI response (structured CommandAction received)
- CONFIRMING → IDLE: on Accept/Reject tap or 5s auto-timeout

**React Native Voice API patterns:**
- Always call `Voice.destroy()` in cleanup
- Use `onSpeechPartialResults` for interim transcript display
- `onSpeechError` must never surface a technical error code — translate to human language
- Set `locale` based on device region

**Reanimated animation patterns for voice:**
- Mic button pulse while LISTENING: `useSharedValue` → `withRepeat(withTiming(...))`
- Transcript fade-in: `FadeIn` layout animation
- CommandFeedback slide-up: `SlideInDown` from Reanimated layout animations
- All animations must be interruptible — never block user interaction

Reference `references/software-mansion/react-native-reanimated/docs/` for animation APIs.
```

### `ai-tool-builder.md`

```markdown
---
name: ai-tool-builder
description: Expert in Anthropic Claude API tool use, streaming responses, and the AI memory/learning system. Trigger when working in src/ai/ directory, when creating or modifying tool definitions, when working on the learning agent, or when asked about "tool use", "function calling", "AI memory", or "learning agent". Also trigger on any file matching *-agent.ts or *-tool.ts.
---

You are an AI systems engineer specializing in Anthropic's Claude API, tool use patterns, and building AI systems that improve over time.

**Tool use patterns you follow:**
- Every tool definition has: `name`, `description` (specific and action-oriented), `input_schema` (Zod → JSON Schema via `zodToJsonSchema`)
- Tool handlers are pure TypeScript — no AI calls inside a handler; the handler validates, looks up data, and returns structured output
- Tool descriptions must include: what it does, when to call it vs. other tools, and what it returns
- Always define a return type; never return `any`

**Streaming patterns:**
```typescript
const stream = await anthropic.messages.stream({ ... });
for await (const chunk of stream) {
  if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
    onToken(chunk.delta.text);  // update UI incrementally
  }
}
const finalMessage = await stream.finalMessage();
```

**Memory system rules:**
- Memories are WatermelonDB records, not in-memory state
- Retrieval at call time: top 5 memories per category, filtered by confidence ≥ 0.3
- Memory injection: format as "Known patterns for this rep:\n- [CATEGORY] key: value (X% confidence)"
- Never inject memories with confidence < 0.3 — they add noise, not signal
- Every memory write goes through `src/ai/memory/writer.ts` — never write directly to DB in a tool handler

**Learning agent rules:**
- Minimum 3 feedback events before synthesis (noise floor)
- Confidence thresholds: ≥ 4 consistent examples = 0.9, 2–3 = 0.7, 1 = 0.5 (store as hint only)
- Learning agent runs in background — never block the main thread
- Always mark processed events as `synthesized = true` — idempotent

**System prompt quality rules:**
1. Opens with persona + context (who the AI is, what it's doing)
2. Explicit tool routing (which tool to call for which input type)
3. Rules section: numbered, specific, behavioral
4. "Never" section: hard constraints (don't invent data, don't respond in > N sentences)
5. Output format specified: JSON schema OR example output

Reference `references/anthropics/anthropic-cookbook/tool_use/` for patterns.
```

### `zpl-engineer.md`

```markdown
---
name: zpl-engineer
description: Expert in ZPL II (Zebra Programming Language) label design, Zebra printer hardware, and the Labelary preview API. Trigger when working in src/zpl/, when creating or modifying label templates, when asked about "ZPL", "label", "shelf talker", "Zebra", "printer", or "Labelary". Also trigger on any file matching *label*, *zpl*, *template* in the zpl/ directory.
---

You are a ZPL label engineer. You design labels for Zebra mobile printers (ZQ520, ZQ630) and write TypeScript functions that generate ZPL II strings.

**ZPL II fundamentals:**
- Every label: `^XA` (start) ... `^XZ` (end). No exceptions.
- `^CI28` immediately after `^XA` — UTF-8 character set
- `^PW` — print width in dots. 8dpmm × 25.4 × inches = dots
- `^LL` — label length in dots. Same formula.
- `^FO x,y` — field origin. x = distance from left edge, y = distance from top. Both in dots.
- `^A0N,h,w` — scalable font. h = height in dots, w = width in dots. Use for all text.
- `^FD text ^FS` — field data. Always end with `^FS`.
- `^GB w,h,t` — graphic box. w = width, h = height, t = thickness.

**Hardware targets:**
| Printer | DPI | dpmm | Max width |
|---|---|---|---|
| ZQ520 | 203 | 8 | 2" or 4" stock |
| ZQ630 | 300 | 12 | 4" stock |
- Default all templates for 8dpmm (203dpi) unless otherwise specified
- 4" labels: `^PW640` (4" × 8dpmm × 20)
- 2.5" labels: `^PW400` (2.5" × 8dpmm × 20... approx; test with Labelary)

**Text safety rules:**
- Always truncate text that could overflow the label. Use `.substring(0, n)` with `…` suffix.
- Max chars per line at 36pt: ~22 chars on a 2.5" label, ~28 chars on a 4" label
- Never place a `^FO x` closer than 20 dots to the right edge
- Verify every template against Labelary before committing: `POST http://api.labelary.com/v1/printers/8dpmm/labels/{W}x{H}/0/`

**TypeScript pattern:**
```typescript
export function generateLabel(params: LabelParams): string {
  // 1. Validate and truncate all string inputs
  // 2. Build ZPL as array of lines
  // 3. Join with '\n'
  // 4. Return string — never side effects in the generator
}
```

**Testing rule:** Every template must have a Vitest snapshot test AND a Labelary live-render verification in the test comment. Snapshot tests catch regressions; Labelary verification catches render errors the snapshot won't.

Reference Zebra Developer Portal ZPL II Programming Guide (linked in `references/` README) for command reference.
```

### `rn-accessibility.md`

```markdown
---
name: rn-accessibility
description: Expert in React Native accessibility — VoiceOver (iOS), TalkBack (Android), Dynamic Type, and WCAG 2.1 AA compliance. Trigger on any component file, when asked about "accessibility", "VoiceOver", "TalkBack", "a11y", screen reader, or Dynamic Type. Also trigger on Day 6 accessibility audit tasks.
---

You are a React Native accessibility specialist. You ensure every component and screen is fully usable by people who rely on screen readers, larger text, or keyboard navigation.

**Required props for every TouchableOpacity / Pressable:**
```typescript
accessibilityRole="button"                        // or "link", "checkbox", "radio", "tab"
accessibilityLabel="Concise action description"  // what it IS — no verbs like "tap to"
accessibilityHint="What happens when activated"   // what it DOES when activated
accessible={true}                                 // explicit is better than implicit
accessibilityState={{ disabled: isDisabled }}     // current state
```

**Required for every list:**
```typescript
// FlashList / FlatList
accessibilityLabel={`${title}, ${data.length} items`}
```

**Required for every loading state:**
```typescript
<View accessibilityLiveRegion="polite" accessibilityLabel="Loading...">
  <Skeleton />
</View>
```

**Required for every image:**
```typescript
// Meaningful image:
<Image accessibilityLabel="Pale Ale keg" />
// Decorative image:
<Image accessible={false} />
```

**Custom actions for swipeable items:**
```typescript
accessibilityActions={[
  { name: 'delete', label: 'Delete' },
  { name: 'edit', label: 'Edit' },
]}
onAccessibilityAction={({ nativeEvent: { actionName } }) => {
  if (actionName === 'delete') handleDelete();
}}
```

**Dynamic Type support:**
- Never use `<Text style={{ fontSize: ... }}>` with fixed sizes — use NativeWind text classes
- Never set `allowFontScaling={false}` — this breaks Dynamic Type and violates App Store guidelines
- Never use fixed-height containers for text — use `minHeight` or `flex`
- Test at: Settings → Accessibility → Display & Text Size → Larger Text → drag to maximum

**Color contrast minimum (WCAG AA):**
- Normal text (< 18pt): 4.5:1 contrast ratio
- Large text (≥ 18pt bold or ≥ 24pt): 3:1 minimum
- Use `references/dequelabs/axe-core/lib/rules/color-contrast.js` for the contrast formula

Reference `references/FormidableLabs/react-native-a11y/` for component patterns.
```

### `offline-sync-architect.md`

```markdown
---
name: offline-sync-architect
description: Expert in WatermelonDB offline-first patterns, sync queue design, conflict resolution, and Salesforce REST API integration. Trigger when working in src/db/, src/sync/, or src/auth/, when asked about "offline", "sync", "conflict", "queue", or "Salesforce API". Also trigger on any file matching *sync*, *queue*, *db*, *repository*.
---

You are an offline-first mobile architect specializing in WatermelonDB and Salesforce integration.

**Offline-first golden rules:**
1. Every read returns immediately from local DB. Network is never in the read path for data the user has previously seen.
2. Every write goes to local DB first, then to the sync queue. Never write directly to Salesforce from a UI action.
3. The sync queue is durable — it survives app restarts. A queued item is not lost unless the user explicitly deletes it.
4. Conflicts are resolved by explicit rules (§7.4 of Product Bible), not silently.

**WatermelonDB write pattern — always this:**
```typescript
await database.write(async () => {
  await entity.update(record => {
    record.field = value;
    record.updatedAt = Date.now();
  });
});
// NEVER: entity.field = value  (no transaction — will silently fail or corrupt)
```

**Sync queue processing:**
- Items with `attempts >= 3` are marked `failed` — they do NOT retry automatically
- Failed items surface a "Sync Failed" badge in the UI with an option to retry or discard
- Processing order: `created_at ASC` — first in, first out
- Never process more than 10 items at a time per sync run (rate limit protection)

**Salesforce REST API patterns:**
- Token refresh: detect 401, call `/services/oauth2/token` with `refresh_token` grant, retry once
- Bulk creates: use Salesforce Composite API (`/services/data/vXX.0/composite/`) for batching up to 25 records
- Never call Salesforce from within a WatermelonDB `write()` transaction — async deadlock risk

**Conflict resolution (from §7.4 of Product Bible):**
- Account data: server wins
- Orders created offline: create both, flag for review
- Visit notes: last-write-wins (timestamp)
- Memories: merge — keep higher confidence value

Reference `references/Nozbe/WatermelonDB/docs/` and `references/forcedotcom/SalesforceMobileSDK-iOS/` for patterns.
```

### `performance-engineer.md`

```markdown
---
name: performance-engineer
description: Expert in React Native performance — FlashList, Reanimated, hermes profiling, bundle size, memory management. Trigger on any list component, animation code, or when the user mentions "slow", "janky", "fps", "memory", "bundle size", "performance", or "optimization". Also trigger on Day 6 performance pass.
---

You are a React Native performance engineer. Your baseline is: every interaction feels instant, every scroll is 60fps, and the app launches in under 2 seconds on an iPhone SE 3.

**FlashList rules:**
- Measure the actual rendered height of items, set `estimatedItemSize` to that exact value
- Use `getItemType` for heterogeneous lists — FlashList reuses cells of the same type
- Never put hooks inside `renderItem` — extract to a separate component
- Use `keyExtractor` that returns a stable, unique string — never use array index

**Re-render prevention:**
```typescript
// Memoize components that receive complex objects
const AccountCard = React.memo(AccountCardBase, (prev, next) =>
  prev.account.id === next.account.id &&
  prev.account.syncStatus === next.account.syncStatus
);

// Stable callbacks
const handlePress = useCallback(() => { ... }, [dep1, dep2]);

// Memoized derived data — never compute in render
const sortedAccounts = useMemo(
  () => [...accounts].sort(...),
  [accounts]
);
```

**WatermelonDB reactive query performance:**
- Use `Q.take(n)` on queries that don't need all records
- Use `Q.where` with indexed columns only — `isIndexed: true` in schema
- Don't observe queries with > 500 records directly — paginate

**Reanimated worklet rules:**
- Animation logic runs on UI thread — no API calls, no setState inside worklets
- Use `runOnJS` to call JS functions from worklets (e.g., setState after animation completes)
- Profile animations with the Reanimated `LayoutAnimation` debugger

**Bundle size rules:**
- `import { specific } from 'library'` not `import Library from 'library'`
- No `lodash` — use native JS equivalents
- Check bundle size after adding any new dependency: `npx react-native bundle-size`

**Measurement targets (iPhone SE 3):**
- Cold launch → interactive: < 2.5s
- Warm launch → interactive: < 0.8s
- 100-item account list scroll: 60fps (no Flashlist warnings)
- Peak memory: < 150MB

Reference `references/Shopify/flash-list/benchmarks/` for FlashList performance data.
```

### `test-writer.md`

```markdown
---
name: test-writer
description: Expert in Jest + React Native Testing Library + Maestro E2E. Trigger when creating test files, when asked to "write tests", "add coverage", "test this", or when a feature is marked as needing tests. Also trigger on Day 5 test suite work. Trigger on any file matching *.test.ts, *.spec.ts, or files in __tests__/ or maestro/.
---

You are a test engineer specializing in React Native mobile apps. You write tests that are fast, reliable, and actually test the right things.

**TDD workflow you enforce:**
1. Write the failing test FIRST
2. Run it — confirm it fails (red)
3. Write the minimum implementation to pass
4. Confirm it passes (green)
5. Refactor — test must stay green

**Jest unit test patterns:**
```typescript
// Arrange → Act → Assert — always this structure
describe('functionName', () => {
  describe('with valid input', () => {
    it('returns expected result', () => {
      // Arrange
      const input = { ... };
      // Act
      const result = functionName(input);
      // Assert
      expect(result).toEqual(expected);
    });
  });

  describe('with edge case', () => {
    it('handles edge case gracefully', () => {
      // ...
    });
  });
});
```

**WatermelonDB integration tests:**
```typescript
// Always use in-memory SQLite adapter for tests
const adapter = new SQLiteAdapter({ schema, dbName: ':memory:' });
const db = new Database({ adapter, modelClasses });
// Seed data in beforeEach, teardown in afterEach
```

**AI tool tests — fixture-based, no real API calls:**
```typescript
// Mock the Anthropic SDK — no real calls in CI
vi.mock('@anthropic-ai/sdk', () => ({
  default: class Anthropic {
    messages = { create: vi.fn() };
  }
}));
// Test the tool handler directly with fixture inputs
```

**Maestro YAML patterns:**
```yaml
# Always start with a known state
- launchApp:
    clearState: true
    env:
      MAESTRO_TEST_MODE: "true"
# Use data-testid attributes for stability
- tapOn:
    id: "account-card-the-rail"
# Use assertVisible to confirm state, not just tapOn
- assertVisible: "InsightBanner"
# Test offline: toggle airplane mode via Maestro device API
```

**Coverage requirements:**
- `src/ai/`: ≥ 90% lines
- `src/zpl/templates/`: 100% lines
- `src/sync/`: ≥ 85% lines
- `src/utils/`: ≥ 90% lines
- Never write tests that test implementation details — test behavior

Reference `references/testing-library/react-native-testing-library/docs/` for RNTL API.
Reference `references/mobile-dev-inc/maestro/docs/` for Maestro YAML syntax.
```

### `salesforce-integration.md`

```markdown
---
name: salesforce-integration
description: Expert in Salesforce REST API, Connected Apps, OAuth 2.0 PKCE, Apex, and Lightning Web Components. Trigger when working in src/auth/, src/sync/sf-client.ts, packages/sfdx-package/, or any .cls or .html LWC file. Also trigger when asked about "Salesforce", "SFDX", "LWC", "Apex", "Connected App", or "OAuth".
---

You are a Salesforce integration engineer with expertise in the mobile SDK OAuth patterns, REST API, and LWC development.

**OAuth PKCE flow for mobile:**
1. Generate `code_verifier` (43–128 char URL-safe random string)
2. Generate `code_challenge` = BASE64URL(SHA256(code_verifier))
3. Authorization URL: `{instanceUrl}/services/oauth2/authorize?response_type=code&client_id={id}&redirect_uri={uri}&code_challenge={challenge}&code_challenge_method=S256`
4. Exchange code: POST to `{instanceUrl}/services/oauth2/token` with `code_verifier`
5. Store `access_token` + `refresh_token` in `expo-secure-store`

**Token refresh pattern:**
```typescript
async function refreshAccessToken(refreshToken: string): Promise<string> {
  const response = await fetch(`${instanceUrl}/services/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: SF_CLIENT_ID,
      refresh_token: refreshToken,
    }).toString(),
  });
  const data = await response.json();
  if (!data.access_token) throw new Error('Token refresh failed');
  return data.access_token;
}
```

**Salesforce REST API rules:**
- Always include `Authorization: Bearer {token}` header
- `Content-Type: application/json` for POST/PATCH
- Use `/services/data/v59.0/` (or latest available)
- Create: `POST /sobjects/{ObjectName}/`
- Update: `PATCH /sobjects/{ObjectName}/{id}`
- Composite (batch creates): `POST /composite/`
- Error shape: `[{ message, errorCode, fields }]`

**Ohanafy namespace:** `ohfy__` for existing objects, `ohfy_field__` for new objects in this module

**LWC wire adapter pattern:**
```javascript
@wire(getRecentVisits, { repId: '$repId', limit: 10 })
wiredVisits({ data, error }) {
  if (data) this.visits = data;
  if (error) this.error = error;
}
```

Reference `references/trailheadapps/lwc-recipes/` for LWC patterns.
Reference `references/sfdx-isv/sfdx-falcon-template/` for 2GP structure.
```

---

## §6 — Skill Files

Skill files live in `.claude/skills/`. They teach Claude Code domain knowledge that persists across sessions — write them as compact reference documents.

### `nativewind-patterns.md`

```markdown
# NativeWind v4 Patterns for Ohanafy Field

## Brand token usage
Always use semantic tokens from tailwind.config.js, never raw colors:
- `bg-ohanafy-primary` not `bg-blue-600`
- `text-ohanafy-ink` not `text-gray-900`
- `dark:bg-ohanafy-dark-surface` for dark mode surfaces

## Platform-specific classes
- `ios:pt-safe` — iOS safe area top
- `android:pt-4` — Android has no notch
- `ios:rounded-xl android:rounded-lg` — platform-native feel

## Component patterns
Sheet bottom: `rounded-t-3xl bg-white dark:bg-ohanafy-dark-surface`
Card: `bg-white dark:bg-ohanafy-dark-surface rounded-2xl shadow-sm p-4`
Badge: `rounded-full px-2 py-0.5 text-xs font-semibold`
Section header: `text-xs font-semibold uppercase tracking-wider text-gray-500`

## Responsive (tablet split pane)
Width check via `useTabletLayout()` hook — NOT via NativeWind breakpoints
(RN doesn't have CSS media queries; use the custom hook instead)

## Forbidden patterns
- No `style={{}}` inline styles (exception: StyleSheet.hairlineWidth for borders)
- No `text-black` or `text-white` (use theme tokens)
- No fixed pixel dimensions for text containers (use min-height or flex)
```

### `watermelondb-patterns.md`

```markdown
# WatermelonDB Patterns for Ohanafy Field

## Always write inside transactions
```typescript
await database.write(async () => {
  await collection.create(record => {
    record.name = value;
  });
});
```
Writing outside transactions is silent corruption risk.

## Reactive queries (UI layer)
```typescript
// In components: use withObservables HOC or useLiveQuery hook
const accounts = useLiveQuery(
  () => database.get<Account>('accounts').query(Q.where('needs_attention', true)),
  []
);
```
The UI re-renders automatically when the query result changes.

## Non-reactive queries (in sync engine, agents)
```typescript
const items = await database.get<SyncQueueItem>('sync_queue')
  .query(Q.where('status', 'pending'), Q.take(10))
  .fetch();
```

## Migration pattern
```typescript
// src/db/migrations/index.ts
import { schemaMigrations, addColumns } from '@nozbe/watermelondb/Schema/migrations';
export default schemaMigrations({
  migrations: [
    {
      toVersion: 2,
      steps: [addColumns({ table: 'accounts', columns: [{ name: 'new_field', type: 'string' }] })],
    },
  ],
});
```
Always increment `schema.version` AND add a migration. Mismatched versions crash on launch.

## Index strategy
Index: `sf_id`, `account_id`, `rep_id`, `status`, `sync_status`, `needs_attention`, `created_at`
Do NOT index: `notes`, `raw_transcript`, `payload_json` (large text fields)

## Batch operations
```typescript
await database.write(async () => {
  await database.batch(
    ...items.map(item => collection.prepareCreate(r => { r.field = item.value; }))
  );
});
```
Use `batch` for seeding or bulk updates — orders of magnitude faster than individual creates.
```

### `claude-tool-use-streaming.md`

```markdown
# Claude API Tool Use + Streaming Patterns

## Tool definition (TypeScript)
```typescript
import { Tool } from '@anthropic-ai/sdk/resources';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

const InputSchema = z.object({ transcript: z.string().min(1).max(500) });

export const myTool: Tool = {
  name: 'tool_name',
  description: 'What it does. When to call it (specific conditions). What it returns.',
  input_schema: zodToJsonSchema(InputSchema) as Tool['input_schema'],
};
```

## Streaming with tool use
```typescript
const stream = await anthropic.messages.stream({
  model: 'claude-sonnet-4-20250514',
  max_tokens: 1000,
  system: SYSTEM_PROMPT,
  tools: [tool1, tool2],
  messages: [{ role: 'user', content: userMessage }],
});

for await (const chunk of stream) {
  if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
    onTextToken(chunk.delta.text);  // stream to UI
  }
}

const message = await stream.finalMessage();
// Extract tool use block
const toolUse = message.content.find(b => b.type === 'tool_use');
if (toolUse?.type === 'tool_use') {
  const result = await toolHandlers[toolUse.name](toolUse.input);
  // Build follow-up message with tool_result
}
```

## Memory injection template
```typescript
const memoriesContext = memories.length > 0
  ? `\n\nKnown patterns for this rep:\n${memories.map(m =>
      `- [${m.category}] ${m.key}: ${m.value} (${(m.confidence*100).toFixed(0)}% confidence)`
    ).join('\n')}`
  : '';

const systemWithMemory = SYSTEM_PROMPT + memoriesContext;
```

## Error handling
```typescript
try {
  const response = await anthropic.messages.create({ ... });
} catch (error) {
  if (error instanceof Anthropic.APIError) {
    if (error.status === 529) // overloaded — retry with backoff
    if (error.status === 400) // bad request — log and surface to user
  }
}
```
```

### `zpl2-reference.md`

```markdown
# ZPL II Quick Reference for Ohanafy Field

## Hardware targets
| Printer | dpmm | Dots per inch | Common label widths |
|---|---|---|---|
| ZQ520 | 8 | 203 | 2", 2.5", 4" |
| ZQ630 | 12 | 300 | 4" |

## Dot conversion
dots = inches × dpmm × 25.4
- 2.5" @ 8dpmm = 2.5 × 8 × 25.4 = ~508 dots (use ^PW400 for safe margin)
- 4" @ 8dpmm = 4 × 8 × 25.4 = ~812 dots (use ^PW640 for safe margin)

## Essential commands
| Command | Purpose | Example |
|---|---|---|
| ^XA | Label start | ^XA |
| ^XZ | Label end | ^XZ |
| ^CI28 | UTF-8 charset | ^CI28 |
| ^PW n | Print width (dots) | ^PW640 |
| ^LL n | Label length (dots) | ^LL480 |
| ^FO x,y | Field origin | ^FO30,25 |
| ^A0N,h,w | Scalable font | ^A0N,36,36 |
| ^FD text ^FS | Field data | ^FDYellowhammer Pale Ale^FS |
| ^GB w,h,t | Graphic box (line) | ^GB580,2,2 |

## Font size guide (at 8dpmm)
| ^A0N height | Approx pt | Use for |
|---|---|---|
| 18 | ~7pt | Footer, secondary info |
| 22 | ~9pt | Body, SKU codes |
| 28 | ~11pt | Subheadings |
| 36 | ~14pt | Product names |
| 48 | ~19pt | Section headers |
| 54+ | ~21pt+ | Price (most prominent) |

## Labelary preview API
POST http://api.labelary.com/v1/printers/{dpmm}dpmm/labels/{W}x{H}/{idx}/
Content-Type: application/x-www-form-urlencoded
Body: [ZPL string URL-encoded]
Returns: PNG image

## Safety rules
1. Truncate all text inputs — never trust external strings
2. Verify ^FO x coordinates: max x = ^PW value - 20 (margin)
3. Always include ^CI28 for UTF-8 (special chars in product names)
4. Test every new template against Labelary before printing on hardware
```

### `sf-oauth-patterns.md`

```markdown
# Salesforce OAuth 2.0 PKCE Patterns

## Flow summary
1. Generate verifier + challenge (PKCE)
2. Open authorizationEndpoint in system browser (expo-auth-session)
3. App receives redirect with `code`
4. Exchange code for tokens at tokenEndpoint
5. Store tokens in expo-secure-store
6. Auto-refresh: intercept 401, refresh, retry once

## expo-auth-session boilerplate
```typescript
const discovery = {
  authorizationEndpoint: `${SF_URL}/services/oauth2/authorize`,
  tokenEndpoint: `${SF_URL}/services/oauth2/token`,
};
const request = new AuthSession.AuthRequest({
  clientId: SF_CLIENT_ID,
  scopes: ['api', 'refresh_token', 'offline_access'],
  redirectUri: AuthSession.makeRedirectUri({ scheme: 'com.ohanafy.field' }),
  usePKCE: true,
});
const result = await request.promptAsync(discovery);
```

## Token storage keys (SecureStore)
- `sf_access_token`
- `sf_refresh_token`
- `sf_instance_url`
- `anthropic_api_key` (retrieved from SF org settings post-auth)

## Connected App settings (Salesforce)
- OAuth scopes: api, refresh_token, offline_access
- Callback URL: com.ohanafy.field://oauth/callback
- PKCE: enabled (required)
- IP relaxation: Relax IP restrictions (for mobile clients)
```

### `rn-performance-patterns.md`

```markdown
# React Native Performance Patterns

## The FlashList contract
```typescript
<FlashList
  data={items}
  renderItem={({ item }) => <MemoizedItem item={item} />}  // always memo
  estimatedItemSize={MEASURED_ITEM_HEIGHT}  // measure once; never guess
  getItemType={item => item.type}           // for heterogeneous lists
  keyExtractor={item => item.id}
  removeClippedSubviews={true}             // default true, be explicit
/>
```
Rule: every list > 10 items uses FlashList. No FlatList in production.

## Measuring estimatedItemSize
```typescript
// In development, log the actual height:
onLayout={({ nativeEvent: { layout: { height } } }) => {
  if (__DEV__) console.log('ItemHeight:', height);  // remove before shipping
}}
// Then set estimatedItemSize to the logged value
```

## The memo pattern
```typescript
const Item = React.memo(ItemBase, (prev, next) =>
  // Only re-render if these specific fields changed
  prev.item.id === next.item.id &&
  prev.item.updatedAt === next.item.updatedAt &&
  prev.isSelected === next.isSelected
);
```

## Avoiding anonymous functions in JSX
```typescript
// BAD — creates new function on every render
<Item onPress={() => navigate(item.id)} />

// GOOD — stable reference
const handlePress = useCallback(() => navigate(item.id), [item.id]);
<Item onPress={handlePress} />
```

## Launch performance
- Use expo-splash-screen to keep splash visible until DB hydrated
- Hydrate WatermelonDB before rendering the account list
- Defer non-critical init (PostHog, learning agent) with setTimeout(fn, 0)

## Memory management
- Unsubscribe from WatermelonDB observations in useEffect cleanup
- Destroy Voice in cleanup: `Voice.destroy().then(Voice.removeAllListeners)`
- Cancel in-flight fetch requests in useEffect cleanup
```

### `maestro-e2e-patterns.md`

```markdown
# Maestro E2E Patterns for Ohanafy Field

## Flow file structure
```yaml
appId: com.ohanafy.field
---
# Comment describing what this flow tests
- launchApp:
    clearState: true   # always start clean
    env:
      MAESTRO_TEST_MODE: "true"
```

## Test data strategy
All E2E tests use seeded test data (via MAESTRO_TEST_MODE env var).
In test mode, the app loads from a static JSON fixture instead of Salesforce.
Never use production Salesforce data in E2E tests.

## Stable selectors (in priority order)
1. `id: "data-testid-value"` — most stable; add data-testid to all testable elements
2. `text: "Exact text"` — stable if text is static (not from API)
3. `accessibilityLabel: "Label"` — good; also tests a11y
4. Avoid: element type selectors (`button`, `text`) — too fragile

## Offline testing
```yaml
# Enable airplane mode
- setLocation:
    lat: 0
    lon: 0
# Or use Maestro's network control
- stopNetwork
# ...test offline behavior...
- startNetwork
- assertVisible: "Synced ✓"
```

## Timing
```yaml
# Wait for async operations
- waitForAnimationToEnd
- waitFor:
    visible: "Account list"
    timeout: 3000   # ms
```

## Screenshot on failure
Maestro auto-captures screenshots on failure. Check `.maestro/` output directory after failures.
```

---

## §7 — Slash Commands

Slash commands live in `.claude/commands/`. They give Claude Code repeatable, precise workflows triggered by `/command-name`.

### `/new-screen`

```markdown
---
name: new-screen
description: Scaffolds a new Expo Router screen with all boilerplate — TypeScript, NativeWind, ErrorBoundary, HelpButton, accessibility, dark mode, skeleton state, and empty state. Usage: /new-screen [name] [route-path]
---

When invoked, scaffold the following for screen `[name]` at `app/[route-path].tsx`:

1. **Screen file** with:
   - TypeScript props interface
   - ErrorBoundary wrapper
   - HelpButton in header right
   - LoadingSkeleton during data fetch
   - EmptyState when no data
   - Dark mode support (NativeWind `dark:` variants)
   - `accessibilityLabel` on root View

2. **Unit test** at `__tests__/unit/screens/[name].test.tsx` with:
   - Renders without crashing
   - Shows skeleton while loading
   - Shows empty state with no data
   - Shows content when data present

3. **Maestro flow stub** at `maestro/flows/[name].yaml` with:
   - launchApp + navigate to this screen
   - assertVisible of primary content
   - TODO comment for specific assertions

4. **Help content** — add entry to `src/components/shared/HelpButton.tsx` HelpContent map

Report: file paths created, next step (populate the data hook).
```

### `/new-ai-tool`

```markdown
---
name: new-ai-tool
description: Scaffolds a new Claude AI tool — Zod schema, tool definition, handler, test with fixtures, and wires it into the tools index. Usage: /new-ai-tool [tool-name] [description]
---

Scaffold the following for tool `[tool-name]`:

1. **Tool file** at `src/ai/tools/[tool-name].ts`:
   - Zod InputSchema
   - Zod OutputSchema
   - Tool definition (name, description, input_schema)
   - Handler function (pure TypeScript — no AI calls inside)
   - Export both the tool and the handler

2. **Test file** at `__tests__/unit/ai/[tool-name].test.ts`:
   - 5 fixture test cases (happy path, edge case, invalid input, empty input, boundary value)
   - All use static fixtures — no real Anthropic API calls
   - Mock the Anthropic SDK

3. **Fixture file** at `__tests__/fixtures/[tool-name]-inputs.ts`:
   - At least 5 sample inputs with expected outputs

4. **Wire into index** — add export to `src/ai/tools/index.ts`

5. **Update CLAUDE.md** — add a one-line description of the new tool to the "AI Tools" section

Report: what the tool does, its inputs, its outputs, and which agent should call it.
```

### `/new-zpl-template`

```markdown
---
name: new-zpl-template
description: Creates a new ZPL label template — TypeScript generator, Vitest snapshot test, Labelary preview verification. Usage: /new-zpl-template [name] [width-inches] [height-inches]
---

Scaffold for template `[name]` at `[W]"×[H]"`:

1. **Template file** at `src/zpl/templates/[name].ts`:
   - Params interface with JSDoc for each field
   - Generator function that returns a ZPL string
   - Input validation and truncation for all string fields
   - All `^FO x` coordinates verified to be within (`^PW` - 20) dots

2. **Test file** at `__tests__/unit/zpl/[name].test.ts`:
   - Starts with ^XA, ends with ^XZ
   - Contains ^CI28
   - No ^FO x coordinate > (label_width_dots - 20)
   - Long strings are truncated
   - Price formatted correctly ($X.XX)
   - Snapshot test (`.toMatchSnapshot()`)

3. **Labelary verification comment** — add to the test file:
   ```
   // Verify with Labelary:
   // curl -X POST 'http://api.labelary.com/v1/printers/8dpmm/labels/[W]x[H]/0/'
   //   --data-urlencode '@zpl-string.txt' --output preview.png && open preview.png
   ```

4. **Add to ZPL engine index** — export from `src/zpl/index.ts`

5. **Add to label selector** — add the template type to `LabelSelector.tsx`

Report: the template's exact dimensions, target printer, and primary use case.
```

### `/a11y-audit`

```markdown
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
```

### `/perf-audit`

```markdown
---
name: perf-audit
description: Audits a screen or component for React Native performance issues — unnecessary re-renders, unoptimized lists, missing memoization, heavy computations in render. Usage: /perf-audit [file-path]
---

Audit the specified file for:

1. **FlatList** — any FlatList for > 10 items (replace with FlashList)
2. **Missing React.memo** — components that receive complex object props
3. **Anonymous functions in JSX** — `onPress={() => fn(args)}` (use useCallback)
4. **Computed values in render** — array operations (filter, sort, map) without useMemo
5. **Missing keyExtractor** or using array index as key
6. **Missing estimatedItemSize** on FlashList
7. **State that could be derived** — state that duplicates something in a query
8. **Unsubscribed WatermelonDB observations** — missing cleanup in useEffect
9. **Heavy synchronous operations on the JS thread** — crypto, large string processing

Report: numbered list of issues with file:line, severity (high/medium/low), and the fix.
```

### `/handoff`

```markdown
---
name: handoff
description: Generates a session handoff document for the next Claude Code session. Run at the end of every work session. Creates HANDOFF.md with current state, uncommitted changes, and next priorities.
---

Generate `HANDOFF.md` in the project root with:

1. **Session summary** — date, time, what was accomplished (from recent git log)
2. **Current branch and status** — `git status` output, any uncommitted changes
3. **Day N status** — which Product Bible targets are complete, which are not
4. **Blockers** — any unresolved issues or decisions
5. **Next 3 priorities** — exactly what the next session should do first
6. **Files in progress** — any files that are partially implemented (incomplete functions, TODO comments)
7. **Test status** — last jest run result, any failing tests
8. **Known issues** — bugs found but not yet fixed

Commit HANDOFF.md with message: `chore: session handoff [date]`

The next session starts with: "Read HANDOFF.md. Confirm you understand the current state. Then proceed."
```

### `/daily-retro`

```markdown
---
name: daily-retro
description: Fills in today's retrospective in §25 of the Product Bible. Run at end of each day. Usage: /daily-retro [day-number]
---

1. Read the Day [N] targets from §9 of OHANAFY-FIELD-PRODUCT-BIBLE.md
2. Check each target against the current codebase
3. Fill in the Day [N] Retro in §25:
   - Targets completed: list each with [x]
   - Targets missed: list each with [ ] and why
   - Blockers: any unresolved issues
   - Tomorrow's first two targets: the highest-priority incomplete items

4. Generate a daily build health summary:
   - Run `npx jest --coverage --silent` → report coverage %
   - Run `npx tsc --noEmit` → report zero or count of errors
   - Report total Sentry errors in the last 24 hours (if accessible)

5. Commit the updated Product Bible: `docs: day [N] retro`
```

---

## §8 — Rules

Rules are standing constraints that Claude Code enforces across all sessions. They fire based on file patterns or always.

### `offline-first.md`

```markdown
# Rule: Offline First

**Scope:** All files in src/db/, src/sync/, src/hooks/, app/**/*.tsx

Every data read in the render path must be satisfied from WatermelonDB without requiring network access. Network is ONLY permitted in:
- The sync engine (src/sync/)
- The AI tools (src/ai/) — these are gracefully hidden if offline
- Authentication (src/auth/) — on first launch only

**Violations to flag:**
- Direct fetch() calls inside screen components
- useQuery() with no offline fallback
- Loading states that spin indefinitely (no cached data shown while loading)
- Any component that throws an error when `navigator.onLine === false`

**The test:** mentally simulate airplane mode. If the screen shows an error or spinner forever, it's a violation.
```

### `typescript-strict.md`

```markdown
# Rule: TypeScript Strict Mode

**Scope:** All .ts and .tsx files

TypeScript strict mode is non-negotiable. Enforce:
- No `any` types — use `unknown` + type narrowing, or define the proper interface
- No `// @ts-ignore` — fix the type error
- No `as unknown as TargetType` double casting — define a proper type guard
- No `!` non-null assertions without a comment explaining why it's safe
- Every function has explicit return type
- Every component has explicit props interface

**When adding new dependencies:** check if `@types/package-name` is available. If not, write a `.d.ts` declaration file.

**The test:** `npx tsc --noEmit` must exit 0 before every commit.
```

### `ai-never-invents.md`

```markdown
# Rule: AI Never Invents Data

**Scope:** All files in src/ai/

The AI layer may:
- Interpret natural language input
- Summarize or clean text the user provided
- Suggest products from the catalog
- Surface patterns from the user's own history
- Generate structured output from structured input

The AI layer may NEVER:
- Create account names, contact names, or addresses
- Invent product names, SKU codes, or prices not in the product catalog
- Fabricate historical order data
- Generate visit notes that weren't dictated by the rep
- Hallucinate Salesforce record IDs

**Enforcement pattern:**
Every tool handler that touches account/product data must validate against the local WatermelonDB — not against Claude's knowledge. Claude's knowledge of specific company data is not reliable.

**The test:** every tool handler test should include a fixture with an unknown product name — the handler must return `confidence: 'low'` or an empty result, never a fabricated match.
```

### `accessibility-mandatory.md`

```markdown
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
```

### `error-boundaries-everywhere.md`

```markdown
# Rule: Error Boundaries on Every Screen

**Scope:** All app/**/*.tsx screen files (not components)

Every screen-level component must be wrapped in `<ErrorBoundary screenName="ScreenName">`.

The ErrorBoundary must:
- Show a human-readable error message (not a technical stack trace)
- Show a "Try Again" button that resets the error state
- Log the error to Sentry with the screenName tag
- Never crash the entire app due to one screen's error

**The test:** throw `new Error('test')` inside the screen's render function. Confirm the ErrorBoundary catches it and shows the fallback UI. Then remove the throw.
```

### `no-credentials-in-code.md`

```markdown
# Rule: No Credentials in Code

**Scope:** All files

Zero tolerance. Any API key, token, password, or secret must live in:
- `.env.local` for local development (gitignored)
- EAS Secrets for CI/production builds

**Violations that will cause the pre-push hook to fail:**
- Any string matching `sk-ant-` (Anthropic key)
- Any string matching `Bearer ` followed by a 40+ char token
- Any string matching `password` as a variable name with a non-empty string value
- Any string matching `00D` followed by 15 chars (Salesforce org ID in a string literal)

**The fix:** move to `process.env.EXPO_PUBLIC_*` (public) or SecureStore (private runtime values).
```

### `tdd-required.md`

```markdown
# Rule: Test-Driven Development Required

**Scope:** src/ai/tools/, src/zpl/templates/, src/sync/, src/utils/

For every new function in these directories:
1. Write the failing test FIRST
2. Confirm it fails (run jest and see the failure)
3. Implement the function
4. Confirm it passes
5. Add edge cases

**Exceptions (not TDD, but still requires tests):**
- UI components — write tests after implementation, before the PR
- WatermelonDB model classes — test queries in integration tests

**The pre-push hook checks:** if a new .ts file in the above directories exists without a corresponding .test.ts file, the push is blocked with: "Missing test file for [filename]. Add tests or use /new-ai-tool or /new-zpl-template commands."
```

---

## §9 — Hooks

### `post-commit-log.sh`

```bash
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
```

### `pre-push-quality-gate.sh`

```bash
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
```

### `pre-merge-checklist.sh`

```bash
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
```

---

## §10 — `CLAUDE.md` (Production Version)

This is the complete `CLAUDE.md` for the project root. It's loaded at the start of every Claude Code session.

```markdown
# Ohanafy Field — Claude Code Project Context

## What this is
A production-quality native mobile app (iOS + Android) for field sales reps at
beverage distributors. Offline-first, AI-powered, ZPL label printing.

Built on: Expo SDK 52, React Native, TypeScript strict, Expo Router v3,
NativeWind v4, WatermelonDB, TanStack Query, Zustand, Reanimated v3,
FlashList, @react-native-voice/voice, Zebra Link-OS (custom Expo module),
Anthropic Claude Sonnet API, Sentry, PostHog.

## Session startup (required every session)
1. Read this file completely
2. Check HANDOFF.md (if exists) for prior session context
3. Open OHANAFY-FIELD-PRODUCT-BIBLE.md §9 — identify today's day
4. Read §25 for today's retro — what's done, what's not
5. State your plan for this session in one sentence
6. Begin

## Non-negotiables (§0 of Product Bible)
1. Offline first — every read works in airplane mode
2. Tests before features (TDD in src/ai/, src/zpl/, src/sync/)
3. TypeScript strict — zero `any`, zero `@ts-ignore`
4. Accessibility on every component — VoiceOver/TalkBack
5. AI never invents data — validates against WatermelonDB
6. ErrorBoundary on every screen
7. Feature freeze: Day 6, 5pm. Day 7 is docs + submission only.

## Available agents (delegate to these)
- `rn-architect` — screen/component scaffold, navigation, WatermelonDB
- `voice-ui-designer` — voice state machine, mic UI, transcript display
- `ai-tool-builder` — Claude tool definitions, handlers, memory system
- `zpl-engineer` — ZPL templates, printer integration, Labelary
- `rn-accessibility` — VoiceOver, TalkBack, Dynamic Type, tap targets
- `offline-sync-architect` — WatermelonDB patterns, SF REST, conflict resolution
- `performance-engineer` — FlashList, Reanimated, bundle size, memory
- `test-writer` — Jest unit tests, Maestro E2E flows, WDB integration tests
- `salesforce-integration` — OAuth, REST API, LWC, SFDX

## Available slash commands
- `/new-screen [name] [route]` — scaffold a complete screen with all boilerplate
- `/new-ai-tool [name] [desc]` — scaffold AI tool with tests and fixtures
- `/new-zpl-template [name] [W] [H]` — scaffold ZPL template with validation
- `/a11y-audit [file]` — accessibility audit with file:line violations
- `/perf-audit [file]` — performance audit with ranked issues
- `/handoff` — generate HANDOFF.md for next session
- `/daily-retro [day]` — fill in §25 retro

## Domain: beverage field sales rep
Jake Thornton is a field sales rep at Yellowhammer Beverage (beer + Red Bull
distributor, Birmingham AL). He visits 10 accounts per day, has a Zebra ZQ520
printer on his belt, and often has no signal in back-of-house areas.

Key vocabulary: account (retailer), visit, order, keg (1/2 bbl = 15.5gal),
case (24-unit pack), route, territory, tap, depletion, STW, CDA, three-tier.

NEVER say: fermenter, brewhouse, brewhouse, mash, grain bill, hop contracts.
These are brewery words. Jake works for a distributor, not a brewery.

## Architecture decisions (locked)
| Decision | Choice |
|---|---|
| Framework | Expo SDK 52 + React Native |
| Navigation | Expo Router v3 (file-based) |
| Styling | NativeWind v4 (Tailwind in RN) |
| Local DB | WatermelonDB (SQLite, reactive) |
| Server state | TanStack Query v5 |
| Client state | Zustand v4 |
| Lists | Shopify FlashList (never FlatList for > 10 items) |
| Animations | React Native Reanimated v3 |
| Voice | @react-native-voice/voice (on-device) |
| ZPL printing | Custom Expo module wrapping Zebra Link-OS SDK |
| AI | Anthropic Claude Sonnet, tool use, streaming |
| Error tracking | Sentry React Native |
| Analytics | PostHog React Native |
| E2E testing | Maestro |
| Unit testing | Jest + React Native Testing Library |
| Build/Submit | EAS (Expo Application Services) |

## Code conventions
- Commits: `feat(scope): description` / `fix(scope):` / `test(scope):` / `a11y(scope):` / `perf(scope):`
- File names: kebab-case for route files, PascalCase for components
- DB writes: always inside `database.write(async () => { ... })`
- AI outputs: always have Accept/Edit/Reject path — never locked outputs
- Errors: caught, logged to Sentry via `logger.error()`, shown to user with message
- Imports: named imports from packages; barrel imports from src/ directories

## Reference repos (read for patterns, don't copy verbatim)
Path: `./references/`
Key ones: expo/expo, Nozbe/WatermelonDB, Shopify/flash-list,
nativewindui/nativewindui, mobile-dev-inc/maestro,
hesreallyhim/awesome-claude-code, wshobson/agents

## Environment
- Dev: `.env.local` — EXPO_PUBLIC_* for public values, SecureStore for secrets
- CI/Prod: EAS Secrets
- Never hardcode any credential, API key, or token in source code
```

---

## §11 — Reference Reading List

Before starting Day 1, read these documents from the cloned reference repos. Budget 30–45 minutes. It's worth it.

### Priority 1 (read tonight — shapes Day 1 decisions)

| What to read | Path | Time | Why |
|---|---|---|---|
| CLAUDE.md examples | `references/hesreallyhim/awesome-claude-code/README.md` → CLAUDE.md section | 10 min | Shows what makes a great CLAUDE.md; improve §10 above |
| WatermelonDB Quick Start | `references/Nozbe/WatermelonDB/docs/Quick Start.md` | 10 min | The Day 1 schema work will go much faster |
| NativeWind v4 setup | `references/nativewindui/nativewindui/README.md` | 5 min | Day 1 theming setup nuances |
| FlashList README | `references/Shopify/flash-list/README.md` → Performance section | 5 min | Understand `estimatedItemSize` before using it |

### Priority 2 (read Day 2 morning — before tackling features)

| What to read | Path | Time | Why |
|---|---|---|---|
| Agent authoring patterns | `references/wshobson/agents/` — any 3 agent files | 10 min | See the format; improves our agent quality |
| obra/superpowers TDD | `references/obra/superpowers/test-driven-development/SKILL.md` | 5 min | The TDD skill will enforce this for us — understand what it enforces |
| Expo Router file-based routing | `references/expo/router/docs/` | 10 min | Tab layout + auth guard patterns |

### Priority 3 (read Day 3 morning — before AI work)

| What to read | Path | Time | Why |
|---|---|---|---|
| Anthropic Cookbook tool use | `references/anthropics/anthropic-cookbook/tool_use/` | 15 min | The gold standard for tool use patterns |
| Building Effective Agents post | Link: `https://www.anthropic.com/research/building-effective-agents` | 15 min | The 5 patterns our AI system uses |

### Priority 4 (read Day 5 morning — before test suite work)

| What to read | Path | Time | Why |
|---|---|---|---|
| Maestro flow syntax | `references/mobile-dev-inc/maestro/docs/` | 15 min | YAML syntax before writing 6 flows |
| RNTL query guide | `references/testing-library/react-native-testing-library/docs/queries.md` | 10 min | `getByRole` vs `getByLabelText` vs `getByTestId` — which to use when |

### Priority 5 (read Day 6 morning — before a11y audit)

| What to read | Path | Time | Why |
|---|---|---|---|
| react-native-a11y README | `references/FormidableLabs/react-native-a11y/README.md` | 10 min | Component-level a11y patterns |
| axe-core rule descriptions | `references/dequelabs/axe-core/lib/rules/` — `button-name.js`, `label.js`, `color-contrast.js` | 10 min | The rules to apply to every component |

---

**End of Ohanafy Field — Harness Setup Guide**

*Run this before Day 1. When Claude Code opens the project for the first time, it reads this document, executes the setup script, passes the §2 checklist, and then opens the Product Bible with the full context of an expert in every domain it will touch.*

*The harness is not overhead — it's the difference between Claude Code writing generic React Native and Claude Code writing world-class Ohanafy Field.* 🛠️
```
