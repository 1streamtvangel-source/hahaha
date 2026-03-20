import { StyleSheet, ScrollView, Pressable, View, Modal, FlatList } from 'react-native';
import { useState, useCallback, useMemo } from 'react';
import * as Haptics from 'expo-haptics';
import { useSearchContext, defaultFilters } from '@/context/search-context';
import { FilterChip } from '@/components/ui/filter-chip';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Spacing, BorderRadius, Shadows } from '@/constants/layout';
import { formatCurrency } from '@/utils/format';
import { SortField, SORT_LABELS, SORT_FIELDS } from '@/types/filters';

export function ActiveFiltersBar() {
  const { state, dispatch } = useSearchContext();
  const { filters, query, sortConfig } = state;
  const [showSortPicker, setShowSortPicker] = useState(false);

  const borderColor = useThemeColor({}, 'border');
  const accentColor = useThemeColor({}, 'accent');
  const overlayColor = useThemeColor({}, 'overlay');
  const cardBg = useThemeColor({}, 'cardBackground');

  const handleSelectSort = useCallback(
    (field: SortField) => {
      dispatch({ type: 'SET_SORT', payload: { field } });
      setShowSortPicker(false);
    },
    [dispatch]
  );

  const handleToggleDirection = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    dispatch({ type: 'TOGGLE_SORT_DIRECTION' });
  }, [dispatch]);

  // Memoize chip array — only rebuilds when filters or query change
  const chips = useMemo(() => {
    const result: { key: string; label: string; filterType: string; filterValue: string }[] = [];

    if (query.trim().length >= 3) {
      result.push({
        key: 'search',
        label: `"${query.trim()}"`,
        filterType: 'query',
        filterValue: '',
      });
    }

    for (const industry of filters.industries) {
      result.push({
        key: `ind-${industry}`,
        label: industry,
        filterType: 'industry',
        filterValue: industry,
      });
    }

    for (const size of filters.sizes) {
      result.push({
        key: `size-${size}`,
        label: size,
        filterType: 'size',
        filterValue: size,
      });
    }

    if (filters.companyType) {
      result.push({
        key: 'type',
        label: filters.companyType,
        filterType: 'companyType',
        filterValue: filters.companyType,
      });
    }

    if (
      filters.revenueRange[0] !== defaultFilters.revenueRange[0] ||
      filters.revenueRange[1] !== defaultFilters.revenueRange[1]
    ) {
      result.push({
        key: 'revenue',
        label: `${formatCurrency(filters.revenueRange[0])} – ${formatCurrency(filters.revenueRange[1])}`,
        filterType: 'revenue',
        filterValue: '',
      });
    }

    return result;
  }, [query, filters]);

  const handleRemoveChip = useCallback(
    (filterType: string, filterValue: string) => {
      switch (filterType) {
        case 'query':
          dispatch({ type: 'SET_QUERY', payload: '' });
          break;
        case 'industry':
          dispatch({
            type: 'SET_FILTERS',
            payload: { industries: filters.industries.filter((i) => i !== filterValue) },
          });
          break;
        case 'size':
          dispatch({
            type: 'SET_FILTERS',
            payload: { sizes: filters.sizes.filter((s) => s !== filterValue) },
          });
          break;
        case 'companyType':
          dispatch({ type: 'SET_FILTERS', payload: { companyType: null } });
          break;
        case 'revenue':
          dispatch({ type: 'SET_FILTERS', payload: { revenueRange: [0, Infinity] } });
          break;
      }
    },
    [dispatch, filters.industries, filters.sizes]
  );

  return (
    <>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <Pressable
          style={[styles.sortChip, { borderColor }]}
          onPress={() => setShowSortPicker(true)}
        >
          <IconSymbol name="arrow.up.arrow.down" size={12} color={accentColor} />
          <ThemedText style={[styles.sortChipText, { color: accentColor }]}>
            {SORT_LABELS[sortConfig.field]}
          </ThemedText>
        </Pressable>

        <Pressable
          style={[styles.directionChip, { borderColor }]}
          onPress={handleToggleDirection}
        >
          <IconSymbol
            name={sortConfig.direction === 'asc' ? 'arrow.up' : 'arrow.down'}
            size={12}
            color={accentColor}
          />
        </Pressable>

        {chips.map((chip) => (
          <FilterChip
            key={chip.key}
            label={chip.label}
            onRemove={() => handleRemoveChip(chip.filterType, chip.filterValue)}
          />
        ))}
      </ScrollView>

      <Modal visible={showSortPicker} transparent animationType="fade">
        <Pressable
          style={[styles.overlay, { backgroundColor: overlayColor }]}
          onPress={() => setShowSortPicker(false)}
        >
          <View style={[styles.picker, { backgroundColor: cardBg }, Shadows.lg]}>
            <ThemedText type="defaultSemiBold" style={styles.pickerTitle}>
              Sort by
            </ThemedText>
            <FlatList
              data={SORT_FIELDS}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.pickerItem}
                  onPress={() => handleSelectSort(item)}
                >
                  <ThemedText
                    style={[
                      styles.pickerItemText,
                      item === sortConfig.field && { color: accentColor, fontWeight: '600' },
                    ]}
                  >
                    {SORT_LABELS[item]}
                  </ThemedText>
                  {item === sortConfig.field && (
                    <IconSymbol name="checkmark" size={16} color={accentColor} />
                  )}
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
    alignItems: 'center',
  },
  sortChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    gap: Spacing.xs,
  },
  sortChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  directionChip: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    width: 28,
    height: 28,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xxl,
  },
  picker: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    width: '100%',
    maxWidth: 300,
  },
  pickerTitle: {
    fontSize: 16,
    marginBottom: Spacing.md,
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
  },
  pickerItemText: {
    fontSize: 15,
  },
});
