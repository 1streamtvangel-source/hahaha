import { StyleSheet, View } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Spacing } from '@/constants/layout';

interface InfoRowProps {
  icon: string;
  label: string;
  value: string;
}

export function InfoRow({ icon, label, value }: InfoRowProps) {
  const iconColor = useThemeColor({}, 'textTertiary');

  return (
    <View style={styles.row}>
      <IconSymbol name={icon as never} size={18} color={iconColor} />
      <ThemedText style={styles.label} lightColor="#687076" darkColor="#9BA1A6">
        {label}
      </ThemedText>
      <ThemedText style={styles.value}>{value}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  label: {
    fontSize: 14,
    width: 100,
  },
  value: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'right',
  },
});
