import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

import Card from '../components/Card';
import { getPopularArticles } from '../services/articles';
import { colors, radius, spacing, typography } from '../theme';

// Medalhas para as tres primeiras posicoes do ranking.
const MEDALS = ['🥇', '🥈', '🥉'];

// Tela publica: artigos publicados mais curtidos.
export default function PopularArticlesScreen({ navigation }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const data = await getPopularArticles();
      setArticles(data);
    } catch (err) {
      setError('Nao foi possivel carregar os artigos populares.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  function renderItem({ item, index }) {
    return (
      <Card
        style={styles.card}
        onPress={() => navigation.navigate('ArticleDetail', { article: item })}
      >
        <View style={styles.rankBadge}>
          <Text style={styles.rankText}>{MEDALS[index] || `#${index + 1}`}</Text>
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.cardLikes}>♥ {item.likes?.length || 0} curtidas</Text>
        </View>
      </Card>
    );
  }

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator style={styles.centered} size="large" color={colors.primary} />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={articles}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshing={loading}
          onRefresh={load}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyIcon}>🔥</Text>
              <Text style={styles.empty}>Nenhum artigo publicado ainda.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  card: {
    marginBottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rankBadge: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.lg,
  },
  rankText: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  cardBody: {
    flex: 1,
  },
  cardTitle: {
    ...typography.heading,
    fontSize: 16,
    marginBottom: spacing.xs,
  },
  cardLikes: {
    fontSize: 13,
    color: colors.like,
    fontWeight: '600',
  },
  centered: {
    marginTop: 48,
  },
  emptyWrap: {
    alignItems: 'center',
    marginTop: 64,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: spacing.md,
  },
  empty: {
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: 15,
  },
  error: {
    textAlign: 'center',
    color: colors.danger,
    marginTop: 48,
    fontWeight: '600',
  },
});
