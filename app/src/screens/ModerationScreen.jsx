import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, View } from 'react-native';

import AppButton from '../components/AppButton';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import { useArticleStatus } from '../hooks/useArticleStatus';
import { getReviewArticles } from '../services/articles';
import { colors, spacing, typography } from '../theme';

// Tela de moderacao (somente ADMIN): lista os artigos em revisao e permite
// aprovar (publicar) ou rejeitar cada um.
export default function ModerationScreen() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { approve, reject, submittingId } = useArticleStatus();

  const load = useCallback(async () => {
    setError(null);
    try {
      const data = await getReviewArticles();
      setArticles(data);
    } catch (err) {
      setError('Nao foi possivel carregar a fila de moderacao.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Recarrega sempre que a tela ganha foco.
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  // Remove o artigo da fila apos a decisao (ja nao esta mais em REVIEW).
  function removeFromQueue(id) {
    setArticles((prev) => prev.filter((a) => a.id !== id));
  }

  async function handleApprove(article) {
    try {
      await approve(article.id);
      removeFromQueue(article.id);
      Alert.alert('Publicado', 'Artigo aprovado e publicado.');
    } catch (err) {
      Alert.alert(
        'Erro',
        err.response?.data?.message || 'Nao foi possivel aprovar o artigo.',
      );
    }
  }

  async function handleReject(article) {
    try {
      await reject(article.id);
      removeFromQueue(article.id);
      Alert.alert('Rejeitado', 'Artigo marcado como rejeitado.');
    } catch (err) {
      Alert.alert(
        'Erro',
        err.response?.data?.message || 'Nao foi possivel rejeitar o artigo.',
      );
    }
  }

  function renderItem({ item }) {
    const isBusy = submittingId === item.id;
    return (
      <Card style={styles.card}>
        <View style={styles.cardTop}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <StatusBadge status={item.status} />
        </View>
        <Text style={styles.cardContent} numberOfLines={4}>
          {item.content}
        </Text>
        <View style={styles.actions}>
          <AppButton
            title="Rejeitar"
            variant="danger"
            size="sm"
            loading={isBusy}
            onPress={() => handleReject(item)}
            style={styles.actionBtn}
          />
          <AppButton
            title="Aprovar"
            size="sm"
            loading={isBusy}
            onPress={() => handleApprove(item)}
            style={styles.actionBtn}
          />
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
              <Text style={styles.emptyIcon}>✅</Text>
              <Text style={styles.empty}>Nenhum artigo aguardando revisao.</Text>
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
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  cardTitle: {
    ...typography.heading,
    fontSize: 17,
    flex: 1,
  },
  cardContent: {
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionBtn: {
    flex: 1,
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
