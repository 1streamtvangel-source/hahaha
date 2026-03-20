import { CompanyRecord, CompanySize } from '@/types/company';
import { SortField } from '@/types/filters';

type Comparator = (a: CompanyRecord, b: CompanyRecord) => number;

const SIZE_ORDER: Record<CompanySize, number> = {
  Small: 0,
  Medium: 1,
  Large: 2,
};

function getLatestRevenue(record: CompanyRecord): number {
  return record.financials[0]?.revenue ?? 0;
}

function getLatestNetIncome(record: CompanyRecord): number {
  return record.financials[0]?.net_income ?? 0;
}

export function getComparator(field: SortField): Comparator {
  switch (field) {
    case 'name':
      return (a, b) => a.name.localeCompare(b.name);

    case 'country':
      return (a, b) => a.country.localeCompare(b.country);

    case 'revenue':
      return (a, b) => getLatestRevenue(a) - getLatestRevenue(b);

    case 'net_income':
      return (a, b) => getLatestNetIncome(a) - getLatestNetIncome(b);

    case 'founded_year':
      return (a, b) => a.founded_year - b.founded_year;

    case 'company_type':
      return (a, b) => a.company_type.localeCompare(b.company_type);

    case 'size':
      return (a, b) => SIZE_ORDER[a.size] - SIZE_ORDER[b.size];
  }
}
