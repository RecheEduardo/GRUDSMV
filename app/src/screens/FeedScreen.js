import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import LikeButton from '../components/LikeButton';
import ReportButton from '../components/ReportButton';
import { getFeed } from '../services/articles';

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
      <Pressable
        style={styles.card}
        onPress={() => navigation.navigate('ArticleDetail', { article: item })}
      >
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardContent} numberOfLines={3}>
          {item.content}
        </Text>
        <View style={styles.cardFooter}>
          <LikeButton entity={item} />
          <ReportButton entity={item} />
        </View>
      </Pressable>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por tag..."
          autoCapitalize="none"
          value={tag}
          onChangeText={setTag}
          onSubmitEditing={handleSearch}
        />
        <Button title="Buscar" onPress={handleSearch} />
      </View>
      {appliedTag ? (
        <View style={styles.tagBar}>
          <Text style={styles.tagLabel}>Tag: {appliedTag}</Text>
          <Pressable onPress={clearSearch}>
            <Text style={styles.tagClear}>Limpar</Text>
          </Pressable>
        </View>
      ) : null}

      <View style={styles.sortBar}>
        <Text style={styles.sortLabel}>Ordenar por:</Text>
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
          onRefresh={() => loadPage(1, sort, appliedTag)}
          ListEmptyComponent={
            <Text style={styles.empty}>Nenhum artigo publicado ainda.</Text>
          }
          ListFooterComponent={
            hasMore ? (
              loadingMore ? (
                <ActivityIndicator style={styles.footer} />
              ) : (
                <View style={styles.footer}>
                  <Button title="Carregar mais" onPress={loadMore} />
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
      <Text style={[styles.sortText, active && styles.sortTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  tagBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  tagLabel: {
    fontSize: 13,
    color: '#1a73e8',
    fontWeight: '600',
  },
  tagClear: {
    fontSize: 13,
    color: '#c5221f',
    fontWeight: '600',
  },
  sortBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
  },
  sortLabel: {
    fontSize: 13,
    color: '#666',
    marginRight: 8,
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#eee',
    marginRight: 8,
  },
  sortButtonActive: {
    backgroundColor: '#1a73e8',
  },
  sortText: {
    fontSize: 13,
    color: '#444',
    fontWeight: '600',
  },
  sortTextActive: {
    color: '#fff',
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
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  centered: {
    marginTop: 40,
  },
  footer: {
    paddingVertical: 16,
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
