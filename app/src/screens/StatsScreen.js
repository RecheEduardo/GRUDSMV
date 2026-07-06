import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

import { getAdminStats } from '../services/articles';

// Tela de estatisticas (somente ADMIN): artigos publicados, curtidas e
// comentarios recebidos, agregados por usuario.
export default function StatsScreen() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const data = await getAdminStats();
      setStats(data);
    } catch (err) {
      setError('Nao foi possivel carregar as estatisticas.');
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

  function renderItem({ item }) {
    return (
      <View style={styles.row}>
        <Text style={styles.username}>{item.username}</Text>
        <View style={styles.metrics}>
          <Text style={styles.metric}>Artigos: {item.publishedArticles}</Text>
          <Text style={styles.metric}>Curtidas: {item.likes}</Text>
          <Text style={styles.metric}>Comentarios: {item.comments}</Text>
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
          data={stats}
          keyExtractor={(item) => item.userId}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshing={loading}
          onRefresh={load}
          ListHeaderComponent={
            <View style={styles.header}>
              <Text style={[styles.username, styles.headerLabel]}>Usuario</Text>
              <Text style={styles.headerMetrics}>Artigos / Curtidas / Comentarios</Text>
            </View>
          }
          ListEmptyComponent={<Text style={styles.empty}>Nenhum usuario encontrado.</Text>}
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
  header: {
    marginBottom: 8,
  },
  headerLabel: {
    marginBottom: 2,
  },
  headerMetrics: {
    fontSize: 12,
    color: '#888',
  },
  row: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#fafafa',
  },
  username: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  metrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metric: {
    fontSize: 13,
    color: '#555',
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
