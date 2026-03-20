# Company Search & Filter App

A React Native (Expo) application for searching, sorting, and filtering an in-memory company dataset. Built with a custom multi-strategy search engine, composable filter pipeline, scroll-driven animations, and a polished production-grade UI with full dark mode support.

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

77 unit tests across 7 test suites covering every layer of the algorithmic core.

---

## Architecture

### Layer Diagram

```
Screens (app/)           -- thin view layer, composes components
  |
Components (components/) -- reusable UI building blocks
  |
Hooks (hooks/)           -- bridge between state/logic and UI
  |
Context (context/)       -- centralized search/filter/sort state via useReducer
  |
Utils (utils/)           -- pure functions: search engine, comparators, filters
  |
Types (types/)           -- all TypeScript interfaces and discriminated unions
  |
Data (data/)             -- 24 realistic company records with related entities
```

### Why This Architecture

**Separation of concerns**: The algorithmic core (utils/) is entirely pure functions with zero React dependencies. This means the tokenizer, scorer, comparators, and filter predicates can be unit-tested in isolation without rendering any components. The hook layer (hooks/) is the only place where React state meets business logic, via `useMemo` memoization.

**Thin screens**: Screen files in `app/` are purely compositional -- they assemble components and wire up hooks. No business logic lives in screens. This makes screens easy to read at a glance and keeps logic testable.

**Context over external state libraries**: We use React Context + `useReducer` instead of Zustand/Redux. The rationale: this is a single-domain app (company search). There's one global state shape (query + filters + sort). `useReducer` gives us predictable state transitions with typed action discriminated unions, and Context makes it available everywhere. No extra dependencies, no middleware, no boilerplate -- and it demonstrates mastery of React primitives.

### File Structure

```
MyApp/
├── app/
│   ├── _layout.tsx                 Root: GestureHandler + Theme + BottomSheetModalProvider + SearchProvider
│   ├── (tabs)/
│   │   ├── _layout.tsx             Tab navigator: Search + Explore
│   │   ├── index.tsx               Search screen with animated header + FABs
│   │   └── explore.tsx             Browse by industry with SectionList
│   └── company/
│       └── [id].tsx                Company detail with all sections
├── components/
│   ├── company/                    8 company display components
│   ├── filters/                    4 filter UI components
│   └── ui/                         8 reusable form/display controls
├── hooks/                          7 custom hooks
├── context/
│   └── search-context.tsx          Global state: query, filters, sort, sheet ref
├── utils/
│   ├── search/                     Tokenizer, parser, scorer, engine
│   ├── filter/                     Predicate functions + pipeline
│   ├── sort/                       Comparators + sort function
│   └── format.ts                   Currency/number formatting
├── types/                          4 type definition files
├── constants/                      3 constant files (theme, layout, industries)
├── data/
│   └── companies.ts                24 company records
└── __tests__/                      7 test suites, 77 tests
```

---

## State Management

### Context Shape

```typescript
SearchState {
  query: string                    // Raw search input (debounced in hook layer)
  filters: FilterState {
    industries: string[]           // Selected industry names
    revenueRange: [number, number] // Min/max revenue (default: [0, Infinity])
    sizes: string[]                // Selected sizes: Small, Medium, Large
    companyType: string | null     // Public, Private, or null (any)
  }
  sortConfig: SortConfig {
    field: SortField               // One of 7 sortable fields
    direction: 'asc' | 'desc'
  }
}
```

### Actions

| Action | Purpose |
| --- | --- |
| `SET_QUERY` | Update search text (dispatched on every keystroke, debounced in hook) |
| `SET_FILTERS` | Partial update to filter state (merge semantics) |
| `SET_SORT` | Set sort field; toggles direction if same field selected again |
| `TOGGLE_SORT_DIRECTION` | Flip asc/desc |
| `RESET_FILTERS` | Clear all filters to defaults |
| `CLEAR_ALL` | Reset query + filters + sort to initial state |

### Why useReducer Over useState

The state has interdependent fields (clearing all must reset query AND filters AND sort simultaneously). `useReducer` guarantees atomic state transitions -- a single `CLEAR_ALL` dispatch produces one consistent state update, whereas multiple `setState` calls could cause intermediate renders with inconsistent state.

### Why the BottomSheet Ref Lives in Context

The filter sheet renders at the root layout level (above the tab navigator) so it overlays the entire screen including tabs. But the "open filters" button lives inside the Search tab screen. Context bridges this gap: `openFilterSheet()` is a stable callback that calls `filterSheetRef.current.present()`, available to any screen.

---

## Search Engine

### Why a Custom Search Engine

The assignment explicitly requires a custom search algorithm beyond `.filter()` / `.includes()`. We built a proper compiler-style pipeline (tokenizer -> parser -> scorer) that demonstrates:

1. **Lexical analysis** (tokenizer) -- recognizing different query syntaxes
2. **Semantic validation** (parser) -- mapping field names to data paths
3. **Ranked scoring** (scorer) -- multi-strategy relevance with graded confidence levels
4. **Fuzzy tolerance** (Levenshtein) -- handling typos gracefully

### Pipeline

```
User Input: '"Amazon" industry:Tech revenue>5000000 cloud'
    |
    v
[Tokenizer] --> ExactMatch("Amazon"), FieldMatch(industry, Tech),
                RangeQuery(revenue, >, 5000000), FreeText("cloud")
    |
    v
[Parser]    --> Validates field names against FIELD_MAP, drops unknowns
    |
    v
[Scorer]    --> For each company, scores against ALL tokens (AND logic)
                Sum of per-token scores. Score = 0 if any token fails.
    |
    v
[Engine]    --> Filters score > 0, sorts by score desc, then name asc
```

### Scoring Strategy

| Match Type | Score | When |
| --- | --- | --- |
| Exact field value | 100 | `fieldLower === termLower` |
| Prefix | 75 | `field.startsWith(term)` |
| Word-level prefix | 70 | Any word in field starts with term |
| Substring | 50 | `field.includes(term)` |
| Fuzzy (Levenshtein) | 25 | Distance within threshold |
| No match | 0 | None of the above |

### Why Scaled Fuzzy Thresholds

Initially we used a flat Levenshtein distance <= 2 for all terms. This caused false positives: "ama" (3 chars) fuzzy-matched "bmw" (distance 2), surfacing BMW Group when searching for Amazon. The fix: scale max distance by term length.

- 3-4 char terms: max distance 1 (only close typos like "amaz" -> "amazn")
- 5-8 char terms: max distance 2 (handles real typos like "Amazom" -> "Amazon")
- < 3 chars or > 8 chars: no fuzzy matching

### Why Minimum 3 Characters

Queries under 3 characters produce too many low-quality matches and fuzzy false positives. The 3-char minimum ensures meaningful results while still being responsive (typing "Ama" immediately finds Amazon).

### Searchable Fields

name, country, industry, company_type, size, ceo_name, headquarters, founded_year, stock_info.ticker, stock_info.exchange

---

## Filter & Sort Pipeline

### Processing Order

```
All Companies (24)
    |
    v
[Search Engine] --> Scored results (if query >= 3 chars) or all companies
    |
    v
[Filter Predicates] --> AND logic: industry, revenue range, size, company type
    |
    v
[Sort] --> Only when NO active search (search ranking takes priority)
    |
    v
Final Results
```

### Why Search Ranking Overrides Sort

When a user searches "Amazon", they expect the best match first -- not alphabetical order. Sort only applies when browsing (no search active), which is the intuitive behavior.

### Search + Filter AND Interaction

Search and filters are independent constraints AND'd together. They never override each other:

| Filter Sheet | Search Bar | Result |
| --- | --- | --- |
| Industry: Technology | `industry:Health` | 0 results (conflict visible as chips) |
| Industry: Technology | `amazon` | Amazon only |
| Industry: Technology | *(empty)* | All Technology companies |
| *(none)* | `industry:Health` | Healthcare companies |

This is deliberate: the transparent AND behavior avoids "magic" where one input silently overrides another. Both constraints appear as removable chips, so the user can see and resolve conflicts.

### Sort Comparators

| Field | Strategy | Notes |
| --- | --- | --- |
| name | `localeCompare` | Alphabetic, locale-aware |
| country | `localeCompare` | Alphabetic, locale-aware |
| revenue | Numeric | Uses latest financial year |
| net_income | Numeric | Uses latest financial year |
| founded_year | Numeric | Older first in ascending |
| company_type | `localeCompare` | Private before Public |
| size | Enum ordering | Small(0) < Medium(1) < Large(2) |

### Why Filter Predicates Are Factory Functions

Each filter (`filterByIndustry`, `filterBySize`, etc.) returns a predicate function `(record) => boolean`. This design allows composing any combination:

```typescript
const predicates = [filterByIndustry(industries), filterBySize(sizes), ...];
results.filter(record => predicates.every(pred => pred(record)));
```

Adding a new filter is one function + one line in the pipeline. No switch statements, no growing if/else chains.

---

## UI Decisions

### Scroll-Driven Header Animation

The header (title + search bar + filter chips) collapses on scroll down and re-expands on scroll up. This is ported from a production e-commerce app pattern. The implementation uses `react-native-reanimated` shared values with `withTiming` (200ms) for smooth 60fps animations.

**Why this pattern**: On mobile, screen real estate is precious. When the user is browsing the list, they don't need the search bar. But they need it back instantly when scrolling up (intent to refine). The 5px scroll-diff threshold prevents jittery toggling on small scroll movements.

**Animated properties**:

| Element | Collapsed | Expanded |
| --- | --- | --- |
| Title row | height: 0, opacity: 0 | height: 44, opacity: 1 |
| Toolbar (search + chips) | maxHeight: 0, opacity: 0 | maxHeight: 200, opacity: 1 |
| Filter FAB pill | width: 52 (circle) | width: 130 (pill with text) |
| Scroll-to-top FAB | scale: 0, opacity: 0 | scale: 1, opacity: 1 |

### Floating Action Buttons

Two FABs at the bottom:

- **Left: Scroll-to-top** -- appears when scrolled past 50px and scrolling up. Uses `FlatList.scrollToOffset({ offset: 0, animated: true })`.
- **Right: Filter pill** -- always visible, morphs from a 52px circle (icon only) to a 130px pill ("Filters" text + icon) when expanded. Shows a red badge with active filter count.

**Why morphing pill instead of static FAB**: The pill communicates state. When collapsed (scrolling down), it's minimal. When expanded (scrolling up or at top), it shows "Filters" text and the active count. The width interpolation creates a satisfying spring-like morph effect.

### Sort Integrated Into Chips Row

The sort control is the first chip in the horizontal filter chips strip, not a separate row. This saves vertical space and creates a unified "active constraints" strip where sort, search query, and all filters are visible and actionable in one row.

### Bottom Sheet Filter Panel

**Why `@gorhom/bottom-sheet` BottomSheetModal**: Industry standard for mobile filter panels (Airbnb, Zillow, etc.). Better UX than a full-screen modal because the user can see the list behind it and dismiss with a swipe.

**Why `FullWindowOverlay` on iOS**: Without it, the sheet renders within the navigation stack's bounds and can't cover the tab bar. `FullWindowOverlay` from `react-native-screens` renders in a native window overlay, giving the sheet true full-screen coverage. On Android, a plain Fragment wrapper is used (Android doesn't have this constraint).

**Why `enableDynamicSizing={false}`**: Bottom-sheet v5 defaults to dynamic sizing (size to content), which ignores `snapPoints`. Explicitly disabling it ensures the sheet opens at exactly 90% of the screen.

**Sheet layout**:

```
┌─────────────────────────────┐
│        ── handle ──         │
│                             │
│  (spacer)   Filters     X  │  <- Sticky header
│  ─────────────────────────  │
│                             │
│  ┌ INDUSTRY ─────────────┐  │
│  │ [x Tech] [Finance]...│  │  <- Scrollable content
│  └───────────────────────┘  │
│  ┌ REVENUE RANGE ────────┐  │
│  │ $580M ── $611.3B      │  │
│  │ ●━━━━━━━━━━━━━━━━━●   │  │
│  └───────────────────────┘  │
│  ┌ SIZE ──┐ ┌ TYPE ─────┐  │
│  │ [x] S  │ │ (o) Pub   │  │
│  │ [ ] M  │ │ ( ) Priv  │  │
│  │ [ ] L  │ │           │  │
│  └────────┘ └───────────┘  │
│  ─────────────────────────  │
│  [ Reset ]  [ Apply (3) ]  │  <- Sticky footer
└─────────────────────────────┘
```

### Range Slider

**Why `@ptomasroos/react-native-multi-slider`**: We initially built a custom slider with `react-native-gesture-handler` + `react-native-reanimated`, but it had gesture tracking bugs (`translationX` accumulation issues, unreliable thumb constraints). The library is mature, handles edge cases (thumb overlap, track bounds), and provides snap/step behavior out of the box. Custom thumbs with platform-specific shadows maintain our design language.

### Company Cards

Each card shows: colored initial (derived from industry), name, country, badges (industry/size/type), latest revenue formatted with abbreviation ($574.8B), and meta info (founded year, HQ, CEO). The staggered `FadeInDown` entry animation with 50ms delay per item creates a cascade effect when results update.

### Dark Mode

Every component reads colors from the `Colors` theme object via `useThemeColor()`. The theme provides 20+ semantic tokens per mode (text, textSecondary, textTertiary, background, backgroundSecondary, border, accent, chipBackground, etc.). No hardcoded colors except white (#FFFFFF) for text on colored backgrounds.

---

## Data Model

### CompanyRecord (24 records)

```typescript
CompanyRecord = Company + CompanyDetails + {
  financials: FinancialData[]     // 3-4 years of revenue + net_income
  board_members: BoardMember[]    // 2-5 per company
  stock_info: StockInfo | null    // null for Private companies
  offices: Office[]               // 1-3 per company
}
```

### Dataset Diversity

- **7 industries**: Technology, Finance, Healthcare, Energy, Retail, Automotive, Aerospace
- **3 sizes**: Small (3), Medium (6), Large (15)
- **2 types**: Public (15), Private (9)
- **13 countries**: US, UK, South Korea, Japan, Germany, Sweden, Denmark, Switzerland, Netherlands, Australia, Ireland, Singapore, China
- **Revenue range**: $320M (Ripple Labs) to $611.3B (Walmart)
- **Founded range**: 1849 (Pfizer) to 2015 (Revolut)

This diversity ensures every filter combination produces interesting results and edge cases are covered (negative net income, null stock info, varied office types).

---

## Hooks

| Hook | Purpose | Why It Exists |
| --- | --- | --- |
| `useCompanySearch` | Debounces query (300ms), runs pipeline, returns results + metadata | Single source of truth for search state; memoizes the expensive pipeline computation |
| `useDebouncedValue` | Generic debounce via `useState` + `useEffect` + `setTimeout` | Prevents re-running the search engine on every keystroke; 300ms balances responsiveness vs. performance |
| `useFilterOptions` | Derives available filter values (industries, sizes, revenue min/max) from dataset | Computed once via `useMemo([], [])` -- filter controls always show the correct available options |
| `useListAnimations` | Manages scroll-driven UI animations (header collapse, FAB morph, scroll-to-top) | Encapsulates all animation shared values and styles; keeps the screen file clean |
| `useThemeColor` | Resolves semantic color tokens for current theme | Abstracts light/dark branching; components just ask for "textSecondary" |
| `useColorScheme` | Returns current system color scheme | Platform-specific (web version handles SSR hydration) |

---

## Testing Strategy

### What's Tested

| Suite | File | Tests | What It Covers |
| --- | --- | --- | --- |
| Tokenizer | `tokenizer.test.ts` | 10 | All token types, edge cases (empty, unclosed quotes, unknown fields) |
| Parser | `parser.test.ts` | 8 | Field validation, unknown field dropping, mixed tokens |
| Scorer | `scorer.test.ts` | 13 | Every scoring path (exact, prefix, substring, fuzzy, AND logic), Levenshtein |
| Engine | `engine.test.ts` | 8 | Integration: full queries, ranking, combined syntax, short queries |
| Comparators | `comparators.test.ts` | 7 | All 7 sort fields, direction, enum ordering |
| Filters | `filters.test.ts` | 12 | Every predicate independently, boundary conditions |
| Pipeline | `pipeline.test.ts` | 8 | Combined search + filter + sort, empty results, conflicting filters |

### Why Only Pure Functions Are Tested

The test boundary is at the `utils/` layer -- pure functions with deterministic inputs and outputs. Components and hooks are not unit-tested because:

1. The business logic is fully extracted into utils -- components are just rendering
2. Component tests would require a React Native test renderer, adding complexity for little coverage gain
3. The pipeline integration test (`pipeline.test.ts`) validates the full flow end-to-end

### Test Configuration

- **Preset**: `jest-expo` (handles React Native module mocking)
- **Path aliases**: `@/*` mapped to project root via `moduleNameMapper`
- **Transform ignore**: Standard Expo pattern for node_modules

---

## Dependencies

| Package | Version | Why |
| --- | --- | --- |
| `expo` | ~54.0.33 | Framework and build system |
| `expo-router` | ~6.0.23 | File-based routing (app/ directory) |
| `react-native-reanimated` | ~4.1.1 | UI-thread animations (60fps scroll-driven header, list entry) |
| `react-native-gesture-handler` | ~2.28.0 | Required by bottom-sheet and reanimated |
| `react-native-screens` | ~4.16.0 | Native screen containers + `FullWindowOverlay` for bottom sheet |
| `react-native-safe-area-context` | ~5.6.0 | Safe area insets for header positioning |
| `@gorhom/bottom-sheet` | ^5.2.8 | Filter panel (BottomSheetModal with backdrop) |
| `@ptomasroos/react-native-multi-slider` | ^2.2.2 | Dual-thumb revenue range slider |
| `expo-haptics` | ~15.0.8 | Tactile feedback on interactions |
| `@expo/vector-icons` | ^15.0.3 | Material Icons (Android/web fallback) |
| `expo-symbols` | ~1.0.8 | SF Symbols (iOS native icons) |
| `jest-expo` | ^55.0.11 | Test runner with RN module support |

**No external state management library** (Zustand, Redux, MobX) -- Context + useReducer is sufficient for a single-domain app and demonstrates React fundamentals mastery.

**No external search library** (Fuse.js, Lunr) -- the custom pipeline is the algorithmic centerpiece of the assignment.

**No UI component library** (NativeBase, React Native Paper) -- all components built from scratch to demonstrate React Native proficiency.

---

## Key Design Decisions Summary

| Decision | Alternative Considered | Why We Chose This |
| --- | --- | --- |
| Context + useReducer | Zustand, Redux | Single domain, no middleware needed, shows React primitives mastery |
| Custom search pipeline | Fuse.js, simple .filter() | Assignment requires custom algorithm; pipeline demonstrates CS depth |
| Pure function utils | Logic in components/hooks | Testable without React, composable, reusable |
| FlatList (not FlashList) | @shopify/flash-list | 24 items -- no performance difference; avoids extra dependency |
| BottomSheetModal + FullWindowOverlay | React Native Modal, custom overlay | Full-screen coverage over tabs; industry-standard swipe UX |
| enableDynamicSizing={false} | Default (true) | v5 default ignores snapPoints; explicit disable ensures 90% height |
| @ptomasroos/react-native-multi-slider | Custom gesture slider | Our custom slider had tracking bugs; library is battle-tested |
| Scroll-direction header animation | Static header, or scroll-position-based | Matches production app patterns (Airbnb, e-commerce); preserves screen space |
| Sort in chips row (not separate row) | Dedicated sort bar | Saves vertical space; unified "active constraints" strip |
| Scaled Levenshtein thresholds | Flat distance <= 2 | Prevents false positives on short terms (e.g., "ama" matching "bmw") |
| 3-char minimum query | 1-char or 2-char | Balances responsiveness vs. result quality |
| AND logic for search + filters | OR, or filter overrides search | Transparent, predictable; conflicts visible as chips |
| 300ms debounce | 150ms, 500ms | Fast enough to feel responsive; slow enough to avoid wasteful recomputation |
| Staggered FadeInDown (50ms) | Instant render, or longer stagger | Feels polished without being slow; 24 items * 50ms = 1.2s total cascade |
| Industry colors as constant | Random/hash-derived colors | Consistent, intentional palette; shared across 3 components via single import |
