import { CompanyRecord } from './company';

export interface FreeTextToken {
  type: 'free_text';
  value: string;
}

export interface ExactMatchToken {
  type: 'exact_match';
  value: string;
}

export interface FieldMatchToken {
  type: 'field_match';
  field: string;
  value: string;
}

export type RangeOperator = '>' | '<' | '>=' | '<=';

export interface RangeQueryToken {
  type: 'range_query';
  field: string;
  operator: RangeOperator;
  value: number;
}

export type Token = FreeTextToken | ExactMatchToken | FieldMatchToken | RangeQueryToken;

export interface SearchQuery {
  tokens: Token[];
}

export interface ScoredResult {
  record: CompanyRecord;
  score: number;
}
