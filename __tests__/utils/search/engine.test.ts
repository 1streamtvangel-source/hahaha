import { search } from '@/utils/search/engine';
import { CompanyRecord } from '@/types/company';

const fixtures: CompanyRecord[] = [
  {
    id: '1',
    name: 'Amazon',
    country: 'United States',
    industry: 'Technology',
    founded_year: 1994,
    company_type: 'Public',
    size: 'Large',
    ceo_name: 'Andy Jassy',
    headquarters: 'Seattle, WA',
    financials: [{ year: 2023, revenue: 574800000000, net_income: 30400000000 }],
    board_members: [],
    stock_info: { ticker: 'AMZN', exchange: 'NASDAQ', market_cap: 1890000000000, stock_price: 185.6 },
    offices: [],
  },
  {
    id: '2',
    name: 'Stripe',
    country: 'United States',
    industry: 'Technology',
    founded_year: 2010,
    company_type: 'Private',
    size: 'Large',
    ceo_name: 'Patrick Collison',
    headquarters: 'San Francisco, CA',
    financials: [{ year: 2023, revenue: 16000000000, net_income: 600000000 }],
    board_members: [],
    stock_info: null,
    offices: [],
  },
  {
    id: '3',
    name: 'JPMorgan Chase',
    country: 'United States',
    industry: 'Finance',
    founded_year: 2000,
    company_type: 'Public',
    size: 'Large',
    ceo_name: 'Jamie Dimon',
    headquarters: 'New York, NY',
    financials: [{ year: 2023, revenue: 158100000000, net_income: 49600000000 }],
    board_members: [],
    stock_info: { ticker: 'JPM', exchange: 'NYSE', market_cap: 570000000000, stock_price: 198.3 },
    offices: [],
  },
];

describe('search engine', () => {
  it('returns all companies for short queries (< 3 chars)', () => {
    expect(search('a', fixtures)).toHaveLength(3);
    expect(search('ab', fixtures)).toHaveLength(3);
    expect(search('ab', fixtures).every((r) => r.score === 0)).toBe(true);
  });

  it('returns all companies for empty query', () => {
    const results = search('', fixtures);
    expect(results).toHaveLength(3);
  });

  it('finds companies by name', () => {
    const results = search('Amazon', fixtures);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].record.name).toBe('Amazon');
    expect(results[0].score).toBeGreaterThan(0);
  });

  it('finds companies by industry field match', () => {
    const results = search('industry:Finance', fixtures);
    expect(results).toHaveLength(1);
    expect(results[0].record.name).toBe('JPMorgan Chase');
  });

  it('finds companies by revenue range', () => {
    const results = search('revenue>500000000000', fixtures);
    expect(results).toHaveLength(1);
    expect(results[0].record.name).toBe('Amazon');
  });

  it('returns no results for impossible query', () => {
    const results = search('XYZNONEXISTENT', fixtures);
    expect(results).toHaveLength(0);
  });

  it('supports exact phrase match', () => {
    const results = search('"JPMorgan Chase"', fixtures);
    expect(results).toHaveLength(1);
    expect(results[0].record.name).toBe('JPMorgan Chase');
  });

  it('ranks better matches higher', () => {
    // "Stripe" should score higher for "Stripe" than anything else
    const results = search('Stripe', fixtures);
    expect(results[0].record.name).toBe('Stripe');
  });

  it('supports combined query with AND logic', () => {
    const results = search('industry:Technology company_type:Private', fixtures);
    expect(results).toHaveLength(1);
    expect(results[0].record.name).toBe('Stripe');
  });
});
