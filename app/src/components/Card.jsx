import { Pressable, StyleSheet, View } from 'react-native';

import { colors, radius, shadow, spacing } from '../theme';

// Cartao base reutilizavel. Vira clicavel (com feedback) quando recebe onPress.
export default function Card({ children, onPress, style }) {
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.card, pressed && styles.pressed, style]}
      >
        {children}
      </Pressable>
    );
  }
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.995 }],
  },
});
