import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol, type IconSymbolName } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Spacing } from '@/constants/layout';

interface EmptyStateProps {
  title?: string;
  subtitle?: string;
  icon?: IconSymbolName;
}

export function EmptyState({
  title = 'No results found',
  subtitle = 'Try adjusting your search or filters',
  icon = 'magnifyingglass',
}: EmptyStateProps) {
  const iconColor = useThemeColor({}, 'textTertiary');

  return (
    <View style={styles.container}>
      <IconSymbol name={icon} size={48} color={iconColor} />
      <ThemedText type="subtitle" style={styles.title}>
        {title}
      </ThemedText>
      <ThemedText style={styles.subtitle} lightColor="#9BA1A6" darkColor="#687076">
        {subtitle}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  title: {
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 14,
  },
});
