import { Alert, Pressable, StyleSheet, Text } from 'react-native';

import { useReports } from '../hooks/useReports';
import { colors, radius } from '../theme';

// Botao "Denunciar" reutilizavel para artigos e comentarios. Usa useReports
// para o feedback visual. Faz stopPropagation para nao abrir o detalhe ao
// denunciar dentro de um card clicavel, e confirma antes de enviar.
export default function ReportButton({ entity, type = 'article' }) {
  const { reported, pending, report } = useReports(entity, type);
  const label = type === 'comment' ? 'comentario' : 'artigo';

  function handlePress(e) {
    e?.stopPropagation?.();
    if (reported || pending) return;
    Alert.alert('Denunciar', `Deseja denunciar este ${label}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Denunciar',
        style: 'destructive',
        onPress: async () => {
          try {
            await report();
            Alert.alert('Obrigado', 'Sua denuncia foi registrada.');
          } catch (err) {
            Alert.alert(
              'Erro',
              err.response?.data?.message ||
                `Nao foi possivel denunciar o ${label}.`,
            );
          }
        },
      },
    ]);
  }

  return (
    <Pressable
      onPress={handlePress}
      disabled={pending || reported}
      style={({ pressed }) => [
        styles.button,
        reported && styles.buttonReported,
        pressed && styles.pressed,
      ]}
      hitSlop={8}
    >
      <Text style={[styles.text, reported && styles.textReported]}>
        {reported ? '⚑ Denunciado' : '⚐ Denunciar'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonReported: {
    backgroundColor: colors.warningSoft,
    borderColor: colors.warningSoft,
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
  textReported: {
    color: colors.warning,
  },
});
