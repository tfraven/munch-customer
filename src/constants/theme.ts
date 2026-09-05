import '@/global.css';
import { Platform } from 'react-native';

export const Colors = {
  light: {
    primary: '#FF6B00',
    primaryDark: '#E05300',
    primaryLight: '#FFF2EB',
    secondary: '#10B981',
    secondaryLight: '#ECFDF5',
    accent: '#F59E0B',
    accentLight: '#FEF3C7',
    danger: '#EF4444',
    dangerLight: '#FEE2E2',
    text: '#0F172A',
    textSecondary: '#64748B',
    textMuted: '#94A3B8',
    background: '#F8FAFC',
    card: '#FFFFFF',
    surface: '#FFFFFF',
    backgroundElement: '#F1F5F9',
    backgroundSelected: '#FFE8D9',
    border: '#E2E8F0',
    borderLight: '#F1F5F9',
    divider: '#E2E8F0',
    badge: '#FF6B00',
    badgeText: '#FFFFFF',
    gold: '#FBBF24',
    overlay: 'rgba(15, 23, 42, 0.65)',
    white: '#FFFFFF',
    black: '#000000',
  },
  dark: {
    primary: '#FF7D1A',
    primaryDark: '#FF6B00',
    primaryLight: '#2D1B10',
    secondary: '#10B981',
    secondaryLight: '#064E3B',
    accent: '#FBBF24',
    accentLight: '#451A03',
    danger: '#F87171',
    dangerLight: '#450A0A',
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    background: '#0B0F17',
    card: '#161D2B',
    surface: '#1A2234',
    backgroundElement: '#1F293D',
    backgroundSelected: '#3B2416',
    border: '#2A364E',
    borderLight: '#1E293B',
    divider: '#2A364E',
    badge: '#FF7D1A',
    badgeText: '#FFFFFF',
    gold: '#FBBF24',
    overlay: 'rgba(0, 0, 0, 0.85)',
    white: '#FFFFFF',
    black: '#000000',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light;

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
    sans: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    serif: 'Georgia, Cambria, serif',
    rounded: '"Quicksand", "Nunito", sans-serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 48,
  seven: 64,
} as const;

export const BorderRadius = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 22,
  full: 9999,
};

export const Shadows = {
  sm: Platform.select({
    web: {
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)',
    },
    default: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
  }),
  md: Platform.select({
    web: {
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    },
    default: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4,
    },
  }),
  lg: Platform.select({
    web: {
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.12), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    },
    default: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.18,
      shadowRadius: 8,
      elevation: 8,
    },
  }),
};

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 900;
