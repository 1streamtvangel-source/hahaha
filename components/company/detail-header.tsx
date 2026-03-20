import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Spacing, BorderRadius } from '@/constants/layout';
import { CompanyRecord } from '@/types/company';
import { formatCurrency } from '@/utils/format';

const INDUSTRY_COLORS: Record<string, string> = {
  Technology: '#6366F1',
  Finance: '#0EA5E9',
  Healthcare: '#22C55E',
  Energy: '#F59E0B',
  Retail: '#EC4899',
  Automotive: '#EF4444',
  Aerospace: '#8B5CF6',
};

interface DetailHeaderProps {
  company: CompanyRecord;
}

export function DetailHeader({ company }: DetailHeaderProps) {
  const industryColor = INDUSTRY_COLORS[company.industry] ?? '#6366F1';
  const borderColor = useThemeColor({}, 'borderLight');
  const latestRevenue = company.financials[0]?.revenue;

  return (
    <View style={styles.container}>
      <View style={[styles.initial, { backgroundColor: industryColor }]}>
        <ThemedText style={styles.initialText}>{company.name.charAt(0)}</ThemedText>
      </View>
      <ThemedText type="title" style={styles.name}>
        {company.name}
      </ThemedText>
      <ThemedText style={styles.country} lightColor="#687076" darkColor="#9BA1A6">
        {company.country}
      </ThemedText>

      <View style={styles.badges}>
        <View style={[styles.badge, { backgroundColor: industryColor + '18' }]}>
          <ThemedText style={[styles.badgeText, { color: industryColor }]}>
            {company.industry}
          </ThemedText>
        </View>
        <View style={[styles.badge, { backgroundColor: borderColor }]}>
          <ThemedText style={styles.badgeMuted} lightColor="#687076" darkColor="#9BA1A6">
            {company.size}
          </ThemedText>
        </View>
        <View style={[styles.badge, { backgroundColor: borderColor }]}>
          <ThemedText style={styles.badgeMuted} lightColor="#687076" darkColor="#9BA1A6">
            {company.company_type}
          </ThemedText>
        </View>
      </View>

      {latestRevenue !== undefined && (
        <ThemedText type="title" style={styles.revenue}>
          {formatCurrency(latestRevenue)}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
  },
  initial: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  initialText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
  },
  name: {
    fontSize: 24,
    textAlign: 'center',
  },
  country: {
    fontSize: 15,
  },
  badges: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  badge: {
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  badgeMuted: {
    fontSize: 13,
    fontWeight: '500',
  },
  revenue: {
    fontSize: 28,
    marginTop: Spacing.sm,
  },
});
