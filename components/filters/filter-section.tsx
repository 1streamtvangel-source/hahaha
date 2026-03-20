import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Spacing } from '@/constants/layout';
import type { ReactNode } from 'react';

interface FilterSectionProps {
  title: string;
  children: ReactNode;
  count?: number;
}

export function FilterSection({ title, children, count }: FilterSectionProps) {
  const accentColor = useThemeColor({}, 'accent');

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <ThemedText type="defaultSemiBold" style={styles.title}>
          {title}
        </ThemedText>
        {count !== undefined && count > 0 && (
          <ThemedText style={[styles.count, { color: accentColor }]}>
            {count} selected
          </ThemedText>
        )}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  count: {
    fontSize: 12,
    fontWeight: '500',
  },
});
