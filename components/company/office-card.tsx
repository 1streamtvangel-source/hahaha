import { StyleSheet, View } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Spacing, BorderRadius } from '@/constants/layout';
import { Office } from '@/types/entities';
import { formatNumber } from '@/utils/format';

interface OfficeCardProps {
  office: Office;
}

export function OfficeCard({ office }: OfficeCardProps) {
  const borderColor = useThemeColor({}, 'border');
  const iconColor = useThemeColor({}, 'textTertiary');

  return (
    <View style={[styles.card, { borderColor }]}>
      <View style={styles.row}>
        <IconSymbol name="mappin.and.ellipse" size={18} color={iconColor} />
        <View style={styles.info}>
          <ThemedText type="defaultSemiBold" style={styles.city}>
            {office.city}, {office.country}
          </ThemedText>
          <ThemedText style={styles.meta} lightColor="#687076" darkColor="#9BA1A6">
            {office.type} · {formatNumber(office.employee_count)} employees
          </ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  city: {
    fontSize: 14,
  },
  meta: {
    fontSize: 12,
  },
});
