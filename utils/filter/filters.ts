import { CompanyRecord } from '@/types/company';

type Predicate = (record: CompanyRecord) => boolean;

export function filterByIndustry(industries: string[]): Predicate {
  if (industries.length === 0) return () => true;
  const set = new Set(industries.map((i) => i.toLowerCase()));
  return (record) => set.has(record.industry.toLowerCase());
}

export function filterByRevenueRange(min: number, max: number): Predicate {
  return (record) => {
    const latest = record.financials[0];
    if (!latest) return false;
    return latest.revenue >= min && latest.revenue <= max;
  };
}

export function filterBySize(sizes: string[]): Predicate {
  if (sizes.length === 0) return () => true;
  const set = new Set(sizes.map((s) => s.toLowerCase()));
  return (record) => set.has(record.size.toLowerCase());
}

export function filterByCompanyType(type: string | null): Predicate {
  if (!type) return () => true;
  const lower = type.toLowerCase();
  return (record) => record.company_type.toLowerCase() === lower;
}
