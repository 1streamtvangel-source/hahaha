import { BoardMember, StockInfo, Office } from './entities';

export interface Company {
  id: string;
  name: string;
  country: string;
  industry: string;
  founded_year: number;
}

export interface FinancialData {
  year: number;
  revenue: number;
  net_income: number;
}

export type CompanyType = 'Public' | 'Private';
export type CompanySize = 'Small' | 'Medium' | 'Large';

export interface CompanyDetails {
  company_type: CompanyType;
  size: CompanySize;
  ceo_name: string;
  headquarters: string;
}

export interface CompanyRecord extends Company, CompanyDetails {
  financials: FinancialData[];
  board_members: BoardMember[];
  stock_info: StockInfo | null;
  offices: Office[];
}
