import * as Sentry from '@sentry/react-native';

const dsn = process.env.SENTRY_DSN;

export function initSentry(): void {
  if (!dsn) {
    // eslint-disable-next-line no-console
    console.warn('[sentry] SENTRY_DSN not set — error tracking disabled');
    return;
  }
  Sentry.init({
    dsn,
    debug: __DEV__,
    enableAutoSessionTracking: true,
    tracesSampleRate: __DEV__ ? 1.0 : 0.2,
  });
}
