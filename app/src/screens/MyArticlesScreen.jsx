import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import AppButton from '../components/AppButton';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import { useArticleStatus } from '../hooks/useArticleStatus';
import { deleteArticle, getMyArticles } from '../services/articles';
import { colors, spacing, typography } from '../theme';

// Status em que o autor ainda pode editar/excluir o proprio artigo.
const EDITABLE_STATUSES = ['DRAFT', 'REVIEW'];

export default function MyArticlesScreen({ navigation }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const { submitForReview, submittingId } = useArticleStatus();

  async function handleSubmit(article) {
    try {
      const updated = await submitForReview(article.id);
      // Atualiza o status na lista para refletir a mudanca imediatamente.
      setArticles((prev) =>
        prev.map((a) => (a.id === updated.id ? updated : a)),
      );
      Alert.alert('Pronto', 'Artigo enviado para revisao.');
    } catch (err) {
      Alert.alert(
        'Erro',
        err.response?.data?.message || 'Nao foi possivel enviar para revisao.',
      );
    }
  }

  function handleEdit(article) {
    navigation.navigate('CreateArticle', { article });
  }

  function handleDelete(article) {
    Alert.alert(
      'Excluir artigo',
      `Deseja excluir "${article.title}"? Esta acao nao pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            setDeletingId(article.id);
            try {
              await deleteArticle(article.id);
              setArticles((prev) => prev.filter((a) => a.id !== article.id));
            } catch (err) {
              Alert.alert(
                'Erro',
                err.response?.data?.message ||
                  'Nao foi possivel excluir o artigo.',
              );
            } finally {
              setDeletingId(null);
            }
          },
        },
      ],
    );
  }

  const load = useCallback(async () => {
    setError(null);
    try {
      const data = await getMyArticles();
      setArticles(data);
    } catch (err) {
      setError('Nao foi possivel carregar seus artigos.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Recarrega sempre que a tela ganha foco (ex.: ao voltar de "Novo artigo").
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  function renderItem({ item }) {
    const isSubmitting = submittingId === item.id;
    const isDeleting = deletingId === item.id;
    const editable = EDITABLE_STATUSES.includes(item.status);
    return (
      <Card style={styles.card}>
        <View style={styles.cardTop}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <StatusBadge status={item.status} />
        </View>
        <Text style={styles.cardContent} numberOfLines={2}>
          {item.content}
        </Text>

        <View style={styles.actions}>
          {item.status === 'DRAFT' && (
            <AppButton
              title="Enviar para revisao"
              variant="secondary"
              size="sm"
              loading={isSubmitting}
              onPress={() => handleSubmit(item)}
              style={styles.actionBtn}
            />
          )}
          {editable && (
            <>
              <AppButton
                title="Editar"
                variant="ghost"
                size="sm"
                onPress={() => handleEdit(item)}
                style={styles.actionBtn}
              />
              <AppButton
                title="Excluir"
                variant="danger"
                size="sm"
                loading={isDeleting}
                onPress={() => handleDelete(item)}
                style={styles.actionBtn}
              />
            </>
          )}
        </View>
      </Card>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AppButton
          title="+  Novo artigo"
          onPress={() => navigation.navigate('CreateArticle')}
        />
      </View>

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
              <Text style={styles.emptyIcon}>✍️</Text>
              <Text style={styles.empty}>Voce ainda nao criou nenhum artigo.</Text>
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
  header: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  actionBtn: {
    flexGrow: 1,
    minWidth: 100,
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
