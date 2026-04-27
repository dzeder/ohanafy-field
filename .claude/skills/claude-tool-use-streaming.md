# Claude API Tool Use + Streaming Patterns

## Tool definition (TypeScript)
```typescript
import { Tool } from '@anthropic-ai/sdk/resources';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

const InputSchema = z.object({ transcript: z.string().min(1).max(500) });

export const myTool: Tool = {
  name: 'tool_name',
  description: 'What it does. When to call it (specific conditions). What it returns.',
  input_schema: zodToJsonSchema(InputSchema) as Tool['input_schema'],
};
```

## Streaming with tool use
```typescript
const stream = await anthropic.messages.stream({
  model: 'claude-sonnet-4-20250514',
  max_tokens: 1000,
  system: SYSTEM_PROMPT,
  tools: [tool1, tool2],
  messages: [{ role: 'user', content: userMessage }],
});

for await (const chunk of stream) {
  if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
    onTextToken(chunk.delta.text);  // stream to UI
  }
}

const message = await stream.finalMessage();
// Extract tool use block
const toolUse = message.content.find(b => b.type === 'tool_use');
if (toolUse?.type === 'tool_use') {
  const result = await toolHandlers[toolUse.name](toolUse.input);
  // Build follow-up message with tool_result
}
```

## Memory injection template
```typescript
const memoriesContext = memories.length > 0
  ? `\n\nKnown patterns for this rep:\n${memories.map(m =>
      `- [${m.category}] ${m.key}: ${m.value} (${(m.confidence*100).toFixed(0)}% confidence)`
    ).join('\n')}`
  : '';

const systemWithMemory = SYSTEM_PROMPT + memoriesContext;
```

## Error handling
```typescript
try {
  const response = await anthropic.messages.create({ ... });
} catch (error) {
  if (error instanceof Anthropic.APIError) {
    if (error.status === 529) // overloaded — retry with backoff
    if (error.status === 400) // bad request — log and surface to user
  }
}
```
