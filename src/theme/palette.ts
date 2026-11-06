/**
 * Primitive color scales — the raw material for the semantic tokens in
 * `colors.ts`. Components should NOT import from here; consume semantic
 * tokens via `useAppTheme()` instead so light/dark resolves automatically.
 *
 * Direction: "Modern Civic" — navy anchor + civic-blue accent, warm neutrals.
 */

export const Palette = {
  // Brand navy
  navy: {
    50: '#EAF0F8',
    100: '#D4E0F0',
    200: '#A9C0DF',
    300: '#7D9BC6',
    400: '#4F73A6',
    500: '#2B4C7E',
    600: '#223D66',
    700: '#1A2F4F',
    800: '#13223B',
    900: '#0D1727',
  },
  // Civic blue accent
  blue: {
    50: '#E8F1FE',
    100: '#D0E2FD',
    200: '#A6C8FB',
    300: '#6EA8FF',
    400: '#4F93F8',
    500: '#3B82F6',
    600: '#2E6AD1',
    700: '#2554A8',
  },
  // Neutrals (cool slate)
  slate: {
    0: '#FFFFFF',
    25: '#F7F9FC',
    50: '#F1F5FA',
    100: '#E6ECF4',
    200: '#D3DBE8',
    300: '#B6C1D1',
    400: '#8A95A6',
    500: '#5B6675',
    600: '#3F4A5A',
    700: '#2A3443',
    800: '#1A212C',
    900: '#111720',
  },
  // Semantic hues
  red: {
    subtleLight: '#FCEAED',
    light: '#C41E3A',
    pressed: '#A5182F',
    dark: '#FF6B81',
    darkPressed: '#F0566E',
    subtleDark: '#2A1720',
  },
  green: {
    subtleLight: '#E6F4EC',
    light: '#15803D',
    dark: '#4ADE80',
    subtleDark: '#122A1C',
  },
  amber: {
    subtleLight: '#FCF0E3',
    light: '#B45309',
    dark: '#FBBF24',
    subtleDark: '#2A2210',
  },
  // Dark-mode greys
  ink: {
    bg: '#0D1117',
    surface: '#161B22',
    elevated: '#1C232D',
    sunken: '#10151C',
    pressed: '#1F2730',
    border: '#273040',
    borderStrong: '#35414F',
    text: '#E6EDF5',
    textSecondary: '#AAB4C2',
    textMuted: '#7A8597',
    textDisabled: '#5A6472',
    inputBorder: '#2E3848',
  },
  black: '#000000',
  white: '#FFFFFF',
} as const;
