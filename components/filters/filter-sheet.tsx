import { StyleSheet, View, Pressable } from 'react-native';
import { useCallback, useMemo } from 'react';
import * as Haptics from 'expo-haptics';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useSearchContext, defaultFilters } from '@/context/search-context';
import { useFilterOptions } from '@/hooks/use-filter-options';
import { useThemeColor } from '@/hooks/use-theme-color';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { FilterSection } from './filter-section';
import { ChipSelector } from '@/components/ui/chip-selector';
import { CheckboxGroup } from '@/components/ui/checkbox-group';
import { RadioGroup } from '@/components/ui/radio-group';
import { RangeSlider } from '@/components/ui/range-slider';
import { Spacing, BorderRadius } from '@/constants/layout';

interface FilterSheetProps {
  sheetRef: React.RefObject<BottomSheet | null>;
}

export function FilterSheet({ sheetRef }: FilterSheetProps) {
  const { state, dispatch } = useSearchContext();
  const options = useFilterOptions();
  const snapPoints = useMemo(() => ['65%', '90%'], []);

  const bgColor = useThemeColor({}, 'background');
  const handleColor = useThemeColor({}, 'textTertiary');
  const accentColor = useThemeColor({}, 'accent');
  const cardBg = useThemeColor({}, 'backgroundSecondary');

  const { filters } = state;

  // Count active filters for the badge
  const activeCount =
    filters.industries.length +
    filters.sizes.length +
    (filters.companyType ? 1 : 0) +
    (filters.revenueRange[0] !== defaultFilters.revenueRange[0] ||
    filters.revenueRange[1] !== defaultFilters.revenueRange[1]
      ? 1
      : 0);

  const toggleIndustry = useCallback(
    (industry: string) => {
      Haptics.selectionAsync();
      const current = filters.industries;
      const next = current.includes(industry)
        ? current.filter((i) => i !== industry)
        : [...current, industry];
      dispatch({ type: 'SET_FILTERS', payload: { industries: next } });
    },
    [filters.industries, dispatch]
  );

  const toggleSize = useCallback(
    (size: string) => {
      Haptics.selectionAsync();
      const current = filters.sizes;
      const next = current.includes(size)
        ? current.filter((s) => s !== size)
        : [...current, size];
      dispatch({ type: 'SET_FILTERS', payload: { sizes: next } });
    },
    [filters.sizes, dispatch]
  );

  const setCompanyType = useCallback(
    (type: string | null) => {
      Haptics.selectionAsync();
      dispatch({ type: 'SET_FILTERS', payload: { companyType: type } });
    },
    [dispatch]
  );

  const setRevenueRange = useCallback(
    (low: number, high: number) => {
      dispatch({ type: 'SET_FILTERS', payload: { revenueRange: [low, high] } });
    },
    [dispatch]
  );

  const handleReset = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    dispatch({ type: 'RESET_FILTERS' });
  }, [dispatch]);

  const handleDone = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    sheetRef.current?.close();
  }, [sheetRef]);

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      backgroundStyle={{ backgroundColor: bgColor }}
      handleIndicatorStyle={{ backgroundColor: handleColor, width: 40 }}
    >
      <BottomSheetScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={handleReset} hitSlop={8} style={styles.resetButton}>
            <IconSymbol name="xmark" size={12} color={accentColor} />
            <ThemedText style={[styles.resetText, { color: accentColor }]}>
              Reset
            </ThemedText>
          </Pressable>
          <Pressable
            style={[styles.applyButton, { backgroundColor: accentColor }]}
            onPress={handleDone}
          >
            <ThemedText style={styles.applyButtonText}>
              Apply{activeCount > 0 ? ` (${activeCount})` : ''}
            </ThemedText>
          </Pressable>
        </View>

        {/* Industry */}
        <View style={[styles.sectionCard, { backgroundColor: cardBg }]}>
          <FilterSection title="Industry" count={filters.industries.length}>
            <ChipSelector
              options={options.industries}
              selected={filters.industries}
              onToggle={toggleIndustry}
            />
          </FilterSection>
        </View>

        {/* Revenue Range */}
        <View style={[styles.sectionCard, { backgroundColor: cardBg }]}>
          <FilterSection title="Revenue Range">
            <RangeSlider
              min={options.revenueMin}
              max={options.revenueMax}
              low={
                filters.revenueRange[0] === 0
                  ? options.revenueMin
                  : filters.revenueRange[0]
              }
              high={
                filters.revenueRange[1] === Infinity
                  ? options.revenueMax
                  : filters.revenueRange[1]
              }
              onValueChange={setRevenueRange}
            />
          </FilterSection>
        </View>

        {/* Size & Type side by side */}
        <View style={styles.row}>
          <View style={[styles.sectionCard, styles.halfCard, { backgroundColor: cardBg }]}>
            <FilterSection title="Size" count={filters.sizes.length}>
              <CheckboxGroup
                options={options.sizes}
                selected={filters.sizes}
                onToggle={toggleSize}
              />
            </FilterSection>
          </View>

          <View style={[styles.sectionCard, styles.halfCard, { backgroundColor: cardBg }]}>
            <FilterSection title="Type" count={filters.companyType ? 1 : 0}>
              <RadioGroup
                options={options.companyTypes}
                selected={filters.companyType}
                onSelect={setCompanyType}
              />
            </FilterSection>
          </View>
        </View>

      </BottomSheetScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: Spacing.xl,
    gap: Spacing.lg,
    paddingBottom: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
  },
  resetText: {
    fontSize: 14,
    fontWeight: '600',
  },
  applyButton: {
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.xl,
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  sectionCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  halfCard: {
    flex: 1,
  },
});
