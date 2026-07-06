import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import AppButton from '../components/AppButton';
import Card from '../components/Card';
import LikeButton from '../components/LikeButton';
import ReportButton from '../components/ReportButton';
import { getFeed } from '../services/articles';
import { colors, radius, spacing, typography } from '../theme';

const PAGE_SIZE = 10;

// Feed publico: lista paginada de artigos publicados, com ordenacao por
// data (recentes) ou curtidas (mais curtidos) e botao "carregar mais".
export default function FeedScreen({ navigation }) {
  const [articles, setArticles] = useState([]);
  const [sort, setSort] = useState('recent');
  const [tag, setTag] = useState('');
  const [appliedTag, setAppliedTag] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  // Carrega uma pagina. Na primeira pagina substitui a lista; nas demais,
  // concatena (paginacao). Sort e tag sao passados explicitamente para evitar
  // depender do estado ainda nao aplicado ao trocar a ordenacao/busca.
  const loadPage = useCallback(async (pageToLoad, sortToUse, tagToUse) => {
    setError(null);
    if (pageToLoad === 1) setLoading(true);
    else setLoadingMore(true);
    try {
      const data = await getFeed({
        page: pageToLoad,
        limit: PAGE_SIZE,
        sort: sortToUse,
        tag: tagToUse,
      });
      setArticles((prev) =>
        pageToLoad === 1 ? data.articles : [...prev, ...data.articles],
      );
      setPage(data.page);
      setHasMore(data.hasMore);
    } catch (err) {
      setError('Nao foi possivel carregar o feed.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // Recarrega a primeira pagina ao focar (ex.: apos um artigo ser publicado).
  useFocusEffect(
    useCallback(() => {
      loadPage(1, sort, appliedTag);
    }, [loadPage, sort, appliedTag]),
  );

  function changeSort(nextSort) {
    if (nextSort === sort) return;
    setSort(nextSort);
    loadPage(1, nextSort, appliedTag);
  }

  function handleSearch() {
    const nextTag = tag.trim();
    setAppliedTag(nextTag);
    loadPage(1, sort, nextTag);
  }

  function clearSearch() {
    setTag('');
    setAppliedTag('');
    loadPage(1, sort, '');
  }

  function loadMore() {
    if (hasMore && !loadingMore) loadPage(page + 1, sort, appliedTag);
  }

  function renderItem({ item }) {
    return (
      <Card
        style={styles.card}
        onPress={() => navigation.navigate('ArticleDetail', { article: item })}
      >
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardContent} numberOfLines={3}>
          {item.content}
        </Text>
        {Array.isArray(item.tags) && item.tags.length > 0 && (
          <View style={styles.tagRow}>
            {item.tags.slice(0, 3).map((t) => (
              <View key={t} style={styles.tagChip}>
                <Text style={styles.tagChipText}>#{t}</Text>
              </View>
            ))}
          </View>
        )}
        <View style={styles.cardFooter}>
          <LikeButton entity={item} />
          <ReportButton entity={item} />
        </View>
      </Card>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por tag..."
            placeholderTextColor={colors.textFaint}
            autoCapitalize="none"
            value={tag}
            onChangeText={setTag}
            onSubmitEditing={handleSearch}
          />
          <AppButton title="Buscar" size="sm" onPress={handleSearch} />
        </View>
        {appliedTag ? (
          <View style={styles.tagBar}>
            <Text style={styles.tagLabel}>#{appliedTag}</Text>
            <Pressable onPress={clearSearch} hitSlop={8}>
              <Text style={styles.tagClear}>✕ Limpar</Text>
            </Pressable>
          </View>
        ) : null}

        <View style={styles.sortBar}>
          <SortButton
            label="Recentes"
            active={sort === 'recent'}
            onPress={() => changeSort('recent')}
          />
          <SortButton
            label="Mais curtidos"
            active={sort === 'likes'}
            onPress={() => changeSort('likes')}
          />
        </View>
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
          onRefresh={() => loadPage(1, sort, appliedTag)}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyIcon}>📭</Text>
              <Text style={styles.empty}>Nenhum artigo publicado ainda.</Text>
            </View>
          }
          ListFooterComponent={
            hasMore ? (
              loadingMore ? (
                <ActivityIndicator style={styles.footer} color={colors.primary} />
              ) : (
                <View style={styles.footer}>
                  <AppButton title="Carregar mais" variant="secondary" onPress={loadMore} />
                </View>
              )
            ) : null
          }
        />
      )}
    </View>
  );
}

function SortButton({ label, active, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.sortButton, active && styles.sortButtonActive]}
    >
      <Text style={[styles.sortText, active && styles.sortTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  toolbar: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontSize: 14,
    color: colors.text,
    backgroundColor: colors.surfaceMuted,
  },
  tagBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  tagLabel: {
    fontSize: 13,
    color: colors.primaryDark,
    fontWeight: '700',
  },
  tagClear: {
    fontSize: 13,
    color: colors.danger,
    fontWeight: '600',
  },
  sortBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  sortButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sortButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  sortText: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '600',
  },
  sortTextActive: {
    color: colors.white,
  },
  list: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  card: {
    marginBottom: 0,
  },
  cardTitle: {
    ...typography.heading,
    fontSize: 18,
    marginBottom: spacing.xs,
  },
  cardContent: {
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  tagChip: {
    backgroundColor: colors.primarySoft,
    borderRadius: radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tagChipText: {
    fontSize: 11,
    color: colors.primaryDark,
    fontWeight: '600',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  centered: {
    marginTop: 48,
  },
  footer: {
    paddingVertical: spacing.lg,
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
