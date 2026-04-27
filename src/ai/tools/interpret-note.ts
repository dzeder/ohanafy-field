import { z } from 'zod';

export const InterpretNoteInputSchema = z.object({
  rawTranscript: z.string().min(1).max(2000),
});

export type InterpretNoteInput = z.infer<typeof InterpretNoteInputSchema>;

export interface InterpretNoteOutput {
  cleanedNote: string;
  removed: string[];
}

const FILLER_PATTERNS: RegExp[] = [
  /\b(um|uh|er|ah|like|you know|i mean|kind of|sort of|basically)\b/gi,
];

const TRAILING_PUNCT = /([!?.,])\1+/g;
const MULTI_SPACE = /\s{2,}/g;

// Pure-string utility. The note-agent calls Anthropic for richer summarization
// when the transcript is long; this handler is the deterministic fallback that
// runs offline and as a guarantee that filler words are removed even if the AI
// is unavailable.
export function interpretNote(input: InterpretNoteInput): InterpretNoteOutput {
  const removed: string[] = [];
  let cleaned = input.rawTranscript;

  for (const pattern of FILLER_PATTERNS) {
    const matches = cleaned.match(pattern) ?? [];
    removed.push(...matches.map((m) => m.toLowerCase()));
    cleaned = cleaned.replace(pattern, '');
  }

  cleaned = cleaned
    .replace(TRAILING_PUNCT, '$1')
    .replace(MULTI_SPACE, ' ')
    .replace(/\s+([,.!?])/g, '$1')
    .trim();

  // Capitalize the first letter of each sentence
  cleaned = cleaned.replace(
    /(^|[.!?]\s+)([a-z])/g,
    (_, before: string, ch: string) => before + ch.toUpperCase()
  );

  return { cleanedNote: cleaned, removed };
}
