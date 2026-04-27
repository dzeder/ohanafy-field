import Anthropic from '@anthropic-ai/sdk';

// Dev-only: read the key from EXPO_PUBLIC_ANTHROPIC_API_KEY (bundled into the
// app build). Production reads it from Salesforce Custom Metadata
// (ohfy_field__AI_Config__mdt) post-auth via SecureStore — Day 4 work.
const apiKey =
  process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY ?? process.env.ANTHROPIC_API_KEY ?? '';

let client: Anthropic | null = null;

export function getAnthropic(): Anthropic | null {
  if (!apiKey) return null;
  if (!client) {
    client = new Anthropic({
      apiKey,
      // RN runs in a non-Node JS env; SDK needs this flag to allow non-Node fetch
      dangerouslyAllowBrowser: true,
    });
  }
  return client;
}

export const ANTHROPIC_MODEL = 'claude-sonnet-4-20250514';

export interface AnthropicCallOptions {
  systemPrompt: string;
  userMessage: string;
  maxTokens?: number;
  temperature?: number;
}

export async function callClaude(opts: AnthropicCallOptions): Promise<string> {
  const c = getAnthropic();
  if (!c) {
    throw new Error(
      'Anthropic API key not configured: set EXPO_PUBLIC_ANTHROPIC_API_KEY in .env.local'
    );
  }
  const response = await c.messages.create({
    model: ANTHROPIC_MODEL,
    max_tokens: opts.maxTokens ?? 1024,
    temperature: opts.temperature ?? 0.2,
    system: opts.systemPrompt,
    messages: [{ role: 'user', content: opts.userMessage }],
  });
  const text = response.content
    .filter((b): b is { type: 'text'; text: string } & typeof b => b.type === 'text')
    .map((b) => b.text)
    .join('\n');
  return text;
}
