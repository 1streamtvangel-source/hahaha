import { StyleSheet, View, Platform } from 'react-native';
import { useCallback } from 'react';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Spacing, BorderRadius } from '@/constants/layout';
import { formatCurrency } from '@/utils/format';

interface RangeSliderProps {
  min: number;
  max: number;
  low: number;
  high: number;
  onValueChange: (low: number, high: number) => void;
  step?: number;
}

export function RangeSlider({
  min,
  max,
  low,
  high,
  onValueChange,
  step,
}: RangeSliderProps) {
  const accentColor = useThemeColor({}, 'accent');
  const trackBg = useThemeColor({}, 'border');
  const thumbBg = useThemeColor({}, 'cardBackground');
  const textSecondary = useThemeColor({}, 'textSecondary');

  const computedStep = step ?? Math.max(1, Math.round((max - min) / 200));

  const handleValuesChange = useCallback(
    (values: number[]) => {
      onValueChange(values[0], values[1]);
    },
    [onValueChange]
  );

  const CustomThumb = () => (
    <View
      style={[
        styles.thumb,
        {
          backgroundColor: thumbBg,
          borderColor: accentColor,
        },
        Platform.OS === 'ios' ? styles.thumbShadowIOS : styles.thumbShadowAndroid,
      ]}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.labels}>
        <View style={[styles.valueBadge, { backgroundColor: accentColor + '14' }]}>
          <ThemedText style={[styles.valueText, { color: accentColor }]}>
            {formatCurrency(low)}
          </ThemedText>
        </View>
        <ThemedText style={[styles.dash, { color: textSecondary }]}>—</ThemedText>
        <View style={[styles.valueBadge, { backgroundColor: accentColor + '14' }]}>
          <ThemedText style={[styles.valueText, { color: accentColor }]}>
            {formatCurrency(high)}
          </ThemedText>
        </View>
      </View>

      <View style={styles.sliderWrapper}>
        <MultiSlider
          values={[low, high]}
          min={min}
          max={max}
          step={computedStep}
          onValuesChange={handleValuesChange}
          sliderLength={280}
          selectedStyle={{ backgroundColor: accentColor }}
          unselectedStyle={{ backgroundColor: trackBg }}
          trackStyle={styles.track}
          markerContainerStyle={styles.markerContainer}
          customMarker={CustomThumb}
          snapped
          allowOverlap={false}
          minMarkerOverlapDistance={20}
        />
      </View>

      <View style={styles.minMax}>
        <ThemedText style={[styles.minMaxText, { color: textSecondary }]}>
          {formatCurrency(min)}
        </ThemedText>
        <ThemedText style={[styles.minMaxText, { color: textSecondary }]}>
          {formatCurrency(max)}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
  },
  labels: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  valueBadge: {
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
  },
  valueText: {
    fontSize: 14,
    fontWeight: '600',
  },
  dash: {
    fontSize: 14,
  },
  sliderWrapper: {
    alignItems: 'center',
  },
  track: {
    height: 5,
    borderRadius: 3,
  },
  markerContainer: {
    paddingTop: 2,
  },
  thumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 3,
  },
  thumbShadowIOS: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  thumbShadowAndroid: {
    elevation: 4,
  },
  minMax: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xs,
  },
  minMaxText: {
    fontSize: 11,
  },
});
