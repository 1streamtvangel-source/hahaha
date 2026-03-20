import { CompanyList } from '@/components/company/company-list';
import { ActiveFiltersBar } from '@/components/filters/active-filters-bar';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { SearchBar } from '@/components/ui/search-bar';
import { Shadows, Spacing } from '@/constants/layout';
import { useSearchContext } from '@/context/search-context';
import { useCompanySearch } from '@/hooks/use-company-search';
import { useListAnimations } from '@/hooks/use-list-animations';
import { useThemeColor } from '@/hooks/use-theme-color';
import * as Haptics from 'expo-haptics';
import { useCallback, useRef } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const { state, dispatch, openFilterSheet } = useSearchContext();
  const {
    results,
    totalCount,
    resultCount,
    isSearching,
    hasActiveSearch,
    hasActiveFilters,
  } = useCompanySearch();
  const listRef = useRef<FlatList>(null);
  const bgColor = useThemeColor({}, 'background');
  const accentColor = useThemeColor({}, 'accent');
  const borderColor = useThemeColor({}, 'border');

  const {
    handleScroll,
    headerRowAnimatedStyle,
    toolbarAnimatedStyle,
    scrollTopAnimatedStyle,
    filterPillAnimatedStyle,
    filterPillTextAnimatedStyle,
  } = useListAnimations();

  const handleQueryChange = useCallback(
    (text: string) => dispatch({ type: 'SET_QUERY', payload: text }),
    [dispatch]
  );


  const openFilters = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    openFilterSheet();
  }, [openFilterSheet]);

  const handleClearAll = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    dispatch({ type: 'CLEAR_ALL' });
  }, [dispatch]);

  const handleScrollToTop = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, []);

  const isFiltered = hasActiveSearch || hasActiveFilters;
  const activeFilterCount =
    state.filters.industries.length +
    state.filters.sizes.length +
    (state.filters.companyType ? 1 : 0);

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      {/* Fixed header above the list */}
      <View
        style={[
          styles.headerContainer,
          { paddingTop: insets.top + 8, backgroundColor: bgColor, borderBottomColor: borderColor },
        ]}
      >
        {/* Title row: collapses on scroll down */}
        <Animated.View style={[styles.titleRow, headerRowAnimatedStyle]}>
          <ThemedText type="title" style={styles.title}>
            Search
          </ThemedText>
          <View style={styles.countRow}>
            <ThemedText style={styles.count} lightColor="#9BA1A6" darkColor="#687076">
              {isFiltered
                ? `${resultCount} result${resultCount !== 1 ? 's' : ''}`
                : `${totalCount} companies`}
            </ThemedText>
            {isFiltered && (
              <Pressable onPress={handleClearAll} hitSlop={8}>
                <ThemedText style={[styles.clearAll, { color: accentColor }]}>
                  Clear
                </ThemedText>
              </Pressable>
            )}
          </View>
        </Animated.View>

        {/* Search + chips row: collapses on scroll down */}
        <Animated.View style={toolbarAnimatedStyle}>
          <View style={styles.toolbarInner}>
            <SearchBar value={state.query} onChangeText={handleQueryChange} showHint={false} />
            <ActiveFiltersBar />
          </View>
        </Animated.View>
      </View>

      {/* Scrollable list */}
      <View style={styles.listContainer}>
        <CompanyList
          companies={results}
          isSearching={isSearching}
          listRef={listRef}
          onScroll={handleScroll}
        />
      </View>

      {/* Floating Actions: scroll-to-top (left) + filter pill (right) */}
      <Animated.View
        style={[styles.fab, styles.fabLeft, { bottom: insets.bottom + 30 }, scrollTopAnimatedStyle]}
      >
        <Pressable
          style={[styles.fabButton, { backgroundColor: accentColor }]}
          onPress={handleScrollToTop}
        >
          <IconSymbol name="arrow.up" size={22} color="#FFFFFF" />
        </Pressable>
      </Animated.View>

      <View style={[styles.fab, styles.fabRight, { bottom: insets.bottom + 30 }]}>
        <AnimatedPressable
          style={[styles.filterPill, { backgroundColor: accentColor }, filterPillAnimatedStyle]}
          onPress={openFilters}
        >
          <Animated.Text
            style={[styles.filterPillText, filterPillTextAnimatedStyle]}
            numberOfLines={1}
          >
            Filters
          </Animated.Text>
          <View style={styles.filterPillIconContainer}>
            <IconSymbol name="line.3.horizontal.decrease" size={20} color="#FFFFFF" />
            {activeFilterCount > 0 && (
              <View style={styles.filterPillBadge}>
                <Animated.Text style={styles.filterPillBadgeText}>
                  {activeFilterCount}
                </Animated.Text>
              </View>
            )}
          </View>
        </AnimatedPressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    gap: Spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
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
  toolbarInner: {
    gap: Spacing.sm,
  },
  listContainer: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
  },
  fabLeft: {
    left: 20,
  },
  fabRight: {
    right: 20,
  },
  fabButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.lg,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 26,
    overflow: 'hidden',
    ...Shadows.lg,
  },
  filterPillText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  filterPillIconContainer: {
    position: 'relative',
  },
  filterPillBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterPillBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
