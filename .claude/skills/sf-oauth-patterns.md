# Salesforce OAuth 2.0 PKCE Patterns

## Flow summary
1. Generate verifier + challenge (PKCE)
2. Open authorizationEndpoint in system browser (expo-auth-session)
3. App receives redirect with `code`
4. Exchange code for tokens at tokenEndpoint
5. Store tokens in expo-secure-store
6. Auto-refresh: intercept 401, refresh, retry once

## expo-auth-session boilerplate
```typescript
const discovery = {
  authorizationEndpoint: `${SF_URL}/services/oauth2/authorize`,
  tokenEndpoint: `${SF_URL}/services/oauth2/token`,
};
const request = new AuthSession.AuthRequest({
  clientId: SF_CLIENT_ID,
  scopes: ['api', 'refresh_token', 'offline_access'],
  redirectUri: AuthSession.makeRedirectUri({ scheme: 'com.ohanafy.field' }),
  usePKCE: true,
});
const result = await request.promptAsync(discovery);
```

## Token storage keys (SecureStore)
- `sf_access_token`
- `sf_refresh_token`
- `sf_instance_url`
- `anthropic_api_key` (retrieved from SF org settings post-auth)

## Connected App settings (Salesforce)
- OAuth scopes: api, refresh_token, offline_access
- Callback URL: com.ohanafy.field://oauth/callback
- PKCE: enabled (required)
- IP relaxation: Relax IP restrictions (for mobile clients)
