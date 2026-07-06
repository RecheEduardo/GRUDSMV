import { useState } from 'react';

import { createArticle, updateArticle } from '../services/articles';

// Encapsula a publicacao de um artigo: cria um novo (rascunho) ou salva
// alteracoes de um existente, com feedback de loading/erro.
export function useCreateArticle() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function save(payload, existingArticle) {
    setError(null);
    setLoading(true);
    try {
      if (existingArticle) {
        return await updateArticle(existingArticle.id, payload);
      }
      return await createArticle(payload);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Nao foi possivel salvar o artigo.',
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { save, loading, error };
}
