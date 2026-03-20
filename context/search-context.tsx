import React, { createContext, useContext, useReducer, type ReactNode } from 'react';
import { FilterState, SortConfig, SortField, SortDirection } from '@/types/filters';

interface SearchState {
  query: string;
  filters: FilterState;
  sortConfig: SortConfig;
}

type SearchAction =
  | { type: 'SET_QUERY'; payload: string }
  | { type: 'SET_FILTERS'; payload: Partial<FilterState> }
  | { type: 'SET_SORT'; payload: { field: SortField } }
  | { type: 'SET_SORT_DIRECTION'; payload: SortDirection }
  | { type: 'TOGGLE_SORT_DIRECTION' }
  | { type: 'RESET_FILTERS' }
  | { type: 'CLEAR_ALL' };

const defaultFilters: FilterState = {
  industries: [],
  revenueRange: [0, Infinity],
  sizes: [],
  companyType: null,
};

const initialState: SearchState = {
  query: '',
  filters: defaultFilters,
  sortConfig: { field: 'name', direction: 'asc' },
};

function searchReducer(state: SearchState, action: SearchAction): SearchState {
  switch (action.type) {
    case 'SET_QUERY':
      return { ...state, query: action.payload };

    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };

    case 'SET_SORT':
      return {
        ...state,
        sortConfig: {
          field: action.payload.field,
          direction:
            state.sortConfig.field === action.payload.field
              ? state.sortConfig.direction === 'asc'
                ? 'desc'
                : 'asc'
              : 'asc',
        },
      };

    case 'SET_SORT_DIRECTION':
      return {
        ...state,
        sortConfig: { ...state.sortConfig, direction: action.payload },
      };

    case 'TOGGLE_SORT_DIRECTION':
      return {
        ...state,
        sortConfig: {
          ...state.sortConfig,
          direction: state.sortConfig.direction === 'asc' ? 'desc' : 'asc',
        },
      };

    case 'RESET_FILTERS':
      return { ...state, filters: defaultFilters };

    case 'CLEAR_ALL':
      return { ...initialState };
  }
}

interface SearchContextValue {
  state: SearchState;
  dispatch: React.Dispatch<SearchAction>;
}

const SearchContext = createContext<SearchContextValue | null>(null);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(searchReducer, initialState);

  return (
    <SearchContext.Provider value={{ state, dispatch }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearchContext(): SearchContextValue {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearchContext must be used within a SearchProvider');
  }
  return context;
}

export { defaultFilters };
export type { SearchState, SearchAction };
