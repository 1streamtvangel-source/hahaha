import { CompanyRecord } from '@/types/company';
import { ScoredResult } from '@/types/search';
import { tokenize } from './tokenizer';
import { parse } from './parser';
import { scoreCompany } from './scorer';

const MIN_QUERY_LENGTH = 3;

export function search(query: string, companies: CompanyRecord[]): ScoredResult[] {
  const trimmed = query.trim();

  if (trimmed.length < MIN_QUERY_LENGTH) {
    return companies.map((record) => ({ record, score: 0 }));
  }

  const tokens = tokenize(trimmed);
  if (tokens.length === 0) {
    return companies.map((record) => ({ record, score: 0 }));
  }

  const searchQuery = parse(tokens);
  if (searchQuery.tokens.length === 0) {
    return companies.map((record) => ({ record, score: 0 }));
  }

  const results: ScoredResult[] = [];

  for (const record of companies) {
    const score = scoreCompany(record, searchQuery.tokens);
    if (score > 0) {
      results.push({ record, score });
    }
  }

  // Sort by score descending, then by name for stable ordering
  results.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.record.name.localeCompare(b.record.name);
  });

  return results;
}
