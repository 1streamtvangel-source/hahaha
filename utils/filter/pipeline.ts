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
import { tokenize } from '@/utils/search/tokenizer';

/**
 * Strips field-match tokens from the query that duplicate an active filter,
 * so the user doesn't get zero results from conflicting constraints.
 * e.g., if filters have industry=["Technology"], remove `industry:Tech` from the query.
 */
function stripRedundantFieldTokens(query: string, filters: FilterState): string {
  const tokens = tokenize(query);
  if (tokens.length === 0) return query;

  const hasIndustryFilter = filters.industries.length > 0;
  const hasSizeFilter = filters.sizes.length > 0;
  const hasTypeFilter = filters.companyType !== null;

  // Rebuild query without field tokens that conflict with active filters
  const kept: string[] = [];
  for (const token of tokens) {
    if (token.type === 'field_match') {
      const field = token.field.toLowerCase();
      if (field === 'industry' && hasIndustryFilter) continue;
      if (field === 'size' && hasSizeFilter) continue;
      if (field === 'company_type' && hasTypeFilter) continue;
    }
    // Reconstruct original token text
    switch (token.type) {
      case 'free_text':
        kept.push(token.value);
        break;
      case 'exact_match':
        kept.push(`"${token.value}"`);
        break;
      case 'field_match':
        kept.push(`${token.field}:${token.value}`);
        break;
      case 'range_query':
        kept.push(`${token.field}${token.operator}${token.value}`);
        break;
    }
  }

  return kept.join(' ');
}

export function processCompanies(
  companies: CompanyRecord[],
  query: string,
  filters: FilterState,
  sortConfig: SortConfig
): CompanyRecord[] {
  // Strip search tokens that duplicate active filters to avoid conflicts
  const effectiveQuery = stripRedundantFieldTokens(query, filters);

  // Step 1: Search (returns scored results or all companies)
  const searchResults = search(effectiveQuery, companies);
  let results = searchResults.map((r) => r.record);

  // If there's an active search with scores, preserve search ranking
  const hasActiveSearch =
    effectiveQuery.trim().length >= 3 && searchResults.some((r) => r.score > 0);

  // Step 2: Apply filters
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
