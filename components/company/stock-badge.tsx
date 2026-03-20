import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Spacing, BorderRadius, Shadows } from '@/constants/layout';
import { StockInfo } from '@/types/entities';
import { abbreviateNumber } from '@/utils/format';

interface StockBadgeProps {
  stock: StockInfo;
}

export function StockBadge({ stock }: StockBadgeProps) {
  const cardBg = useThemeColor({}, 'cardBackground');
  const borderColor = useThemeColor({}, 'borderLight');
  const accentColor = useThemeColor({}, 'accent');

  return (
    <View style={[styles.card, { backgroundColor: cardBg, borderColor }, Shadows.sm]}>
      <View style={styles.topRow}>
        <View>
          <ThemedText type="defaultSemiBold" style={[styles.ticker, { color: accentColor }]}>
            {stock.ticker}
          </ThemedText>
          <ThemedText style={styles.exchange} lightColor="#687076" darkColor="#9BA1A6">
            {stock.exchange}
          </ThemedText>
        </View>
        <ThemedText type="title" style={styles.price}>
          ${stock.stock_price.toFixed(2)}
        </ThemedText>
      </View>
      <View style={[styles.divider, { backgroundColor: borderColor }]} />
      <View style={styles.bottomRow}>
        <View style={styles.stat}>
          <ThemedText style={styles.statLabel} lightColor="#9BA1A6" darkColor="#687076">
            Market Cap
          </ThemedText>
          <ThemedText type="defaultSemiBold" style={styles.statValue}>
            ${abbreviateNumber(stock.market_cap)}
          </ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  ticker: {
    fontSize: 18,
  },
  exchange: {
    fontSize: 13,
    marginTop: 2,
  },
  price: {
    fontSize: 24,
  },
  divider: {
    height: 1,
  },
  bottomRow: {
    flexDirection: 'row',
  },
  stat: {
    gap: 2,
  },
  statLabel: {
    fontSize: 12,
  },
  statValue: {
    fontSize: 15,
  },
});
