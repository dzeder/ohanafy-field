import * as AuthSession from 'expo-auth-session';

import { storeTokens, type SFTokens } from './token-manager';

const SF_INSTANCE_URL = process.env.EXPO_PUBLIC_SF_INSTANCE_URL ?? '';
const SF_CLIENT_ID = process.env.EXPO_PUBLIC_SF_CLIENT_ID ?? '';

export const SF_REDIRECT_URI = AuthSession.makeRedirectUri({
  scheme: 'com.ohanafy.field',
  path: 'oauth/callback',
});

const discovery = {
  authorizationEndpoint: `${SF_INSTANCE_URL}/services/oauth2/authorize`,
  tokenEndpoint: `${SF_INSTANCE_URL}/services/oauth2/token`,
};

export interface SFLoginResult {
  tokens: SFTokens;
  email: string;
  userId: string;
  instanceUrl: string;
}

export async function loginWithSalesforce(): Promise<SFLoginResult> {
  if (!SF_INSTANCE_URL || !SF_CLIENT_ID) {
    throw new Error(
      'Salesforce env not configured: set EXPO_PUBLIC_SF_INSTANCE_URL and EXPO_PUBLIC_SF_CLIENT_ID in .env.local'
    );
  }

  const request = new AuthSession.AuthRequest({
    clientId: SF_CLIENT_ID,
    scopes: ['api', 'refresh_token', 'offline_access'],
    redirectUri: SF_REDIRECT_URI,
    usePKCE: true,
    responseType: AuthSession.ResponseType.Code,
  });

  const result = await request.promptAsync(discovery);

  if (result.type !== 'success' || !result.params.code) {
    throw new Error(`OAuth failed: ${result.type}`);
  }

  const tokenResponse = await AuthSession.exchangeCodeAsync(
    {
      clientId: SF_CLIENT_ID,
      code: result.params.code,
      redirectUri: SF_REDIRECT_URI,
      extraParams: { code_verifier: request.codeVerifier ?? '' },
    },
    discovery
  );

  const tokens: SFTokens = {
    accessToken: tokenResponse.accessToken,
    refreshToken: tokenResponse.refreshToken ?? '',
    instanceUrl: (tokenResponse as unknown as { instance_url?: string }).instance_url ?? SF_INSTANCE_URL,
    issuedAt: Date.now(),
  };

  await storeTokens(tokens);

  // Fetch user identity from Salesforce
  const idUrl = (tokenResponse as unknown as { id?: string }).id;
  if (!idUrl) {
    throw new Error('OAuth response missing identity URL');
  }
  const idResponse = await fetch(idUrl, {
    headers: { Authorization: `Bearer ${tokens.accessToken}` },
  });
  if (!idResponse.ok) {
    throw new Error(`Identity fetch failed: ${idResponse.status}`);
  }
  const identity = (await idResponse.json()) as { email: string; user_id: string };

  return {
    tokens,
    email: identity.email,
    userId: identity.user_id,
    instanceUrl: tokens.instanceUrl,
  };
}
