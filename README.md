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

The search engine implements a tokenizer-parser-scorer pipeline. Minimum query length is 3 characters.

1. **Tokenizer** (`utils/search/tokenizer.ts`): Parses raw input into typed tokens:
   - `"phrase"` -- exact match
   - `field:value` -- targeted field search
   - `field>value` / `field>=value` / `field<value` / `field<=value` -- range queries
   - Plain text -- free-text search

2. **Parser** (`utils/search/parser.ts`): Validates field names and normalizes tokens.

3. **Scorer** (`utils/search/scorer.ts`): Multi-strategy scoring per company:
   - Exact field match: 100 points
   - Prefix match: 75 points
   - Word-level prefix: 70 points
   - Substring match: 50 points
   - Fuzzy match (Levenshtein distance, scaled by term length): 25 points
     - 3-4 char terms: max distance 1
     - 5-8 char terms: max distance 2
   - AND logic: all tokens must match for a result to appear

4. **Engine** (`utils/search/engine.ts`): Orchestrates tokenize -> parse -> score -> rank.

### Example Queries
- `Amazon` -- free-text, finds by name
- `"JPMorgan Chase"` -- exact phrase match
- `industry:Tech` -- field-targeted search
- `revenue>500000000000` -- range query
- `industry:Tech company_type:Private` -- combined AND query

## Search & Filter Interaction

Search and filters operate as an AND pipeline: search narrows the dataset first, then filters narrow further. Both constraints are always visible as chips in the active filters bar.

| Filter Sheet | Search Bar | Result |
|---|---|---|
| Industry: Technology | `industry:Health` | 0 results -- constraints conflict, user sees both chips and can remove either |
| Industry: Technology | `amazon` | Amazon only -- search finds Amazon, filter confirms it's Technology |
| Industry: Technology | *(empty)* | All Technology companies |
| *(none)* | `industry:Health` | Healthcare companies |

When both search and filters are active, the search query also appears as a removable chip alongside the filter chips. A "Clear all" link resets everything at once.

## Features

- **Search Tab**: Full-text search with advanced query syntax, sort controls, filter bottom sheet, result count with active state awareness
- **Explore Tab**: Browse companies grouped by industry with section headers
- **Company Detail**: Full info with financials table, board members, stock info, and offices
- **Filtering**: Industry chips (flex-wrap with checkmarks), revenue range slider (`@ptomasroos/react-native-multi-slider`), company size checkboxes, company type radio buttons
- **Filter Sheet**: Bottom sheet with card-grouped sections, size & type side-by-side, Reset/Apply in header, per-section selected counts, haptic feedback on all interactions
- **Active Filters Bar**: Horizontal chip strip showing all active constraints (search query + filters), each removable individually
- **Sorting**: 7 sort fields with ascending/descending toggle (search ranking takes priority when search is active)
- **Animations**: Staggered list entry (Reanimated FadeInDown), animated filter chips (FadeIn/FadeOut)
- **Haptic Feedback**: Card press, sort toggle, filter open/apply/reset, filter selection
- **Dark Mode**: Full support across all screens
- **FAB Indicator**: Red dot on filter FAB when filters are active

## Bonus Features

- Custom search engine with tokenizer/parser/scorer pipeline
- Fuzzy matching via Levenshtein distance (scaled by term length to prevent false positives)
- Advanced query syntax (field:value, range queries, exact phrases)
- Dual-thumb range slider via `@ptomasroos/react-native-multi-slider` with value badges and min/max labels
- Related entities: board members, stock info, offices
- Bottom sheet filter panel (`@gorhom/bottom-sheet`)
- Search + filter AND pipeline with unified chip visualization
- 77 unit tests with Jest
- TypeScript strict mode throughout
- Zero lint errors, zero type errors
