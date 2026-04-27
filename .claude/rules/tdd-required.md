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
