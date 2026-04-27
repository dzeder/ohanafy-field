import { loadTokens, refreshAccessToken } from '@/auth/token-manager';

export interface SFClient {
  createRecord: (objectName: string, payload: Record<string, unknown>) => Promise<{ id: string }>;
  updateRecord: (
    objectName: string,
    id: string,
    payload: Record<string, unknown>
  ) => Promise<void>;
  query: <T>(soql: string) => Promise<T[]>;
}

const API_VERSION = 'v59.0';

async function authedFetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
  const tokens = await loadTokens();
  if (!tokens) throw new Error('Not authenticated to Salesforce');

  const doFetch = async (token: string): Promise<Response> => {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...((init?.headers as Record<string, string> | undefined) ?? {}),
    };
    return fetch(input, { ...init, headers });
  };

  let response = await doFetch(tokens.accessToken);
  if (response.status === 401) {
    const fresh = await refreshAccessToken();
    response = await doFetch(fresh);
  }
  return response;
}

export const sfClient: SFClient = {
  async createRecord(objectName, payload) {
    const tokens = await loadTokens();
    if (!tokens) throw new Error('Not authenticated to Salesforce');
    const response = await authedFetch(
      `${tokens.instanceUrl}/services/data/${API_VERSION}/sobjects/${objectName}/`,
      { method: 'POST', body: JSON.stringify(payload) }
    );
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`SF createRecord ${objectName} failed: ${response.status} ${text}`);
    }
    const data = (await response.json()) as { id: string };
    return { id: data.id };
  },

  async updateRecord(objectName, id, payload) {
    const tokens = await loadTokens();
    if (!tokens) throw new Error('Not authenticated to Salesforce');
    const response = await authedFetch(
      `${tokens.instanceUrl}/services/data/${API_VERSION}/sobjects/${objectName}/${id}`,
      { method: 'PATCH', body: JSON.stringify(payload) }
    );
    if (!response.ok && response.status !== 204) {
      const text = await response.text();
      throw new Error(`SF updateRecord ${objectName} failed: ${response.status} ${text}`);
    }
  },

  async query(soql) {
    const tokens = await loadTokens();
    if (!tokens) throw new Error('Not authenticated to Salesforce');
    const response = await authedFetch(
      `${tokens.instanceUrl}/services/data/${API_VERSION}/query?q=${encodeURIComponent(soql)}`,
      { method: 'GET' }
    );
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`SF query failed: ${response.status} ${text}`);
    }
    const data = (await response.json()) as { records: unknown[] };
    return data.records as never[];
  },
};
