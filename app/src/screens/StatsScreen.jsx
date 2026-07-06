import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

import Card from '../components/Card';
import { getAdminStats } from '../services/articles';
import { colors, radius, spacing, typography } from '../theme';

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
      <Card style={styles.card}>
        <View style={styles.userRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {item.username?.[0]?.toUpperCase() || '?'}
            </Text>
          </View>
          <Text style={styles.username}>{item.username}</Text>
        </View>
        <View style={styles.metrics}>
          <Metric value={item.publishedArticles} label="Artigos" />
          <Metric value={item.likes} label="Curtidas" />
          <Metric value={item.comments} label="Comentarios" />
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
          data={stats}
          keyExtractor={(item) => item.userId}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshing={loading}
          onRefresh={load}
          ListEmptyComponent={
            <Text style={styles.empty}>Nenhum usuario encontrado.</Text>
          }
        />
      )}
    </View>
  );
}

function Metric({ value, label }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
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
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '800',
  },
  username: {
    ...typography.heading,
    fontSize: 17,
  },
  metrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  metric: {
    alignItems: 'center',
    flex: 1,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  metricLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  centered: {
    marginTop: 48,
  },
  empty: {
    textAlign: 'center',
    color: colors.textMuted,
    marginTop: 48,
    fontSize: 15,
  },
  error: {
    textAlign: 'center',
    color: colors.danger,
    marginTop: 48,
    fontWeight: '600',
  },
});
