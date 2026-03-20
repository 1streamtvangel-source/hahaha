import { StyleSheet, Pressable, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Spacing } from '@/constants/layout';

interface RadioGroupProps {
  options: string[];
  selected: string | null;
  onSelect: (value: string | null) => void;
  allowDeselect?: boolean;
}

export function RadioGroup({
  options,
  selected,
  onSelect,
  allowDeselect = true,
}: RadioGroupProps) {
  const borderColor = useThemeColor({}, 'border');
  const accentColor = useThemeColor({}, 'accent');

  return (
    <View style={styles.container}>
      {options.map((option) => {
        const isSelected = option === selected;
        return (
          <Pressable
            key={option}
            style={styles.row}
            onPress={() => {
              if (isSelected && allowDeselect) {
                onSelect(null);
              } else {
                onSelect(option);
              }
            }}
          >
            <View style={[styles.radio, { borderColor: isSelected ? accentColor : borderColor }]}>
              {isSelected && (
                <View style={[styles.radioInner, { backgroundColor: accentColor }]} />
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
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  label: {
    fontSize: 15,
  },
});
