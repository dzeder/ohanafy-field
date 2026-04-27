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
