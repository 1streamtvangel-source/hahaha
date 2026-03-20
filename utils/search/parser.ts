import { Token, SearchQuery } from '@/types/search';

const FIELD_MAP: Record<string, string> = {
  name: 'name',
  country: 'country',
  industry: 'industry',
  founded_year: 'founded_year',
  company_type: 'company_type',
  size: 'size',
  ceo_name: 'ceo_name',
  headquarters: 'headquarters',
  revenue: 'revenue',
  net_income: 'net_income',
  ticker: 'ticker',
};

export function parse(tokens: Token[]): SearchQuery {
  const validTokens: Token[] = [];

  for (const token of tokens) {
    switch (token.type) {
      case 'free_text':
      case 'exact_match':
        validTokens.push(token);
        break;

      case 'field_match': {
        const mapped = FIELD_MAP[token.field];
        if (mapped) {
          validTokens.push({ ...token, field: mapped });
        }
        // Unknown fields are silently dropped
        break;
      }

      case 'range_query': {
        const mapped = FIELD_MAP[token.field];
        if (mapped && !isNaN(token.value)) {
          validTokens.push({ ...token, field: mapped });
        }
        break;
      }
    }
  }

  return { tokens: validTokens };
}
