export type SortField =
  | 'name'
  | 'revenue'
  | 'founded_year'
  | 'company_type'
  | 'size'
  | 'country'
  | 'net_income';

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

export interface FilterState {
  industries: string[];
  revenueRange: [number, number];
  sizes: string[];
  companyType: string | null;
}
