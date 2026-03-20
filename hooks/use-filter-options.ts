import { useMemo } from 'react';
import { companies } from '@/data/companies';

interface FilterOptions {
  industries: string[];
  sizes: string[];
  companyTypes: string[];
  revenueMin: number;
  revenueMax: number;
  countries: string[];
}

export function useFilterOptions(): FilterOptions {
  return useMemo(() => {
    const industries = new Set<string>();
    const sizes = new Set<string>();
    const companyTypes = new Set<string>();
    const countries = new Set<string>();
    let revenueMin = Infinity;
    let revenueMax = -Infinity;

    for (const company of companies) {
      industries.add(company.industry);
      sizes.add(company.size);
      companyTypes.add(company.company_type);
      countries.add(company.country);

      const latest = company.financials[0];
      if (latest) {
        revenueMin = Math.min(revenueMin, latest.revenue);
        revenueMax = Math.max(revenueMax, latest.revenue);
      }
    }

    return {
      industries: [...industries].sort(),
      sizes: ['Small', 'Medium', 'Large'],
      companyTypes: [...companyTypes].sort(),
      revenueMin: revenueMin === Infinity ? 0 : revenueMin,
      revenueMax: revenueMax === -Infinity ? 0 : revenueMax,
      countries: [...countries].sort(),
    };
  }, []);
}
