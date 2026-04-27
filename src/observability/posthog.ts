import { PostHog } from 'posthog-react-native';

const apiKey = process.env.EXPO_PUBLIC_POSTHOG_API_KEY ?? '';
const host = process.env.EXPO_PUBLIC_POSTHOG_HOST ?? 'https://app.posthog.com';

let client: PostHog | null = null;

export function initPostHog(): PostHog | null {
  if (!apiKey) {
    // eslint-disable-next-line no-console
    console.warn('[posthog] EXPO_PUBLIC_POSTHOG_API_KEY not set — analytics disabled');
    return null;
  }
  if (!client) {
    client = new PostHog(apiKey, { host });
  }
  return client;
}

export function getPostHog(): PostHog | null {
  return client;
}
