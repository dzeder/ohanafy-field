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
