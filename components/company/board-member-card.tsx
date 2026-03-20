import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Spacing, BorderRadius, Shadows } from '@/constants/layout';
import { BoardMember } from '@/types/entities';

interface BoardMemberCardProps {
  member: BoardMember;
}

export function BoardMemberCard({ member }: BoardMemberCardProps) {
  const cardBg = useThemeColor({}, 'cardBackground');
  const borderColor = useThemeColor({}, 'borderLight');
  const accentColor = useThemeColor({}, 'accent');

  return (
    <View style={[styles.card, { backgroundColor: cardBg, borderColor }, Shadows.sm]}>
      <View style={[styles.avatar, { backgroundColor: accentColor + '20' }]}>
        <ThemedText style={[styles.avatarText, { color: accentColor }]}>
          {member.name.split(' ').map((n) => n[0]).join('')}
        </ThemedText>
      </View>
      <ThemedText type="defaultSemiBold" style={styles.name} numberOfLines={1}>
        {member.name}
      </ThemedText>
      <ThemedText style={styles.role} lightColor="#687076" darkColor="#9BA1A6" numberOfLines={1}>
        {member.role}
      </ThemedText>
      <ThemedText style={styles.since} lightColor="#9BA1A6" darkColor="#687076">
        Since {member.since_year}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 150,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '600',
  },
  name: {
    fontSize: 14,
    textAlign: 'center',
  },
  role: {
    fontSize: 12,
    textAlign: 'center',
  },
  since: {
    fontSize: 11,
  },
});
