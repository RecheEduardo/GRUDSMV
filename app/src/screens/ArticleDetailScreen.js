import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';

import LikeButton from '../components/LikeButton';
import ReportButton from '../components/ReportButton';

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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{article.title}</Text>
      <View style={styles.meta}>
        <LikeButton entity={article} />
        <ReportButton entity={article} />
      </View>

      {Array.isArray(article.tags) && article.tags.length > 0 && (
        <View style={styles.tags}>
          {article.tags.map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      )}

      <Text style={styles.content}>{article.content}</Text>

      <View style={styles.commentsAction}>
        <Button
          title="Ver comentarios"
          onPress={() =>
            navigation.navigate('Comments', {
              articleId: article.id,
              articleTitle: article.title,
            })
          }
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 6,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  tag: {
    backgroundColor: '#eef',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    color: '#3b3b8f',
    fontWeight: '600',
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  commentsAction: {
    marginTop: 24,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  error: {
    color: '#c5221f',
  },
});
