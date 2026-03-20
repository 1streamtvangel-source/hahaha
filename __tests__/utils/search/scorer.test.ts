import { scoreCompany, levenshtein } from '@/utils/search/scorer';
import { CompanyRecord } from '@/types/company';
import { Token } from '@/types/search';

const mockCompany: CompanyRecord = {
  id: 'test-1',
  name: 'Amazon',
  country: 'United States',
  industry: 'Technology',
  founded_year: 1994,
  company_type: 'Public',
  size: 'Large',
  ceo_name: 'Andy Jassy',
  headquarters: 'Seattle, WA',
  financials: [
    { year: 2023, revenue: 574800000000, net_income: 30400000000 },
  ],
  board_members: [
    { id: 'b1', name: 'Andy Jassy', role: 'CEO', since_year: 2021 },
  ],
  stock_info: { ticker: 'AMZN', exchange: 'NASDAQ', market_cap: 1890000000000, stock_price: 185.6 },
  offices: [
    { id: 'o1', city: 'Seattle', country: 'United States', type: 'Headquarters', employee_count: 75000 },
  ],
};

describe('scorer', () => {
  describe('exact match scoring', () => {
    it('scores 100 for exact match found in field', () => {
      const tokens: Token[] = [{ type: 'exact_match', value: 'Amazon' }];
      expect(scoreCompany(mockCompany, tokens)).toBe(100);
    });

    it('scores 0 when exact match not found', () => {
      const tokens: Token[] = [{ type: 'exact_match', value: 'Microsoft' }];
      expect(scoreCompany(mockCompany, tokens)).toBe(0);
    });
  });

  describe('free text scoring', () => {
    it('scores 100 for exact field value match', () => {
      const tokens: Token[] = [{ type: 'free_text', value: 'Amazon' }];
      expect(scoreCompany(mockCompany, tokens)).toBe(100);
    });

    it('scores 75 for prefix match', () => {
      const tokens: Token[] = [{ type: 'free_text', value: 'Amaz' }];
      expect(scoreCompany(mockCompany, tokens)).toBe(75);
    });

    it('scores 50 for substring match', () => {
      const tokens: Token[] = [{ type: 'free_text', value: 'mazo' }];
      expect(scoreCompany(mockCompany, tokens)).toBe(50);
    });

    it('scores 25 for fuzzy match (Levenshtein ≤ 2)', () => {
      // "Amazom" is distance 1 from "amazon"
      const tokens: Token[] = [{ type: 'free_text', value: 'Amazom' }];
      expect(scoreCompany(mockCompany, tokens)).toBe(25);
    });

    it('scores 0 for no match', () => {
      const tokens: Token[] = [{ type: 'free_text', value: 'ZZZZZZ' }];
      expect(scoreCompany(mockCompany, tokens)).toBe(0);
    });
  });

  describe('field match scoring', () => {
    it('scores 80 for exact field match', () => {
      const tokens: Token[] = [{ type: 'field_match', field: 'industry', value: 'Technology' }];
      expect(scoreCompany(mockCompany, tokens)).toBe(80);
    });

    it('scores 0 for field mismatch', () => {
      const tokens: Token[] = [{ type: 'field_match', field: 'industry', value: 'Finance' }];
      expect(scoreCompany(mockCompany, tokens)).toBe(0);
    });
  });

  describe('range query scoring', () => {
    it('scores 80 when range condition is met', () => {
      const tokens: Token[] = [
        { type: 'range_query', field: 'revenue', operator: '>', value: 100000000000 },
      ];
      expect(scoreCompany(mockCompany, tokens)).toBe(80);
    });

    it('scores 0 when range condition is not met', () => {
      const tokens: Token[] = [
        { type: 'range_query', field: 'revenue', operator: '<', value: 100000000000 },
      ];
      expect(scoreCompany(mockCompany, tokens)).toBe(0);
    });
  });

  describe('AND logic', () => {
    it('returns 0 if any token does not match', () => {
      const tokens: Token[] = [
        { type: 'free_text', value: 'Amazon' }, // matches
        { type: 'field_match', field: 'industry', value: 'Finance' }, // does not match
      ];
      expect(scoreCompany(mockCompany, tokens)).toBe(0);
    });

    it('sums scores when all tokens match', () => {
      const tokens: Token[] = [
        { type: 'free_text', value: 'Amazon' }, // 100
        { type: 'field_match', field: 'industry', value: 'Technology' }, // 80
      ];
      expect(scoreCompany(mockCompany, tokens)).toBe(180);
    });
  });
});

describe('levenshtein', () => {
  it('returns 0 for identical strings', () => {
    expect(levenshtein('amazon', 'amazon')).toBe(0);
  });

  it('returns correct distance for single substitution', () => {
    expect(levenshtein('amazon', 'amazom')).toBe(1);
  });

  it('returns correct distance for insertion', () => {
    expect(levenshtein('amazon', 'amazons')).toBe(1);
  });

  it('returns correct distance for deletion', () => {
    expect(levenshtein('amazon', 'amazo')).toBe(1);
  });

  it('returns length for empty vs non-empty', () => {
    expect(levenshtein('', 'abc')).toBe(3);
    expect(levenshtein('abc', '')).toBe(3);
  });
});
