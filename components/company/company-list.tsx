import { StyleSheet, FlatList, View, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import React from 'react';
import { CompanyRecord } from '@/types/company';
import { CompanyCard } from './company-card';
import { EmptyState } from '@/components/ui/empty-state';
import { Spacing } from '@/constants/layout';

interface CompanyListProps {
  companies: CompanyRecord[];
  isSearching?: boolean;
  header?: React.ReactElement;
  listRef?: React.RefObject<FlatList | null>;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

export function CompanyList({ companies, isSearching, header, listRef, onScroll }: CompanyListProps) {
  return (
    <FlatList
      ref={listRef}
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
      onScroll={onScroll}
      scrollEventThrottle={16}
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
