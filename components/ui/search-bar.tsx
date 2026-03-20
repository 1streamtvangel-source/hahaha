import { StyleSheet, TextInput, View, Pressable } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { ThemedText } from '@/components/themed-text';
import { BorderRadius, Spacing } from '@/constants/layout';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  showHint?: boolean;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search companies...',
  showHint = true,
}: SearchBarProps) {
  const bgColor = useThemeColor({}, 'searchBarBackground');
  const textColor = useThemeColor({}, 'text');
  const placeholderColor = useThemeColor({}, 'textTertiary');
  const iconColor = useThemeColor({}, 'textSecondary');

  return (
    <View style={styles.wrapper}>
      <View style={[styles.container, { backgroundColor: bgColor }]}>
        <IconSymbol name="magnifyingglass" size={18} color={iconColor} />
        <TextInput
          style={[styles.input, { color: textColor }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={placeholderColor}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
        />
        {value.length > 0 && (
          <Pressable onPress={() => onChangeText('')} hitSlop={8}>
            <IconSymbol name="xmark.circle.fill" size={18} color={placeholderColor} />
          </Pressable>
        )}
      </View>
      {showHint && (
        <ThemedText style={styles.hint} lightColor="#9BA1A6" darkColor="#687076">
          {'Try: "Amazon" · industry:Tech · revenue>50000000000'}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: Spacing.xs,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  },
  hint: {
    fontSize: 11,
    paddingHorizontal: Spacing.xs,
  },
});
