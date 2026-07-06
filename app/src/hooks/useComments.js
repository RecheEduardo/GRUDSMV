import { useCallback, useState } from 'react';

import {
  createComment,
  deleteComment,
  getComments,
} from '../services/comments';

const PAGE_SIZE = 20;

// Encapsula os comentarios de um artigo: carregar (paginado), criar e excluir.
// A lista fica ordenada do mais recente para o mais antigo (novos entram no topo).
export function useComments(articleId) {
  const [comments, setComments] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const loadPage = useCallback(
    async (pageToLoad) => {
      setError(null);
      if (pageToLoad === 1) setLoading(true);
      else setLoadingMore(true);
      try {
        const data = await getComments(articleId, {
          page: pageToLoad,
          limit: PAGE_SIZE,
        });
        setComments((prev) =>
          pageToLoad === 1 ? data.comments : [...prev, ...data.comments],
        );
        setPage(data.page);
        setHasMore(data.hasMore);
      } catch (err) {
        setError('Nao foi possivel carregar os comentarios.');
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [articleId],
  );

  const reload = useCallback(() => loadPage(1), [loadPage]);

  function loadMore() {
    if (hasMore && !loadingMore) loadPage(page + 1);
  }

  // Cria um comentario e o insere no topo da lista.
  async function add(text) {
    setSubmitting(true);
    setError(null);
    try {
      const comment = await createComment(articleId, text);
      setComments((prev) => [comment, ...prev]);
      return comment;
    } catch (err) {
      setError(err.response?.data?.message || 'Nao foi possivel comentar.');
      throw err;
    } finally {
      setSubmitting(false);
    }
  }

  // Exclui um comentario com remocao otimista e rollback em caso de erro.
  async function remove(id) {
    const previous = comments;
    setComments((cur) => cur.filter((c) => c.id !== id));
    try {
      await deleteComment(id);
    } catch (err) {
      setComments(previous);
      setError(
        err.response?.data?.message || 'Nao foi possivel excluir o comentario.',
      );
      throw err;
    }
  }

  return {
    comments,
    loading,
    loadingMore,
    submitting,
    error,
    hasMore,
    reload,
    loadMore,
    add,
    remove,
  };
}
