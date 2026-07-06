import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

import Card from '../components/Card';
import { getTopComments } from '../services/comments';
import { colors, radius, spacing } from '../theme';

// Medalhas para as tres primeiras posicoes do ranking.
const MEDALS = ['🥇', '🥈', '🥉'];

// Tela publica: comentarios mais curtidos entre os artigos publicados.
export default function TopCommentsScreen() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const data = await getTopComments();
      setComments(data);
    } catch (err) {
      setError('Nao foi possivel carregar os comentarios mais curtidos.');
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
      <Card style={styles.card}>
        <View style={styles.rankBadge}>
          <Text style={styles.rankText}>{MEDALS[index] || `#${index + 1}`}</Text>
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.articleTitle} numberOfLines={1}>
            em {item.articleTitle}
          </Text>
          <Text style={styles.text}>{item.text}</Text>
          <View style={styles.footer}>
            <Text style={styles.author}>{item.authorUsername}</Text>
            <Text style={styles.likes}>♥ {item.likes?.length || 0}</Text>
          </View>
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
          data={comments}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshing={loading}
          onRefresh={load}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyIcon}>💬</Text>
              <Text style={styles.empty}>Nenhum comentario ainda.</Text>
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
  articleTitle: {
    fontSize: 12,
    color: colors.textFaint,
    marginBottom: spacing.xs,
    fontStyle: 'italic',
  },
  text: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 21,
    marginBottom: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  author: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
  },
  likes: {
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
