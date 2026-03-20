import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Spacing, BorderRadius } from '@/constants/layout';
import { FinancialData } from '@/types/company';
import { formatCurrency } from '@/utils/format';

interface FinancialTableProps {
  financials: FinancialData[];
}

export function FinancialTable({ financials }: FinancialTableProps) {
  const headerBg = useThemeColor({}, 'backgroundSecondary');
  const borderColor = useThemeColor({}, 'border');

  return (
    <View style={[styles.table, { borderColor }]}>
      <View style={[styles.row, styles.headerRow, { backgroundColor: headerBg }]}>
        <ThemedText style={[styles.cell, styles.headerCell]}>Year</ThemedText>
        <ThemedText style={[styles.cell, styles.headerCell, styles.rightAlign]}>Revenue</ThemedText>
        <ThemedText style={[styles.cell, styles.headerCell, styles.rightAlign]}>Net Income</ThemedText>
      </View>
      {financials.map((fin, index) => (
        <View
          key={fin.year}
          style={[
            styles.row,
            index < financials.length - 1 && { borderBottomWidth: 1, borderColor },
          ]}
        >
          <ThemedText style={styles.cell}>{fin.year}</ThemedText>
          <ThemedText style={[styles.cell, styles.rightAlign]}>
            {formatCurrency(fin.revenue)}
          </ThemedText>
          <ThemedText
            style={[styles.cell, styles.rightAlign]}
            lightColor={fin.net_income < 0 ? '#EF4444' : undefined}
            darkColor={fin.net_income < 0 ? '#F87171' : undefined}
          >
            {formatCurrency(fin.net_income)}
          </ThemedText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  table: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  headerRow: {
    borderBottomWidth: 1,
  },
  cell: {
    flex: 1,
    fontSize: 14,
  },
  headerCell: {
    fontWeight: '600',
    fontSize: 13,
  },
  rightAlign: {
    textAlign: 'right',
  },
});
