import { getComparator } from '@/utils/sort/comparators';
import { CompanyRecord } from '@/types/company';

const makeCompany = (overrides: Partial<CompanyRecord>): CompanyRecord => ({
  id: 'test',
  name: 'Test',
  country: 'US',
  industry: 'Tech',
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

describe('comparators', () => {
  describe('name comparator', () => {
    it('sorts alphabetically', () => {
      const a = makeCompany({ name: 'Amazon' });
      const b = makeCompany({ name: 'Stripe' });
      const compare = getComparator('name');
      expect(compare(a, b)).toBeLessThan(0);
      expect(compare(b, a)).toBeGreaterThan(0);
    });

    it('returns 0 for same name', () => {
      const a = makeCompany({ name: 'Amazon' });
      const b = makeCompany({ name: 'Amazon' });
      expect(getComparator('name')(a, b)).toBe(0);
    });
  });

  describe('revenue comparator', () => {
    it('sorts by latest revenue', () => {
      const a = makeCompany({ financials: [{ year: 2023, revenue: 100, net_income: 10 }] });
      const b = makeCompany({ financials: [{ year: 2023, revenue: 500, net_income: 50 }] });
      const compare = getComparator('revenue');
      expect(compare(a, b)).toBeLessThan(0);
    });
  });

  describe('founded_year comparator', () => {
    it('sorts older companies first in ascending', () => {
      const a = makeCompany({ founded_year: 1990 });
      const b = makeCompany({ founded_year: 2020 });
      const compare = getComparator('founded_year');
      expect(compare(a, b)).toBeLessThan(0);
    });
  });

  describe('size comparator', () => {
    it('sorts Small < Medium < Large', () => {
      const small = makeCompany({ size: 'Small' });
      const medium = makeCompany({ size: 'Medium' });
      const large = makeCompany({ size: 'Large' });
      const compare = getComparator('size');

      expect(compare(small, medium)).toBeLessThan(0);
      expect(compare(medium, large)).toBeLessThan(0);
      expect(compare(small, large)).toBeLessThan(0);
    });
  });

  describe('country comparator', () => {
    it('sorts alphabetically', () => {
      const a = makeCompany({ country: 'Germany' });
      const b = makeCompany({ country: 'United States' });
      const compare = getComparator('country');
      expect(compare(a, b)).toBeLessThan(0);
    });
  });
});
