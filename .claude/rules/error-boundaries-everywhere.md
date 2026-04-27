# Rule: Error Boundaries on Every Screen

**Scope:** All app/**/*.tsx screen files (not components)

Every screen-level component must be wrapped in `<ErrorBoundary screenName="ScreenName">`.

The ErrorBoundary must:
- Show a human-readable error message (not a technical stack trace)
- Show a "Try Again" button that resets the error state
- Log the error to Sentry with the screenName tag
- Never crash the entire app due to one screen's error

**The test:** throw `new Error('test')` inside the screen's render function. Confirm the ErrorBoundary catches it and shows the fallback UI. Then remove the throw.
