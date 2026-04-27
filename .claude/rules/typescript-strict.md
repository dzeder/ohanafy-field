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
