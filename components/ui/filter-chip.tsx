import { StyleSheet, Pressable } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { BorderRadius, Spacing } from '@/constants/layout';

interface FilterChipProps {
  label: string;
  onRemove: () => void;
}

export function FilterChip({ label, onRemove }: FilterChipProps) {
  const bgColor = useThemeColor({}, 'chipBackground');
  const textColor = useThemeColor({}, 'chipText');

  return (
    <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(150)}>
      <Pressable
        style={[styles.chip, { backgroundColor: bgColor }]}
        onPress={onRemove}
        hitSlop={4}
      >
        <Animated.Text style={[styles.label, { color: textColor }]}>{label}</Animated.Text>
        <IconSymbol name="xmark" size={10} color={textColor} />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    gap: Spacing.xs,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
  },
});
