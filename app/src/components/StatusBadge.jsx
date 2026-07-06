import { StyleSheet, Text, View } from 'react-native';

import { colors, radius } from '../theme';

// Etiqueta colorida para o status de um artigo.
const STATUS_STYLE = {
  DRAFT: { bg: '#eef2f7', fg: '#64748b', label: 'Rascunho' },
  REVIEW: { bg: colors.warningSoft, fg: colors.warning, label: 'Em revisao' },
  PUBLISHED: { bg: colors.successSoft, fg: colors.success, label: 'Publicado' },
  REJECTED: { bg: colors.dangerSoft, fg: colors.danger, label: 'Rejeitado' },
};

export default function StatusBadge({ status }) {
  const style = STATUS_STYLE[status] || STATUS_STYLE.DRAFT;
  return (
    <View style={[styles.badge, { backgroundColor: style.bg }]}>
      <View style={[styles.dot, { backgroundColor: style.fg }]} />
      <Text style={[styles.text, { color: style.fg }]}>{style.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
  },
});
