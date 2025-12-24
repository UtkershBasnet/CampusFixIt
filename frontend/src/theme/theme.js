import { colors } from './colors';

export const theme = {
  colors: { ...colors },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    s: 4,
    m: 8,
    l: 12,
    xl: 20,
    round: 999,
  },
  typography: {
    h1: {
      fontSize: 30,
      fontWeight: '700',
      color: colors.text,
    },
    h2: {
      fontSize: 24,
      fontWeight: '600',
      color: colors.text,
    },
    body: {
      fontSize: 16,
      color: colors.text,
    },
    caption: {
      fontSize: 14,
      color: colors.textLight,
    },
    button: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.white,
    },
  },
  shadows: {
    card: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
  },
};
