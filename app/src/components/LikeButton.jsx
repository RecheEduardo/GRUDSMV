import { Pressable, StyleSheet, Text } from 'react-native';

import { useLikes } from '../hooks/useLikes';
import { colors, radius } from '../theme';

// Botao de curtida reutilizavel para artigos e comentarios. Usa useLikes para
// o estado otimista. Para de propagar o toque para nao abrir o detalhe ao
// curtir dentro de um card clicavel.
export default function LikeButton({ entity, type = 'article' }) {
  const { liked, count, pending, toggle } = useLikes(entity, type);

  function handlePress(e) {
    e?.stopPropagation?.();
    toggle();
  }

  return (
    <Pressable
      onPress={handlePress}
      disabled={pending}
      style={({ pressed }) => [
        styles.button,
        liked && styles.buttonLiked,
        pressed && styles.pressed,
      ]}
      hitSlop={8}
    >
      <Text style={[styles.text, liked && styles.textLiked]}>
        {liked ? '♥' : '♡'} {count}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonLiked: {
    backgroundColor: colors.likeSoft,
    borderColor: colors.likeSoft,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },
  text: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textMuted,
  },
  textLiked: {
    color: colors.like,
  },
});
