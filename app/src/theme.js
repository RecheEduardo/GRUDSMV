// Design tokens centrais do app. Um unico ponto de verdade para cores,
// espacamentos, raios e tipografia — usado por todas as telas e componentes.

export const colors = {
  // Marca
  primary: '#6366f1',
  primaryDark: '#4f46e5',
  primarySoft: '#eef2ff',

  // Superficies
  background: '#f4f5fb',
  surface: '#ffffff',
  surfaceMuted: '#f8fafc',

  // Texto
  text: '#0f172a',
  textMuted: '#64748b',
  textFaint: '#94a3b8',

  // Bordas
  border: '#e2e8f0',

  // Semanticas
  success: '#16a34a',
  successSoft: '#dcfce7',
  danger: '#dc2626',
  dangerSoft: '#fee2e2',
  warning: '#d97706',
  warningSoft: '#fef3c7',
  like: '#e11d48',
  likeSoft: '#ffe4e6',

  white: '#ffffff',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
};

export const typography = {
  title: { fontSize: 26, fontWeight: '800', color: colors.text, letterSpacing: -0.5 },
  heading: { fontSize: 20, fontWeight: '700', color: colors.text, letterSpacing: -0.3 },
  subtitle: { fontSize: 15, fontWeight: '600', color: colors.textMuted },
  body: { fontSize: 15, color: colors.text },
  caption: { fontSize: 12, color: colors.textFaint },
};

// Sombra suave e consistente para cards (funciona em iOS/Android/web).
export const shadow = {
  shadowColor: '#0f172a',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.06,
  shadowRadius: 12,
  elevation: 2,
};

export default { colors, spacing, radius, typography, shadow };
