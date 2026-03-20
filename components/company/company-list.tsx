import { StyleSheet, FlatList, View } from 'react-native';
import { CompanyRecord } from '@/types/company';
import { CompanyCard } from './company-card';
import { EmptyState } from '@/components/ui/empty-state';
import { Spacing } from '@/constants/layout';

interface CompanyListProps {
  companies: CompanyRecord[];
  isSearching?: boolean;
  header?: React.ReactElement;
}

export function CompanyList({ companies, isSearching, header }: CompanyListProps) {
  return (
    <FlatList
      data={companies}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => <CompanyCard company={item} index={index} />}
      contentContainerStyle={styles.list}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListHeaderComponent={header}
      ListEmptyComponent={
        isSearching ? null : (
          <EmptyState
            title="No companies found"
            subtitle="Try adjusting your search or filters"
          />
        )
      }
      showsVerticalScrollIndicator={false}
      keyboardDismissMode="on-drag"
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 100,
  },
  separator: {
    height: Spacing.md,
  },
});
