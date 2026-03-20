import { StyleSheet, ScrollView, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { companies } from '@/data/companies';
import { DetailHeader } from '@/components/company/detail-header';
import { FinancialTable } from '@/components/company/financial-table';
import { InfoRow } from '@/components/company/info-row';
import { BoardMemberCard } from '@/components/company/board-member-card';
import { StockBadge } from '@/components/company/stock-badge';
import { OfficeCard } from '@/components/company/office-card';
import { Spacing } from '@/constants/layout';

export default function CompanyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const bgColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'border');

  const company = useMemo(
    () => companies.find((c) => c.id === id),
    [id]
  );

  if (!company) {
    return (
      <View style={[styles.centered, { backgroundColor: bgColor }]}>
        <ThemedText type="subtitle">Company not found</ThemedText>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: bgColor }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <DetailHeader company={company} />

      <View style={styles.section}>
        <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
          Company Info
        </ThemedText>
        <InfoRow icon="building.2" label="Headquarters" value={company.headquarters} />
        <InfoRow icon="person" label="CEO" value={company.ceo_name} />
        <InfoRow icon="calendar" label="Founded" value={String(company.founded_year)} />
        <InfoRow icon="tag" label="Industry" value={company.industry} />
        <InfoRow icon="chart.bar" label="Size" value={company.size} />
        <InfoRow icon="lock" label="Type" value={company.company_type} />
      </View>

      {company.stock_info && (
        <>
          <View style={[styles.divider, { backgroundColor: borderColor }]} />
          <View style={styles.section}>
            <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
              Stock Information
            </ThemedText>
            <StockBadge stock={company.stock_info} />
          </View>
        </>
      )}

      <View style={[styles.divider, { backgroundColor: borderColor }]} />

      <View style={styles.section}>
        <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
          Financials
        </ThemedText>
        <FinancialTable financials={company.financials} />
      </View>

      {company.board_members.length > 0 && (
        <>
          <View style={[styles.divider, { backgroundColor: borderColor }]} />
          <View style={styles.section}>
            <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
              Board Members
            </ThemedText>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            >
              {company.board_members.map((member) => (
                <BoardMemberCard key={member.id} member={member} />
              ))}
            </ScrollView>
          </View>
        </>
      )}

      {company.offices.length > 0 && (
        <>
          <View style={[styles.divider, { backgroundColor: borderColor }]} />
          <View style={styles.section}>
            <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
              Offices
            </ThemedText>
            {company.offices.map((office) => (
              <OfficeCard key={office.id} office={office} />
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingBottom: 60,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: Spacing.xs,
  },
  divider: {
    height: 1,
    marginHorizontal: Spacing.xl,
    marginVertical: Spacing.xl,
  },
  horizontalList: {
    gap: Spacing.md,
  },
});
