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
