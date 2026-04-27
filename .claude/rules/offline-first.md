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
