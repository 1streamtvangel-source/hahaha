import { CompanyRecord } from '@/types/company';
import { SortConfig } from '@/types/filters';
import { getComparator } from './comparators';

export function sortCompanies(
  companies: CompanyRecord[],
  config: SortConfig
): CompanyRecord[] {
  const comparator = getComparator(config.field);
  const directionMultiplier = config.direction === 'asc' ? 1 : -1;

  return [...companies].sort((a, b) => comparator(a, b) * directionMultiplier);
}
