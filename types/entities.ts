export interface BoardMember {
  id: string;
  name: string;
  role: string;
  since_year: number;
}

export interface StockInfo {
  ticker: string;
  exchange: string;
  market_cap: number;
  stock_price: number;
}

export type OfficeType = 'Headquarters' | 'Regional' | 'Engineering' | 'Sales';

export interface Office {
  id: string;
  city: string;
  country: string;
  type: OfficeType;
  employee_count: number;
}
