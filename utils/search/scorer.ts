import { CompanyRecord } from '@/types/company';
import { Token, RangeOperator } from '@/types/search';

/**
 * Scores a company against all search tokens using AND logic.
 * Returns 0 immediately if any single token fails to match (early exit).
 *
 * Time complexity: O(T * F) where T = token count, F = searchable fields per company.
 * Fuzzy matching adds O(W * M * N) per field where W = words, M/N = term/word lengths.
 */
export function scoreCompany(record: CompanyRecord, tokens: Token[]): number {
  let total = 0;

  for (const token of tokens) {
    const tokenScore = scoreToken(record, token);
    if (tokenScore === 0) return 0; // AND logic: early exit on first miss
    total += tokenScore;
  }

  return total;
}

function scoreToken(record: CompanyRecord, token: Token): number {
  switch (token.type) {
    case 'exact_match':
      return scoreExactMatch(record, token.value);
    case 'free_text':
      return scoreFreeText(record, token.value);
    case 'field_match':
      return scoreFieldMatch(record, token.field, token.value);
    case 'range_query':
      return scoreRangeQuery(record, token.field, token.operator, token.value);
  }
}

/**
 * Returns all searchable string fields for a company record.
 * Fields are returned in priority order (name first) so higher-value
 * matches are found earlier in the loop.
 */
function getSearchableFields(record: CompanyRecord): string[] {
  const fields = [
    record.name,
    record.industry,
    record.country,
    record.ceo_name,
    record.headquarters,
    record.company_type,
    record.size,
    String(record.founded_year),
  ];

  if (record.stock_info) {
    fields.push(record.stock_info.ticker, record.stock_info.exchange);
  }

  return fields;
}

function scoreExactMatch(record: CompanyRecord, phrase: string): number {
  const lower = phrase.toLowerCase();
  const fields = getSearchableFields(record);

  for (const field of fields) {
    if (field.toLowerCase().includes(lower)) {
      return 100;
    }
  }

  return 0;
}

/**
 * Multi-strategy free text scoring with early exit on best possible score.
 * Strategies are checked in descending score order so we can break early.
 *
 * Scoring tiers:
 *   100 - Exact field value match
 *    75 - Field starts with term (prefix)
 *    70 - Any word in field starts with term
 *    50 - Field contains term (substring)
 *    25 - Fuzzy match (Levenshtein distance within threshold)
 */
function scoreFreeText(record: CompanyRecord, term: string): number {
  const lower = term.toLowerCase();
  const fields = getSearchableFields(record);
  let best = 0;

  for (const field of fields) {
    const fieldLower = field.toLowerCase();

    // Exact field value match
    if (fieldLower === lower) return 100; // Can't do better — exit immediately

    // Prefix match (field starts with term)
    if (fieldLower.startsWith(lower)) {
      best = Math.max(best, 75);
      if (best >= 75) continue; // Skip lower-scoring checks for this field
    }

    // Word-level prefix (any word in the field starts with term)
    const words = fieldLower.split(/[\s,]+/);
    if (best < 70 && words.some((w) => w.startsWith(lower))) {
      best = 70;
      continue;
    }

    // Substring match
    if (best < 50 && fieldLower.includes(lower)) {
      best = 50;
      continue;
    }

    // Fuzzy match: scale max distance by term length to avoid false positives
    // Short terms (3-5 chars): distance 1 only (prevents "ama" matching "bmw")
    // Medium terms (6-12 chars): distance 2 (handles real typos like "Amazom")
    if (best < 25 && lower.length >= 3 && lower.length <= 12) {
      const maxDist = lower.length <= 5 ? 1 : 2;
      for (const word of words) {
        // Skip words with very different lengths — Levenshtein can't help
        if (Math.abs(word.length - lower.length) > maxDist) continue;
        if (levenshtein(word, lower) <= maxDist) {
          best = 25;
          break;
        }
      }
    }
  }

  return best;
}

/**
 * Resolves a field name to its value on a CompanyRecord.
 * Financial fields (revenue, net_income) use the most recent year.
 * Financials are assumed to be ordered by year descending (index 0 = latest).
 */
function getFieldValue(record: CompanyRecord, field: string): string | number | null {
  const latestFinancial = record.financials[0] ?? null;

  switch (field) {
    case 'name':
      return record.name;
    case 'country':
      return record.country;
    case 'industry':
      return record.industry;
    case 'founded_year':
      return record.founded_year;
    case 'company_type':
      return record.company_type;
    case 'size':
      return record.size;
    case 'ceo_name':
      return record.ceo_name;
    case 'headquarters':
      return record.headquarters;
    case 'revenue':
      return latestFinancial?.revenue ?? null;
    case 'net_income':
      return latestFinancial?.net_income ?? null;
    case 'ticker':
      return record.stock_info?.ticker ?? null;
    default:
      return null;
  }
}

function scoreFieldMatch(record: CompanyRecord, field: string, value: string): number {
  const fieldValue = getFieldValue(record, field);
  if (fieldValue === null) return 0;

  const fieldStr = String(fieldValue).toLowerCase();
  const valueStr = value.toLowerCase();

  if (fieldStr === valueStr) return 80;
  if (fieldStr.includes(valueStr)) return 60;

  return 0;
}

function scoreRangeQuery(
  record: CompanyRecord,
  field: string,
  operator: RangeOperator,
  value: number
): number {
  const fieldValue = getFieldValue(record, field);
  if (fieldValue === null) return 0;

  const num = typeof fieldValue === 'number' ? fieldValue : Number(fieldValue);
  if (Number.isNaN(num)) return 0;

  return compareNumeric(num, operator, value) ? 80 : 0;
}

function compareNumeric(actual: number, operator: RangeOperator, target: number): boolean {
  switch (operator) {
    case '>':
      return actual > target;
    case '<':
      return actual < target;
    case '>=':
      return actual >= target;
    case '<=':
      return actual <= target;
  }
}

/**
 * Levenshtein edit distance between two strings.
 * Time: O(m * n), Space: O(n) using single-row optimization.
 *
 * Uses early termination: if the minimum possible distance (based on
 * length difference) exceeds the caller's threshold, the caller should
 * skip this call entirely (see length-difference check in scoreFreeText).
 */
export function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;

  if (m === 0) return n;
  if (n === 0) return m;
  if (a === b) return 0;

  // Ensure we iterate over the shorter string in the inner loop
  if (m < n) return levenshtein(b, a);

  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  let curr = new Array<number>(n + 1);

  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(
        prev[j] + 1,     // deletion
        curr[j - 1] + 1, // insertion
        prev[j - 1] + cost // substitution
      );
    }
    [prev, curr] = [curr, prev];
  }

  return prev[n];
}
