import { GUIDE_SECTIONS, searchGuide } from '@/data/user-guide';

describe('user guide', () => {
  it('contains all 7 sections', () => {
    expect(GUIDE_SECTIONS).toHaveLength(7);
  });

  it('every section has id, title, and non-empty body', () => {
    for (const section of GUIDE_SECTIONS) {
      expect(section.id).toMatch(/^[a-z-]+$/);
      expect(section.title.length).toBeGreaterThan(0);
      expect(section.body.length).toBeGreaterThan(50);
    }
  });
});

describe('searchGuide', () => {
  it('returns empty for empty query', () => {
    expect(searchGuide('')).toEqual([]);
    expect(searchGuide('   ')).toEqual([]);
  });

  it('finds the voice section when searching "voice"', () => {
    const hits = searchGuide('voice');
    const ids = hits.map((h) => h.section.id);
    expect(ids).toContain('voice-commands');
  });

  it('returns case-insensitive matches', () => {
    expect(searchGuide('SYNC').length).toBeGreaterThan(0);
    expect(searchGuide('sync').length).toBeGreaterThan(0);
  });

  it('caps matches per section to keep results readable', () => {
    const hits = searchGuide('the');
    for (const hit of hits) {
      expect(hit.matches.length).toBeLessThanOrEqual(3);
    }
  });

  it('returns no hits for a phrase that does not appear', () => {
    expect(searchGuide('helicopter')).toEqual([]);
  });
});
