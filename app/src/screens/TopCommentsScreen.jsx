import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

import { getTopComments } from '../services/comments';

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
      <View style={styles.card}>
        <Text style={styles.rank}>#{index + 1}</Text>
        <View style={styles.cardBody}>
          <Text style={styles.articleTitle}>{item.articleTitle}</Text>
          <Text style={styles.text}>{item.text}</Text>
          <View style={styles.footer}>
            <Text style={styles.author}>{item.authorUsername}</Text>
            <Text style={styles.likes}>♥ {item.likes?.length || 0}</Text>
          </View>
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
          data={comments}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshing={loading}
          onRefresh={load}
          ListEmptyComponent={
            <Text style={styles.empty}>Nenhum comentario ainda.</Text>
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
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#fafafa',
  },
  rank: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a73e8',
    marginRight: 12,
    minWidth: 32,
  },
  cardBody: {
    flex: 1,
  },
  articleTitle: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  text: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  author: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
  },
  likes: {
    fontSize: 13,
    color: '#c5221f',
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
