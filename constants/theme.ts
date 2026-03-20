import { Platform } from 'react-native';

const accent = '#6366F1'; // indigo-500
const accentLight = '#818CF8'; // indigo-400

export const Colors = {
  light: {
    text: '#11181C',
    textSecondary: '#687076',
    textTertiary: '#9BA1A6',
    background: '#FFFFFF',
    backgroundSecondary: '#F4F4F5',
    tint: accent,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: accent,
    border: '#E4E4E7',
    borderLight: '#F0F0F2',
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    chipBackground: '#F0EEFF',
    chipText: accent,
    cardBackground: '#FFFFFF',
    searchBarBackground: '#F4F4F5',
    overlay: 'rgba(0, 0, 0, 0.4)',
    accent,
  },
  dark: {
    text: '#ECEDEE',
    textSecondary: '#9BA1A6',
    textTertiary: '#687076',
    background: '#09090B',
    backgroundSecondary: '#18181B',
    tint: accentLight,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: accentLight,
    border: '#27272A',
    borderLight: '#1E1E22',
    success: '#4ADE80',
    warning: '#FBBF24',
    error: '#F87171',
    chipBackground: '#1E1B4B',
    chipText: accentLight,
    cardBackground: '#18181B',
    searchBarBackground: '#1E1E22',
    overlay: 'rgba(0, 0, 0, 0.6)',
    accent: accentLight,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
