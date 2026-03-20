import { StyleSheet, ScrollView, View } from 'react-native';
import { useSearchContext, defaultFilters } from '@/context/search-context';
import { FilterChip } from '@/components/ui/filter-chip';
import { Spacing } from '@/constants/layout';
import { formatCurrency } from '@/utils/format';

export function ActiveFiltersBar() {
  const { state, dispatch } = useSearchContext();
  const { filters, query } = state;

  const chips: { key: string; label: string; onRemove: () => void }[] = [];

  // Show active search query as a chip
  if (query.trim().length >= 3) {
    chips.push({
      key: 'search',
      label: `Search: "${query.trim()}"`,
      onRemove: () => dispatch({ type: 'SET_QUERY', payload: '' }),
    });
  }

  for (const industry of filters.industries) {
    chips.push({
      key: `ind-${industry}`,
      label: industry,
      onRemove: () =>
        dispatch({
          type: 'SET_FILTERS',
          payload: { industries: filters.industries.filter((i) => i !== industry) },
        }),
    });
  }

  for (const size of filters.sizes) {
    chips.push({
      key: `size-${size}`,
      label: size,
      onRemove: () =>
        dispatch({
          type: 'SET_FILTERS',
          payload: { sizes: filters.sizes.filter((s) => s !== size) },
        }),
    });
  }

  if (filters.companyType) {
    chips.push({
      key: 'type',
      label: filters.companyType,
      onRemove: () => dispatch({ type: 'SET_FILTERS', payload: { companyType: null } }),
    });
  }

  if (
    filters.revenueRange[0] !== defaultFilters.revenueRange[0] ||
    filters.revenueRange[1] !== defaultFilters.revenueRange[1]
  ) {
    chips.push({
      key: 'revenue',
      label: `${formatCurrency(filters.revenueRange[0])} – ${formatCurrency(filters.revenueRange[1])}`,
      onRemove: () =>
        dispatch({ type: 'SET_FILTERS', payload: { revenueRange: [0, Infinity] } }),
    });
  }

  if (chips.length === 0) return null;

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {chips.map((chip) => (
          <FilterChip key={chip.key} label={chip.label} onRemove={chip.onRemove} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: Spacing.lg,
  },
  container: {
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
});
