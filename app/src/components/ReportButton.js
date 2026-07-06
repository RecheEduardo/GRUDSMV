import { Alert, Pressable, StyleSheet, Text } from 'react-native';

import { useReports } from '../hooks/useReports';

// Botao "Denunciar" reutilizavel (feed e detalhe). Usa useReports para o
// feedback visual. Faz stopPropagation para nao abrir o detalhe ao denunciar
// dentro de um card clicavel, e confirma antes de enviar.
export default function ReportButton({ article }) {
  const { reported, pending, report } = useReports(article);

  function handlePress(e) {
    e?.stopPropagation?.();
    if (reported || pending) return;
    Alert.alert('Denunciar', 'Deseja denunciar este artigo?', [
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
                'Nao foi possivel denunciar o artigo.',
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
      style={[styles.button, reported && styles.buttonReported]}
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
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#eee',
  },
  buttonReported: {
    backgroundColor: '#fef7e0',
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
  },
  textReported: {
    color: '#b06000',
  },
});
