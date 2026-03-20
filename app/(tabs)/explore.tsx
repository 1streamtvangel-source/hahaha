import { StyleSheet, View, SectionList, Pressable } from 'react-native';
import { useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { companies } from '@/data/companies';
import { CompanyRecord } from '@/types/company';
import { formatCurrency } from '@/utils/format';
import { Spacing, BorderRadius, Shadows } from '@/constants/layout';

const INDUSTRY_COLORS: Record<string, string> = {
  Technology: '#6366F1',
  Finance: '#0EA5E9',
  Healthcare: '#22C55E',
  Energy: '#F59E0B',
  Retail: '#EC4899',
  Automotive: '#EF4444',
  Aerospace: '#8B5CF6',
};

interface Section {
  title: string;
  data: CompanyRecord[];
  color: string;
}

export default function ExploreScreen() {
  const bgColor = useThemeColor({}, 'background');
  const cardBg = useThemeColor({}, 'cardBackground');
  const borderColor = useThemeColor({}, 'borderLight');
  const router = useRouter();

  const sections: Section[] = useMemo(() => {
    const map = new Map<string, CompanyRecord[]>();
    for (const company of companies) {
      const list = map.get(company.industry) ?? [];
      list.push(company);
      map.set(company.industry, list);
    }
    return [...map.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([industry, data]) => ({
        title: industry,
        data,
        color: INDUSTRY_COLORS[industry] ?? '#6366F1',
      }));
  }, []);

  const handlePress = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/company/${id}`);
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: bgColor }]} edges={['top']}>
      <View style={styles.titleRow}>
        <ThemedText type="title" style={styles.title}>
          Explore
        </ThemedText>
        <ThemedText style={styles.subtitle} lightColor="#9BA1A6" darkColor="#687076">
          Browse companies by industry
        </ThemedText>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionDot, { backgroundColor: section.color }]} />
            <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
              {section.title}
            </ThemedText>
            <ThemedText style={styles.sectionCount} lightColor="#9BA1A6" darkColor="#687076">
              {section.data.length}
            </ThemedText>
          </View>
        )}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.duration(250).delay(index * 30)}>
            <Pressable
              style={({ pressed }) => [
                styles.card,
                { backgroundColor: cardBg, borderColor },
                Shadows.sm,
                pressed && styles.pressed,
              ]}
              onPress={() => handlePress(item.id)}
            >
              <View style={styles.cardRow}>
                <View
                  style={[
                    styles.initial,
                    { backgroundColor: INDUSTRY_COLORS[item.industry] ?? '#6366F1' },
                  ]}
                >
                  <ThemedText style={styles.initialText}>{item.name.charAt(0)}</ThemedText>
                </View>
                <View style={styles.cardInfo}>
                  <ThemedText type="defaultSemiBold" numberOfLines={1}>{item.name}</ThemedText>
                  <ThemedText style={styles.cardMeta} lightColor="#687076" darkColor="#9BA1A6">
                    {item.country} · {item.size} · {item.company_type}
                  </ThemedText>
                </View>
                {item.financials[0] && (
                  <ThemedText type="defaultSemiBold" style={styles.revenue}>
                    {formatCurrency(item.financials[0].revenue)}
                  </ThemedText>
                )}
              </View>
            </Pressable>
          </Animated.View>
        )}
        renderSectionFooter={() => <View style={styles.sectionFooter} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  titleRow: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.lg,
    gap: Spacing.xs,
  },
  title: {
    fontSize: 28,
  },
  subtitle: {
    fontSize: 14,
  },
  list: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 100,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xs,
  },
  sectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 16,
    flex: 1,
  },
  sectionCount: {
    fontSize: 13,
  },
  sectionFooter: {
    height: Spacing.lg,
  },
  card: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  pressed: {
    opacity: 0.7,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  initial: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  cardInfo: {
    flex: 1,
  },
  cardMeta: {
    fontSize: 12,
    marginTop: 2,
  },
  revenue: {
    fontSize: 14,
  },
});
