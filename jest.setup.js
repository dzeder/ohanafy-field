// Jest setup — runs once per test file before tests
// @testing-library/react-native v12.4+ ships matchers built in; no extend-expect needed.

// Suppress Sentry / PostHog network calls in tests
jest.mock('@sentry/react-native', () => ({
  init: jest.fn(),
  captureException: jest.fn(),
  captureMessage: jest.fn(),
  wrap: (component) => component,
}));

jest.mock('posthog-react-native', () => ({
  PostHog: jest.fn().mockImplementation(() => ({
    capture: jest.fn(),
    identify: jest.fn(),
    flush: jest.fn(),
  })),
}));
