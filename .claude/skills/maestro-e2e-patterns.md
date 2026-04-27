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
