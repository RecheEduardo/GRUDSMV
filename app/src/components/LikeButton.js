import { Pressable, StyleSheet, Text } from 'react-native';

import { useLikes } from '../hooks/useLikes';

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
      style={[styles.button, liked && styles.buttonLiked]}
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
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#eee',
  },
  buttonLiked: {
    backgroundColor: '#fce8e6',
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
  },
  textLiked: {
    color: '#c5221f',
  },
});
