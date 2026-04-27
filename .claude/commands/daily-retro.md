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
