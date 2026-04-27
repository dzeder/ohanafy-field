import * as SecureStore from 'expo-secure-store';

const SF_ACCESS_TOKEN_KEY = 'sf_access_token';
const SF_REFRESH_TOKEN_KEY = 'sf_refresh_token';
const SF_INSTANCE_URL_KEY = 'sf_instance_url';
const SF_ISSUED_AT_KEY = 'sf_issued_at';

export interface SFTokens {
  accessToken: string;
  refreshToken: string;
  instanceUrl: string;
  issuedAt: number;
}

export async function storeTokens(tokens: SFTokens): Promise<void> {
  await Promise.all([
    SecureStore.setItemAsync(SF_ACCESS_TOKEN_KEY, tokens.accessToken),
    SecureStore.setItemAsync(SF_REFRESH_TOKEN_KEY, tokens.refreshToken),
    SecureStore.setItemAsync(SF_INSTANCE_URL_KEY, tokens.instanceUrl),
    SecureStore.setItemAsync(SF_ISSUED_AT_KEY, tokens.issuedAt.toString()),
  ]);
}

export async function loadTokens(): Promise<SFTokens | null> {
  const [accessToken, refreshToken, instanceUrl, issuedAtRaw] = await Promise.all([
    SecureStore.getItemAsync(SF_ACCESS_TOKEN_KEY),
    SecureStore.getItemAsync(SF_REFRESH_TOKEN_KEY),
    SecureStore.getItemAsync(SF_INSTANCE_URL_KEY),
    SecureStore.getItemAsync(SF_ISSUED_AT_KEY),
  ]);
  if (!accessToken || !refreshToken || !instanceUrl) return null;
  return {
    accessToken,
    refreshToken,
    instanceUrl,
    issuedAt: issuedAtRaw ? Number.parseInt(issuedAtRaw, 10) : 0,
  };
}

export async function clearTokens(): Promise<void> {
  await Promise.all([
    SecureStore.deleteItemAsync(SF_ACCESS_TOKEN_KEY),
    SecureStore.deleteItemAsync(SF_REFRESH_TOKEN_KEY),
    SecureStore.deleteItemAsync(SF_INSTANCE_URL_KEY),
    SecureStore.deleteItemAsync(SF_ISSUED_AT_KEY),
  ]);
}

export async function refreshAccessToken(): Promise<string> {
  const existing = await loadTokens();
  if (!existing) throw new Error('No refresh token available');
  const clientId = process.env.EXPO_PUBLIC_SF_CLIENT_ID ?? '';
  const response = await fetch(`${existing.instanceUrl}/services/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: clientId,
      refresh_token: existing.refreshToken,
    }).toString(),
  });
  if (!response.ok) {
    throw new Error(`Token refresh failed: ${response.status}`);
  }
  const data = (await response.json()) as { access_token?: string };
  if (!data.access_token) throw new Error('Token refresh response missing access_token');
  await storeTokens({ ...existing, accessToken: data.access_token, issuedAt: Date.now() });
  return data.access_token;
}
