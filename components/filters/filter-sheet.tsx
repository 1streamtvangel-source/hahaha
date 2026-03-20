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
  const snapPoints = useMemo(() => ['90%'], []);

  const bgColor = useThemeColor({}, 'background');
  const handleColor = useThemeColor({}, 'textTertiary');
  const accentColor = useThemeColor({}, 'accent');
  const cardBg = useThemeColor({}, 'backgroundSecondary');
  const borderColor = useThemeColor({}, 'border');

  const { filters } = state;

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

  const handleApply = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    sheetRef.current?.close();
  }, [sheetRef]);

  const handleClose = useCallback(() => {
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
      {/* Sticky Header */}
      <View style={[styles.header, { borderBottomColor: borderColor }]}>
        <View style={styles.headerSpacer} />
        <ThemedText type="defaultSemiBold" style={styles.headerTitle}>
          Filters
        </ThemedText>
        <Pressable onPress={handleClose} hitSlop={8} style={styles.closeButton}>
          <IconSymbol name="xmark" size={16} color={accentColor} />
        </Pressable>
      </View>

      {/* Scrollable Filter Content */}
      <BottomSheetScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.sectionCard, { backgroundColor: cardBg }]}>
          <FilterSection title="Industry" count={filters.industries.length}>
            <ChipSelector
              options={options.industries}
              selected={filters.industries}
              onToggle={toggleIndustry}
            />
          </FilterSection>
        </View>

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

      {/* Sticky Footer */}
      <View style={[styles.footer, { borderTopColor: borderColor, backgroundColor: bgColor }]}>
        <Pressable onPress={handleReset} style={[styles.resetButton, { borderColor }]}>
          <ThemedText style={[styles.resetText, { color: accentColor }]}>
            Reset
          </ThemedText>
        </Pressable>
        <Pressable
          style={[styles.applyButton, { backgroundColor: accentColor }]}
          onPress={handleApply}
        >
          <ThemedText style={styles.applyButtonText}>
            Apply{activeCount > 0 ? ` (${activeCount})` : ''}
          </ThemedText>
        </Pressable>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
  },
  headerSpacer: {
    width: 32,
  },
  headerTitle: {
    fontSize: 17,
    textAlign: 'center',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: Spacing.xl,
    gap: Spacing.lg,
    paddingBottom: Spacing.lg,
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
  footer: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    paddingBottom: Spacing.xxl,
    borderTopWidth: 1,
  },
  resetButton: {
    flex: 1,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    paddingVertical: Spacing.md + 2,
    alignItems: 'center',
  },
  resetText: {
    fontSize: 16,
    fontWeight: '600',
  },
  applyButton: {
    flex: 2,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md + 2,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
