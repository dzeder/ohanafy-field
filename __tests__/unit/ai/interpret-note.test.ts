import { interpretNote } from '@/ai/tools/interpret-note';

describe('interpretNote', () => {
  it('removes filler words (um, uh, like, you know)', () => {
    const result = interpretNote({
      rawTranscript: 'um the lager tap is uh kind of intermittent like you know',
    });
    expect(result.cleanedNote).not.toMatch(/\b(um|uh|like|you know|kind of)\b/i);
    expect(result.removed.length).toBeGreaterThan(0);
  });

  it('preserves product names and specifics', () => {
    const result = interpretNote({
      rawTranscript: 'um marcus said the yellowhammer pale ale needs a deeper discount this week',
    });
    expect(result.cleanedNote.toLowerCase()).toContain('marcus');
    expect(result.cleanedNote.toLowerCase()).toContain('yellowhammer pale ale');
    expect(result.cleanedNote.toLowerCase()).toContain('discount');
  });

  it('capitalizes sentence starts', () => {
    const result = interpretNote({
      rawTranscript: 'check the cooler position. confirm reorder for friday',
    });
    expect(result.cleanedNote).toMatch(/^Check/);
    expect(result.cleanedNote).toContain('Confirm');
  });

  it('collapses runs of punctuation and excess whitespace', () => {
    const result = interpretNote({
      rawTranscript: 'tap   issue....  needs flushing!!',
    });
    expect(result.cleanedNote).not.toMatch(/\.{2,}|\s{2,}|!{2,}/);
  });

  it('returns empty cleaned text for transcript that is all filler', () => {
    const result = interpretNote({
      rawTranscript: 'um uh like you know',
    });
    expect(result.cleanedNote.trim()).toBe('');
  });
});
