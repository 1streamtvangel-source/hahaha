import { StyleSheet, View, Pressable } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { BorderRadius, Spacing } from '@/constants/layout';

interface ChipSelectorProps {
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}

export function ChipSelector({ options, selected, onToggle }: ChipSelectorProps) {
  const borderColor = useThemeColor({}, 'border');
  const chipBg = useThemeColor({}, 'chipBackground');
  const chipText = useThemeColor({}, 'chipText');
  const selectedSet = new Set(selected);

  return (
    <View style={styles.container}>
      {options.map((option) => {
        const isSelected = selectedSet.has(option);
        return (
          <Pressable
            key={option}
            style={[
              styles.chip,
              isSelected
                ? { backgroundColor: chipBg, borderColor: chipText }
                : { borderColor },
            ]}
            onPress={() => onToggle(option)}
          >
            {isSelected && (
              <IconSymbol name="checkmark" size={12} color={chipText} />
            )}
            <ThemedText
              style={[styles.label, isSelected && { color: chipText, fontWeight: '600' }]}
            >
              {option}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.xs,
  },
  label: {
    fontSize: 13,
  },
});
