import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { colors, radius, spacing } from '../theme';

// Botao padrao do app com variantes de estilo.
//   variant: 'primary' | 'secondary' | 'danger' | 'ghost'
//   size: 'md' (padrao) | 'sm'
export default function AppButton({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
}) {
  const isDisabled = disabled || loading;
  const v = VARIANTS[variant] || VARIANTS.primary;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        size === 'sm' && styles.sm,
        { backgroundColor: v.bg, borderColor: v.border },
        v.bordered && styles.bordered,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={v.fg} size="small" />
      ) : (
        <Text style={[styles.text, size === 'sm' && styles.textSm, { color: v.fg }]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const VARIANTS = {
  primary: { bg: colors.primary, fg: colors.white, border: 'transparent' },
  secondary: {
    bg: colors.primarySoft,
    fg: colors.primaryDark,
    border: 'transparent',
  },
  danger: { bg: colors.danger, fg: colors.white, border: 'transparent' },
  ghost: {
    bg: 'transparent',
    fg: colors.primaryDark,
    border: colors.border,
    bordered: true,
  },
};

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  sm: {
    minHeight: 38,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
  },
  bordered: {
    borderWidth: 1,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  textSm: {
    fontSize: 14,
  },
});
