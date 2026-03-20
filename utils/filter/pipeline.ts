import { CompanyRecord } from '@/types/company';
import { FilterState, SortConfig } from '@/types/filters';
import { search } from '@/utils/search/engine';
import { sortCompanies } from '@/utils/sort/sort';
import {
  filterByIndustry,
  filterByRevenueRange,
  filterBySize,
  filterByCompanyType,
} from './filters';

export function processCompanies(
  companies: CompanyRecord[],
  query: string,
  filters: FilterState,
  sortConfig: SortConfig
): CompanyRecord[] {
  // Step 1: Search (returns scored results or all companies)
  const searchResults = search(query, companies);
  let results = searchResults.map((r) => r.record);

  // If there's an active search with scores, preserve search ranking
  const hasActiveSearch =
    query.trim().length >= 3 && searchResults.some((r) => r.score > 0);

  // Step 2: Apply filters (AND with search results)
  const predicates = [
    filterByIndustry(filters.industries),
    filterByRevenueRange(filters.revenueRange[0], filters.revenueRange[1]),
    filterBySize(filters.sizes),
    filterByCompanyType(filters.companyType),
  ];

  results = results.filter((record) => predicates.every((pred) => pred(record)));

  // Step 3: Sort (only override search ranking when no active search)
  if (!hasActiveSearch) {
    results = sortCompanies(results, sortConfig);
  }

  return results;
}
