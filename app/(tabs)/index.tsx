import { StyleSheet, View, Pressable } from 'react-native';
import { useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useSearchContext } from '@/context/search-context';
import { useCompanySearch } from '@/hooks/use-company-search';
import { useThemeColor } from '@/hooks/use-theme-color';
import { SearchBar } from '@/components/ui/search-bar';
import { SortButton } from '@/components/ui/sort-button';
import { CompanyList } from '@/components/company/company-list';
import { ActiveFiltersBar } from '@/components/filters/active-filters-bar';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Spacing, BorderRadius, Shadows } from '@/constants/layout';
import { SortField } from '@/types/filters';

export default function SearchScreen() {
  const { state, dispatch, openFilterSheet } = useSearchContext();
  const {
    results,
    totalCount,
    resultCount,
    isSearching,
    hasActiveSearch,
    hasActiveFilters,
  } = useCompanySearch();
  const bgColor = useThemeColor({}, 'background');
  const accentColor = useThemeColor({}, 'accent');

  const handleQueryChange = useCallback(
    (text: string) => dispatch({ type: 'SET_QUERY', payload: text }),
    [dispatch]
  );

  const handleSortField = useCallback(
    (field: SortField) => dispatch({ type: 'SET_SORT', payload: { field } }),
    [dispatch]
  );

  const handleToggleDirection = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    dispatch({ type: 'TOGGLE_SORT_DIRECTION' });
  }, [dispatch]);

  const openFilters = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    openFilterSheet();
  }, [openFilterSheet]);

  const handleClearAll = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    dispatch({ type: 'CLEAR_ALL' });
  }, [dispatch]);

  const isFiltered = hasActiveSearch || hasActiveFilters;

  const header = (
    <View style={styles.headerSection}>
      <SearchBar value={state.query} onChangeText={handleQueryChange} />
      <ActiveFiltersBar />
      <View style={styles.toolbar}>
        <SortButton
          field={state.sortConfig.field}
          direction={state.sortConfig.direction}
          onSelectField={handleSortField}
          onToggleDirection={handleToggleDirection}
        />
        <View style={styles.countRow}>
          <ThemedText style={styles.count} lightColor="#9BA1A6" darkColor="#687076">
            {isFiltered
              ? `${resultCount} result${resultCount !== 1 ? 's' : ''}`
              : `${totalCount} companies`}
          </ThemedText>
          {isFiltered && (
            <Pressable onPress={handleClearAll} hitSlop={8}>
              <ThemedText style={[styles.clearAll, { color: accentColor }]}>
                Clear all
              </ThemedText>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: bgColor }]} edges={['top']}>
      <View style={styles.titleRow}>
        <ThemedText type="title" style={styles.title}>
          Search
        </ThemedText>
      </View>
      <CompanyList companies={results} isSearching={isSearching} header={header} />

      <Pressable
        style={[styles.fab, { backgroundColor: accentColor }, Shadows.lg]}
        onPress={openFilters}
      >
        <IconSymbol name="line.3.horizontal.decrease" size={20} color="#FFFFFF" />
        {hasActiveFilters && <View style={styles.fabDot} />}
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  titleRow: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
  },
  title: {
    fontSize: 28,
  },
  headerSection: {
    gap: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  countRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  count: {
    fontSize: 13,
  },
  clearAll: {
    fontSize: 13,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: 90,
    right: Spacing.xl,
    width: 52,
    height: 52,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#EF4444',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});
