import {
  filterByIndustry,
  filterByRevenueRange,
  filterBySize,
  filterByCompanyType,
} from '@/utils/filter/filters';
import { CompanyRecord } from '@/types/company';

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

describe('filterByIndustry', () => {
  it('returns true for matching industry', () => {
    const pred = filterByIndustry(['Technology']);
    expect(pred(makeCompany({ industry: 'Technology' }))).toBe(true);
  });

  it('returns false for non-matching industry', () => {
    const pred = filterByIndustry(['Finance']);
    expect(pred(makeCompany({ industry: 'Technology' }))).toBe(false);
  });

  it('returns true for any match in array', () => {
    const pred = filterByIndustry(['Finance', 'Technology']);
    expect(pred(makeCompany({ industry: 'Technology' }))).toBe(true);
  });

  it('returns true when filter is empty (no filter)', () => {
    const pred = filterByIndustry([]);
    expect(pred(makeCompany({}))).toBe(true);
  });
});

describe('filterByRevenueRange', () => {
  it('returns true when revenue is in range', () => {
    const pred = filterByRevenueRange(500000, 2000000);
    expect(pred(makeCompany({}))).toBe(true);
  });

  it('returns false when revenue is below range', () => {
    const pred = filterByRevenueRange(2000000, 5000000);
    expect(pred(makeCompany({}))).toBe(false);
  });

  it('returns true at exact boundaries', () => {
    const pred = filterByRevenueRange(1000000, 1000000);
    expect(pred(makeCompany({}))).toBe(true);
  });
});

describe('filterBySize', () => {
  it('returns true for matching size', () => {
    const pred = filterBySize(['Medium']);
    expect(pred(makeCompany({ size: 'Medium' }))).toBe(true);
  });

  it('returns false for non-matching size', () => {
    const pred = filterBySize(['Large']);
    expect(pred(makeCompany({ size: 'Small' }))).toBe(false);
  });

  it('returns true when filter is empty', () => {
    const pred = filterBySize([]);
    expect(pred(makeCompany({}))).toBe(true);
  });
});

describe('filterByCompanyType', () => {
  it('returns true for matching type', () => {
    const pred = filterByCompanyType('Public');
    expect(pred(makeCompany({ company_type: 'Public' }))).toBe(true);
  });

  it('returns false for non-matching type', () => {
    const pred = filterByCompanyType('Private');
    expect(pred(makeCompany({ company_type: 'Public' }))).toBe(false);
  });

  it('returns true when filter is null', () => {
    const pred = filterByCompanyType(null);
    expect(pred(makeCompany({}))).toBe(true);
  });
});
