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
import { getReviewArticles } from '../services/articles';

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
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardContent} numberOfLines={4}>
          {item.content}
        </Text>
        <View style={styles.cardFooter}>
          <StatusBadge status={item.status} />
          {isBusy ? (
            <ActivityIndicator />
          ) : (
            <View style={styles.actions}>
              <Button title="Rejeitar" color="#c5221f" onPress={() => handleReject(item)} />
              <View style={styles.spacer} />
              <Button title="Aprovar" color="#137333" onPress={() => handleApprove(item)} />
            </View>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
            <Text style={styles.empty}>Nenhum artigo aguardando revisao.</Text>
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
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
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
