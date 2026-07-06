import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import StatusBadge from '../components/StatusBadge';
import { useArticleStatus } from '../hooks/useArticleStatus';
import { deleteArticle, getMyArticles } from '../services/articles';

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
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardContent} numberOfLines={2}>
          {item.content}
        </Text>
        <View style={styles.cardFooter}>
          <StatusBadge status={item.status} />
          {item.status === 'DRAFT' &&
            (isSubmitting ? (
              <ActivityIndicator />
            ) : (
              <Button
                title="Enviar para revisao"
                onPress={() => handleSubmit(item)}
              />
            ))}
        </View>

        {editable && (
          <View style={styles.cardActions}>
            {isDeleting ? (
              <ActivityIndicator />
            ) : (
              <>
                <Button title="Editar" onPress={() => handleEdit(item)} />
                <View style={styles.spacer} />
                <Button
                  title="Excluir"
                  color="#c5221f"
                  onPress={() => handleDelete(item)}
                />
              </>
            )}
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button
          title="+ Novo artigo"
          onPress={() => navigation.navigate('CreateArticle')}
        />
      </View>

      {loading ? (
        <ActivityIndicator style={styles.centered} size="large" />
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
            <Text style={styles.empty}>
              Voce ainda nao criou nenhum artigo.
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
  },
  list: {
    padding: 16,
  },
  card: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#fafafa',
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardContent: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  spacer: {
    width: 8,
  },
  centered: {
    marginTop: 40,
  },
  empty: {
    textAlign: 'center',
    color: '#888',
    marginTop: 40,
  },
  error: {
    textAlign: 'center',
    color: '#c5221f',
    marginTop: 40,
  },
});
