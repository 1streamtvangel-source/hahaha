import { useSearchContext } from '@/context/search-context';
import { FilterSheet } from './filter-sheet';

export function RootFilterSheet() {
  const { filterSheetRef } = useSearchContext();
  return <FilterSheet sheetRef={filterSheetRef} />;
}
