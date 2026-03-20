import { CompanyRecord } from '@/types/company';

type Predicate = (record: CompanyRecord) => boolean;

/**
 * Factory functions that return predicate closures.
 * Each predicate is O(1) per record due to Set-based lookups.
 * Empty/null filter values produce pass-all predicates (no allocation per call).
 */

export function filterByIndustry(industries: string[]): Predicate {
  if (industries.length === 0) return () => true;
  const set = new Set(industries.map((i) => i.toLowerCase()));
  return (record) => set.has(record.industry.toLowerCase());
}

export function filterByRevenueRange(min: number, max: number): Predicate {
  // Default range [0, Infinity] passes everything including companies without financials
  if (min === 0 && max === Infinity) return () => true;
  return (record) => {
    const latest = record.financials[0];
    if (!latest) return false; // No financial data and specific range requested
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
