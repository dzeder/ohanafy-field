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
