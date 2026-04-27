import { interpretNote, type InterpretNoteOutput } from '@/ai/tools/interpret-note';

// Day 3 note agent: deterministic-only path. Day 4 layers a Claude call on top
// to summarize long transcripts. For Day 3 this is just the cleaning tool;
// keeping it as a discrete agent keeps the call site shape stable.
export function cleanNote(rawTranscript: string): InterpretNoteOutput {
  return interpretNote({ rawTranscript });
}
