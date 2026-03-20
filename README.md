# Company Search & Filter App

A React Native (Expo) application for searching, sorting, and filtering an in-memory company dataset. Built with a custom search engine, multi-criteria filtering, and polished UI with dark mode support.

## Setup

```bash
npm install
npx expo start
```

Press `i` for iOS Simulator or `a` for Android Emulator.

## Running Tests

```bash
npm test
```

77 unit tests across 7 test suites covering the search engine, sort comparators, and filter pipeline.

## Architecture

```
Screens (app/)           -- thin view layer, compose components
  |
Components (components/) -- reusable UI building blocks
  |
Hooks (hooks/)           -- bridge between state/logic and UI
  |
Context (context/)       -- centralized search/filter/sort state via useReducer
  |
Utils (utils/)           -- pure functions: search engine, comparators, filters
  |
Types (types/)           -- all TypeScript interfaces
  |
Data (data/)             -- 24 realistic company records
```

**State management**: React Context + `useReducer`. The search/filter/sort pipeline is composed of pure functions in `utils/`, memoized via `useMemo` in the hook layer.

## Search Algorithm

The search engine implements a tokenizer-parser-scorer pipeline:

1. **Tokenizer** (`utils/search/tokenizer.ts`): Parses raw input into typed tokens:
   - `"phrase"` -- exact match
   - `field:value` -- targeted field search
   - `field>value` / `field>=value` / `field<value` / `field<=value` -- range queries
   - Plain text -- free-text search

2. **Parser** (`utils/search/parser.ts`): Validates field names and normalizes tokens.

3. **Scorer** (`utils/search/scorer.ts`): Multi-strategy scoring per company:
   - Exact field match: 100 points
   - Prefix match: 75 points
   - Substring match: 50 points
   - Fuzzy match (Levenshtein distance <= 2): 25 points
   - AND logic: all tokens must match for a result to appear

4. **Engine** (`utils/search/engine.ts`): Orchestrates tokenize -> parse -> score -> rank.

### Example Queries
- `Amazon` -- free-text, finds by name
- `"JPMorgan Chase"` -- exact phrase match
- `industry:Tech` -- field-targeted search
- `revenue>500000000000` -- range query
- `industry:Tech company_type:Private` -- combined AND query

## Features

- **Search Tab**: Full-text search with advanced query syntax, sort controls, filter bottom sheet, result count
- **Explore Tab**: Browse companies grouped by industry with section headers
- **Company Detail**: Full info with financials table, board members, stock info, and offices
- **Filtering**: Industry chips, revenue range slider, company size checkboxes, company type radio buttons
- **Sorting**: 7 sort fields with ascending/descending toggle
- **Animations**: Staggered list entry (Reanimated), animated filter chips
- **Haptic Feedback**: On card press, sort toggle, filter open
- **Dark Mode**: Full support across all screens

## Bonus Features

- Custom search engine with tokenizer/parser/scorer pipeline
- Fuzzy matching via Levenshtein distance
- Advanced query syntax (field:value, range queries, exact phrases)
- Custom dual-thumb range slider built with Gesture Handler + Reanimated
- Related entities: board members, stock info, offices
- Bottom sheet filter panel (@gorhom/bottom-sheet)
- 77 unit tests with Jest
- TypeScript strict mode throughout
