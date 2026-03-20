import { Token, RangeOperator } from '@/types/search';

// Ordered longest-first so >= is checked before >
const RANGE_OPERATORS: RangeOperator[] = ['>=', '<=', '>', '<'];

const KNOWN_FIELDS = new Set([
  'name',
  'country',
  'industry',
  'founded_year',
  'company_type',
  'size',
  'ceo_name',
  'headquarters',
  'revenue',
  'net_income',
  'ticker',
]);

/**
 * Tokenizes a raw search query string into typed tokens.
 * Supports: "exact phrases", field:value, field>=number, and free text.
 * Time: O(n) where n = input length.
 */
export function tokenize(input: string): Token[] {
  const trimmed = input.trim();
  if (!trimmed) return [];

  const tokens: Token[] = [];
  const segments = splitPreservingQuotes(trimmed);

  for (const segment of segments) {
    const token = parseSegment(segment);
    if (token) tokens.push(token);
  }

  return tokens;
}

/**
 * Splits input by whitespace while preserving quoted phrases as single segments.
 * Handles unclosed quotes gracefully by treating them as free text.
 */
function splitPreservingQuotes(input: string): string[] {
  const segments: string[] = [];
  let current = '';
  let inQuote = false;

  for (const char of input) {
    if (char === '"') {
      if (inQuote) {
        current += '"';
        segments.push(current);
        current = '';
        inQuote = false;
      } else {
        if (current.trim()) {
          segments.push(current.trim());
        }
        current = '"';
        inQuote = true;
      }
    } else if (char === ' ' && !inQuote) {
      if (current.trim()) {
        segments.push(current.trim());
      }
      current = '';
    } else {
      current += char;
    }
  }

  if (current.trim()) {
    if (inQuote) {
      // Unclosed quote — treat content as free text
      const text = current.replace(/^"/, '').trim();
      if (text) segments.push(text);
    } else {
      segments.push(current.trim());
    }
  }

  return segments;
}

/**
 * Parses a single segment into a typed Token.
 * Checks in order: exact match → range query → field match → free text.
 */
function parseSegment(segment: string): Token | null {
  // Exact match: "quoted phrase"
  if (segment.startsWith('"') && segment.endsWith('"') && segment.length > 2) {
    const value = segment.slice(1, -1);
    if (!value.trim()) return null;
    return { type: 'exact_match', value };
  }

  // Range query: field>=value, field>value, etc.
  // RANGE_OPERATORS is ordered longest-first so >= matches before >
  for (const op of RANGE_OPERATORS) {
    const idx = segment.indexOf(op);
    if (idx > 0) {
      const field = segment.slice(0, idx).toLowerCase();
      const rawValue = segment.slice(idx + op.length);
      const numValue = Number(rawValue);

      if (KNOWN_FIELDS.has(field) && !Number.isNaN(numValue) && rawValue !== '') {
        return { type: 'range_query', field, operator: op, value: numValue };
      }
    }
  }

  // Field match: field:value
  const colonIdx = segment.indexOf(':');
  if (colonIdx > 0 && colonIdx < segment.length - 1) {
    const field = segment.slice(0, colonIdx).toLowerCase();
    const value = segment.slice(colonIdx + 1);

    if (KNOWN_FIELDS.has(field)) {
      return { type: 'field_match', field, value };
    }
  }

  // Default: free text
  return { type: 'free_text', value: segment };
}
