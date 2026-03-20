import { StyleSheet, Pressable, View } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { BorderRadius, Spacing } from '@/constants/layout';

interface CheckboxGroupProps {
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}

export function CheckboxGroup({ options, selected, onToggle }: CheckboxGroupProps) {
  const borderColor = useThemeColor({}, 'border');
  const accentColor = useThemeColor({}, 'accent');
  const selectedSet = new Set(selected);

  return (
    <View style={styles.container}>
      {options.map((option) => {
        const isSelected = selectedSet.has(option);
        return (
          <Pressable
            key={option}
            style={styles.row}
            onPress={() => onToggle(option)}
          >
            <View
              style={[
                styles.checkbox,
                { borderColor: isSelected ? accentColor : borderColor },
                isSelected && { backgroundColor: accentColor },
              ]}
            >
              {isSelected && (
                <IconSymbol name="checkmark" size={12} color="#FFFFFF" />
              )}
            </View>
            <ThemedText style={styles.label}>{option}</ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: BorderRadius.sm,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 15,
  },
});
