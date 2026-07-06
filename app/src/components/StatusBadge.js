import { StyleSheet, Text, View } from 'react-native';

// Etiqueta colorida para o status de um artigo.
const STATUS_STYLE = {
  DRAFT: { bg: '#e8eaed', fg: '#5f6368', label: 'Rascunho' },
  REVIEW: { bg: '#fef7e0', fg: '#b06000', label: 'Em revisao' },
  PUBLISHED: { bg: '#e6f4ea', fg: '#137333', label: 'Publicado' },
  REJECTED: { bg: '#fce8e6', fg: '#c5221f', label: 'Rejeitado' },
};

export default function StatusBadge({ status }) {
  const style = STATUS_STYLE[status] || STATUS_STYLE.DRAFT;
  return (
    <View style={[styles.badge, { backgroundColor: style.bg }]}>
      <Text style={[styles.text, { color: style.fg }]}>{style.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});
