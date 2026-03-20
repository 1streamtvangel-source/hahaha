import { processCompanies } from '@/utils/filter/pipeline';
import { CompanyRecord } from '@/types/company';
import { FilterState, SortConfig } from '@/types/filters';

const makeCompany = (overrides: Partial<CompanyRecord>): CompanyRecord => ({
  id: 'test',
  name: 'Test',
  country: 'US',
  industry: 'Technology',
  founded_year: 2000,
  company_type: 'Public',
  size: 'Medium',
  ceo_name: 'CEO',
  headquarters: 'NYC',
  financials: [{ year: 2023, revenue: 1000000, net_income: 100000 }],
  board_members: [],
  stock_info: null,
  offices: [],
  ...overrides,
});

const defaultFilters: FilterState = {
  industries: [],
  revenueRange: [0, Infinity],
  sizes: [],
  companyType: null,
};

const defaultSort: SortConfig = { field: 'name', direction: 'asc' };

const fixtures: CompanyRecord[] = [
  makeCompany({
    id: '1',
    name: 'Amazon',
    industry: 'Technology',
    size: 'Large',
    company_type: 'Public',
    financials: [{ year: 2023, revenue: 574800000000, net_income: 30400000000 }],
  }),
  makeCompany({
    id: '2',
    name: 'Stripe',
    industry: 'Technology',
    size: 'Large',
    company_type: 'Private',
    financials: [{ year: 2023, revenue: 16000000000, net_income: 600000000 }],
  }),
  makeCompany({
    id: '3',
    name: 'JPMorgan Chase',
    industry: 'Finance',
    size: 'Large',
    company_type: 'Public',
    financials: [{ year: 2023, revenue: 158100000000, net_income: 49600000000 }],
  }),
  makeCompany({
    id: '4',
    name: 'Revolut',
    industry: 'Finance',
    size: 'Medium',
    company_type: 'Private',
    financials: [{ year: 2023, revenue: 2200000000, net_income: 430000000 }],
  }),
];

describe('pipeline', () => {
  it('returns all companies sorted when no search or filter', () => {
    const results = processCompanies(fixtures, '', defaultFilters, defaultSort);
    expect(results).toHaveLength(4);
    expect(results[0].name).toBe('Amazon');
    expect(results[3].name).toBe('Stripe');
  });

  it('filters by industry', () => {
    const filters = { ...defaultFilters, industries: ['Finance'] };
    const results = processCompanies(fixtures, '', filters, defaultSort);
    expect(results).toHaveLength(2);
    expect(results.every((r) => r.industry === 'Finance')).toBe(true);
  });

  it('filters by company type', () => {
    const filters = { ...defaultFilters, companyType: 'Private' };
    const results = processCompanies(fixtures, '', filters, defaultSort);
    expect(results).toHaveLength(2);
    expect(results.every((r) => r.company_type === 'Private')).toBe(true);
  });

  it('filters by size', () => {
    const filters = { ...defaultFilters, sizes: ['Medium'] };
    const results = processCompanies(fixtures, '', filters, defaultSort);
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe('Revolut');
  });

  it('filters by revenue range', () => {
    const filters: FilterState = {
      ...defaultFilters,
      revenueRange: [100000000000, Infinity],
    };
    const results = processCompanies(fixtures, '', filters, defaultSort);
    expect(results).toHaveLength(2);
  });

  it('combines search with filters', () => {
    const filters = { ...defaultFilters, industries: ['Technology'] };
    const results = processCompanies(fixtures, 'Amazon', filters, defaultSort);
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe('Amazon');
  });

  it('applies sort in descending order', () => {
    const sort: SortConfig = { field: 'name', direction: 'desc' };
    const results = processCompanies(fixtures, '', defaultFilters, sort);
    expect(results[0].name).toBe('Stripe');
    expect(results[3].name).toBe('Amazon');
  });

  it('returns empty array when no companies match', () => {
    const filters = { ...defaultFilters, industries: ['Aerospace'] };
    const results = processCompanies(fixtures, '', filters, defaultSort);
    expect(results).toHaveLength(0);
  });
});
