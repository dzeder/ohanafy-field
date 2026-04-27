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
