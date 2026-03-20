import { StyleSheet, Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { BorderRadius, Spacing, Shadows } from '@/constants/layout';
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

interface CompanyCardProps {
  company: CompanyRecord;
  index: number;
}

export function CompanyCard({ company, index }: CompanyCardProps) {
  const router = useRouter();
  const cardBg = useThemeColor({}, 'cardBackground');
  const borderColor = useThemeColor({}, 'borderLight');
  const industryColor = INDUSTRY_COLORS[company.industry] ?? '#6366F1';
  const latestRevenue = company.financials[0]?.revenue;

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/company/${company.id}`);
  };

  return (
    <Animated.View entering={FadeInDown.duration(300).delay(index * 50).springify()}>
      <Pressable
        style={({ pressed }) => [
          styles.card,
          { backgroundColor: cardBg, borderColor },
          Shadows.md,
          pressed && styles.pressed,
        ]}
        onPress={handlePress}
      >
        <View style={styles.topRow}>
          <View style={[styles.initial, { backgroundColor: industryColor }]}>
            <ThemedText style={styles.initialText}>
              {company.name.charAt(0)}
            </ThemedText>
          </View>
          <View style={styles.headerInfo}>
            <ThemedText type="defaultSemiBold" style={styles.name} numberOfLines={1}>
              {company.name}
            </ThemedText>
            <ThemedText style={styles.country} lightColor="#687076" darkColor="#9BA1A6">
              {company.country}
            </ThemedText>
          </View>
          {latestRevenue !== undefined && (
            <ThemedText type="defaultSemiBold" style={styles.revenue}>
              {formatCurrency(latestRevenue)}
            </ThemedText>
          )}
        </View>

        <View style={styles.badges}>
          <View style={[styles.badge, { backgroundColor: industryColor + '18' }]}>
            <ThemedText style={[styles.badgeText, { color: industryColor }]}>
              {company.industry}
            </ThemedText>
          </View>
          <View style={[styles.badge, { backgroundColor: borderColor }]}>
            <ThemedText style={styles.badgeTextMuted} lightColor="#687076" darkColor="#9BA1A6">
              {company.size}
            </ThemedText>
          </View>
          <View style={[styles.badge, { backgroundColor: borderColor }]}>
            <ThemedText style={styles.badgeTextMuted} lightColor="#687076" darkColor="#9BA1A6">
              {company.company_type}
            </ThemedText>
          </View>
        </View>

        <View style={styles.metaRow}>
          <ThemedText style={styles.meta} lightColor="#9BA1A6" darkColor="#687076">
            Est. {company.founded_year} · {company.headquarters}
          </ThemedText>
          <ThemedText style={styles.meta} lightColor="#9BA1A6" darkColor="#687076">
            {company.ceo_name}
          </ThemedText>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  initial: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
  },
  country: {
    fontSize: 13,
  },
  revenue: {
    fontSize: 16,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  badge: {
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  badgeTextMuted: {
    fontSize: 12,
    fontWeight: '500',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  meta: {
    fontSize: 12,
  },
});
