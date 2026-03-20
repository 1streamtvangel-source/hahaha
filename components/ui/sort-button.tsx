import { StyleSheet, Pressable, View, Modal, FlatList } from 'react-native';
import { useState } from 'react';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { BorderRadius, Spacing, Shadows } from '@/constants/layout';
import { SortField, SortDirection } from '@/types/filters';

const SORT_LABELS: Record<SortField, string> = {
  name: 'Name',
  revenue: 'Revenue',
  founded_year: 'Founded Year',
  company_type: 'Type',
  size: 'Size',
  country: 'Country',
  net_income: 'Net Income',
};

const SORT_FIELDS: SortField[] = [
  'name',
  'revenue',
  'founded_year',
  'size',
  'country',
  'company_type',
  'net_income',
];

interface SortButtonProps {
  field: SortField;
  direction: SortDirection;
  onSelectField: (field: SortField) => void;
  onToggleDirection: () => void;
}

export function SortButton({
  field,
  direction,
  onSelectField,
  onToggleDirection,
}: SortButtonProps) {
  const [showPicker, setShowPicker] = useState(false);
  const borderColor = useThemeColor({}, 'border');
  const bgColor = useThemeColor({}, 'cardBackground');
  const overlayColor = useThemeColor({}, 'overlay');
  const accentColor = useThemeColor({}, 'accent');

  return (
    <>
      <View style={styles.row}>
        <Pressable
          style={[styles.button, { borderColor }]}
          onPress={() => setShowPicker(true)}
        >
          <IconSymbol name="arrow.up.arrow.down" size={14} color={accentColor} />
          <ThemedText style={styles.buttonText}>{SORT_LABELS[field]}</ThemedText>
        </Pressable>

        <Pressable
          style={[styles.directionButton, { borderColor }]}
          onPress={onToggleDirection}
        >
          <IconSymbol
            name={direction === 'asc' ? 'arrow.up' : 'arrow.down'}
            size={14}
            color={accentColor}
          />
        </Pressable>
      </View>

      <Modal visible={showPicker} transparent animationType="fade">
        <Pressable style={[styles.overlay, { backgroundColor: overlayColor }]} onPress={() => setShowPicker(false)}>
          <View style={[styles.picker, { backgroundColor: bgColor }, Shadows.lg]}>
            <ThemedText type="defaultSemiBold" style={styles.pickerTitle}>
              Sort by
            </ThemedText>
            <FlatList
              data={SORT_FIELDS}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.pickerItem}
                  onPress={() => {
                    onSelectField(item);
                    setShowPicker(false);
                  }}
                >
                  <ThemedText
                    style={[
                      styles.pickerItemText,
                      item === field && { color: accentColor, fontWeight: '600' },
                    ]}
                  >
                    {SORT_LABELS[item]}
                  </ThemedText>
                  {item === field && (
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
  row: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.xs,
  },
  buttonText: {
    fontSize: 13,
    fontWeight: '500',
  },
  directionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
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
