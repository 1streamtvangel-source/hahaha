import { tokenize } from '@/utils/search/tokenizer';

describe('tokenizer', () => {
  it('returns empty array for empty input', () => {
    expect(tokenize('')).toEqual([]);
  });

  it('returns empty array for whitespace-only input', () => {
    expect(tokenize('   ')).toEqual([]);
  });

  it('tokenizes a single free text term', () => {
    const tokens = tokenize('cloud');
    expect(tokens).toEqual([{ type: 'free_text', value: 'cloud' }]);
  });

  it('tokenizes multiple free text terms', () => {
    const tokens = tokenize('cloud computing');
    expect(tokens).toHaveLength(2);
    expect(tokens[0]).toEqual({ type: 'free_text', value: 'cloud' });
    expect(tokens[1]).toEqual({ type: 'free_text', value: 'computing' });
  });

  it('tokenizes exact match with double quotes', () => {
    const tokens = tokenize('"Amazon"');
    expect(tokens).toEqual([{ type: 'exact_match', value: 'Amazon' }]);
  });

  it('tokenizes exact match phrase with spaces', () => {
    const tokens = tokenize('"JPMorgan Chase"');
    expect(tokens).toEqual([{ type: 'exact_match', value: 'JPMorgan Chase' }]);
  });

  it('tokenizes field match with colon syntax', () => {
    const tokens = tokenize('industry:Tech');
    expect(tokens).toEqual([{ type: 'field_match', field: 'industry', value: 'Tech' }]);
  });

  it('tokenizes range query with > operator', () => {
    const tokens = tokenize('revenue>5000000');
    expect(tokens).toEqual([
      { type: 'range_query', field: 'revenue', operator: '>', value: 5000000 },
    ]);
  });

  it('tokenizes range query with >= operator', () => {
    const tokens = tokenize('founded_year>=2010');
    expect(tokens).toEqual([
      { type: 'range_query', field: 'founded_year', operator: '>=', value: 2010 },
    ]);
  });

  it('tokenizes range query with < operator', () => {
    const tokens = tokenize('revenue<1000000000');
    expect(tokens).toEqual([
      { type: 'range_query', field: 'revenue', operator: '<', value: 1000000000 },
    ]);
  });

  it('tokenizes range query with <= operator', () => {
    const tokens = tokenize('net_income<=0');
    expect(tokens).toEqual([
      { type: 'range_query', field: 'net_income', operator: '<=', value: 0 },
    ]);
  });

  it('tokenizes mixed query with all token types', () => {
    const tokens = tokenize('"Amazon" industry:Tech founded_year>2010 cloud');
    expect(tokens).toHaveLength(4);
    expect(tokens[0]).toEqual({ type: 'exact_match', value: 'Amazon' });
    expect(tokens[1]).toEqual({ type: 'field_match', field: 'industry', value: 'Tech' });
    expect(tokens[2]).toEqual({
      type: 'range_query',
      field: 'founded_year',
      operator: '>',
      value: 2010,
    });
    expect(tokens[3]).toEqual({ type: 'free_text', value: 'cloud' });
  });

  it('handles unclosed quote as free text', () => {
    const tokens = tokenize('"Amazon');
    expect(tokens).toHaveLength(1);
    expect(tokens[0]).toEqual({ type: 'free_text', value: 'Amazon' });
  });

  it('treats unknown field names as free text', () => {
    const tokens = tokenize('unknown:value');
    expect(tokens).toEqual([{ type: 'free_text', value: 'unknown:value' }]);
  });

  it('handles field match case-insensitively', () => {
    const tokens = tokenize('Industry:Tech');
    expect(tokens).toEqual([{ type: 'field_match', field: 'industry', value: 'Tech' }]);
  });
});
