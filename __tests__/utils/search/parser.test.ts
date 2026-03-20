import { parse } from '@/utils/search/parser';
import { Token } from '@/types/search';

describe('parser', () => {
  it('passes through free text tokens unchanged', () => {
    const tokens: Token[] = [{ type: 'free_text', value: 'cloud' }];
    const query = parse(tokens);
    expect(query.tokens).toEqual(tokens);
  });

  it('passes through exact match tokens unchanged', () => {
    const tokens: Token[] = [{ type: 'exact_match', value: 'Amazon' }];
    const query = parse(tokens);
    expect(query.tokens).toEqual(tokens);
  });

  it('validates known field names for field match', () => {
    const tokens: Token[] = [{ type: 'field_match', field: 'industry', value: 'Tech' }];
    const query = parse(tokens);
    expect(query.tokens).toHaveLength(1);
    expect(query.tokens[0]).toEqual({ type: 'field_match', field: 'industry', value: 'Tech' });
  });

  it('drops unknown field names in field match', () => {
    const tokens: Token[] = [{ type: 'field_match', field: 'unknown_field', value: 'test' }];
    const query = parse(tokens);
    expect(query.tokens).toHaveLength(0);
  });

  it('validates known field names for range query', () => {
    const tokens: Token[] = [
      { type: 'range_query', field: 'revenue', operator: '>', value: 5000000 },
    ];
    const query = parse(tokens);
    expect(query.tokens).toHaveLength(1);
  });

  it('drops unknown field names in range query', () => {
    const tokens: Token[] = [
      { type: 'range_query', field: 'unknown', operator: '>', value: 100 },
    ];
    const query = parse(tokens);
    expect(query.tokens).toHaveLength(0);
  });

  it('handles empty token array', () => {
    const query = parse([]);
    expect(query.tokens).toEqual([]);
  });

  it('handles mixed valid and invalid tokens', () => {
    const tokens: Token[] = [
      { type: 'free_text', value: 'cloud' },
      { type: 'field_match', field: 'bogus', value: 'test' },
      { type: 'field_match', field: 'country', value: 'USA' },
    ];
    const query = parse(tokens);
    expect(query.tokens).toHaveLength(2);
    expect(query.tokens[0].type).toBe('free_text');
    expect(query.tokens[1].type).toBe('field_match');
  });
});
