import { useMemo } from 'react';
import { useSearchContext, defaultFilters } from '@/context/search-context';
import { useDebouncedValue } from './use-debounced-value';
import { processCompanies } from '@/utils/filter/pipeline';
import { companies } from '@/data/companies';
import { CompanyRecord } from '@/types/company';

interface UseCompanySearchResult {
  results: CompanyRecord[];
  totalCount: number;
  resultCount: number;
  isSearching: boolean;
  query: string;
  hasActiveSearch: boolean;
  hasActiveFilters: boolean;
}

export function useCompanySearch(): UseCompanySearchResult {
  const { state } = useSearchContext();
  const { query, filters, sortConfig } = state;

  const debouncedQuery = useDebouncedValue(query, 300);
  const isSearching = query !== debouncedQuery;

  const results = useMemo(
    () => processCompanies(companies, debouncedQuery, filters, sortConfig),
    [debouncedQuery, filters, sortConfig]
  );

  const hasActiveSearch = debouncedQuery.trim().length >= 3;
  const hasActiveFilters =
    filters.industries.length > 0 ||
    filters.sizes.length > 0 ||
    filters.companyType !== null ||
    filters.revenueRange[0] !== defaultFilters.revenueRange[0] ||
    filters.revenueRange[1] !== defaultFilters.revenueRange[1];

  return {
    results,
    totalCount: companies.length,
    resultCount: results.length,
    isSearching,
    query: debouncedQuery,
    hasActiveSearch,
    hasActiveFilters,
  };
}
