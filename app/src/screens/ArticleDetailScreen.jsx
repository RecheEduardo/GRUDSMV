import { ScrollView, StyleSheet, Text, View } from 'react-native';

import AppButton from '../components/AppButton';
import LikeButton from '../components/LikeButton';
import ReportButton from '../components/ReportButton';
import { colors, radius, spacing, typography } from '../theme';

// Detalhe de um artigo publicado. Recebe o artigo via parametros de navegacao
// (o feed ja carrega o objeto completo, incluindo o conteudo).
export default function ArticleDetailScreen({ navigation, route }) {
  const article = route.params?.article;

  if (!article) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>Artigo nao encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <Text style={styles.title}>{article.title}</Text>

      {Array.isArray(article.tags) && article.tags.length > 0 && (
        <View style={styles.tags}>
          {article.tags.map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.meta}>
        <LikeButton entity={article} />
        <ReportButton entity={article} />
      </View>

      <View style={styles.divider} />

      <Text style={styles.content}>{article.content}</Text>

      <AppButton
        title="💬  Ver comentarios"
        variant="secondary"
        style={styles.commentsAction}
        onPress={() =>
          navigation.navigate('Comments', {
            articleId: article.id,
            articleTitle: article.title,
          })
        }
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: spacing.xl,
    flexGrow: 1,
  },
  title: {
    ...typography.title,
    fontSize: 26,
    marginBottom: spacing.md,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  tag: {
    backgroundColor: colors.primarySoft,
    borderRadius: radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: 12,
    color: colors.primaryDark,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: spacing.lg,
  },
  content: {
    fontSize: 16,
    lineHeight: 26,
    color: colors.text,
  },
  commentsAction: {
    marginTop: spacing.xl,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  error: {
    color: colors.danger,
    fontWeight: '600',
  },
});
