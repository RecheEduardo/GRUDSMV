import { useState } from 'react';

import { useAuth } from '../context/AuthContext';
import { likeArticle, unlikeArticle } from '../services/articles';
import { likeComment, unlikeComment } from '../services/comments';

// Mapeia o tipo da entidade (artigo ou comentario) para as chamadas de API
// correspondentes, permitindo reaproveitar o mesmo hook nos dois casos.
const LIKE_API = {
  article: { like: likeArticle, unlike: unlikeArticle },
  comment: { like: likeComment, unlike: unlikeComment },
};

// Encapsula a curtida de uma entidade (artigo ou comentario) com atualizacao
// otimista. Aplica a mudanca na hora (feedback visual imediato), chama a API e
// reconcilia com o retorno do servidor; em caso de erro, faz rollback.
export function useLikes(entity, type = 'article') {
  const api = LIKE_API[type] || LIKE_API.article;
  const { user } = useAuth();
  const initialLikes = Array.isArray(entity?.likes) ? entity.likes : [];

  const [liked, setLiked] = useState(initialLikes.includes(user?.id));
  const [count, setCount] = useState(initialLikes.length);
  const [pending, setPending] = useState(false);

  async function toggle() {
    if (pending) return;

    const nextLiked = !liked;
    // Atualizacao otimista.
    setLiked(nextLiked);
    setCount((c) => c + (nextLiked ? 1 : -1));
    setPending(true);

    try {
      const updated = nextLiked
        ? await api.like(entity.id)
        : await api.unlike(entity.id);
      // Reconcilia com o estado real do servidor.
      const serverLikes = Array.isArray(updated?.likes) ? updated.likes : [];
      setCount(serverLikes.length);
      setLiked(serverLikes.includes(user?.id));
    } catch (err) {
      // Rollback do otimismo.
      setLiked(!nextLiked);
      setCount((c) => c + (nextLiked ? -1 : 1));
    } finally {
      setPending(false);
    }
  }

  return { liked, count, pending, toggle };
}
