import { useState } from 'react';

import { submitArticle } from '../services/articles';

// Encapsula as transicoes de status de um artigo.
// Expoe submittingId (qual artigo esta em transicao) para feedback visual.
export function useArticleStatus() {
  const [submittingId, setSubmittingId] = useState(null);
  const [error, setError] = useState(null);

  async function submitForReview(articleId) {
    setError(null);
    setSubmittingId(articleId);
    try {
      return await submitArticle(articleId);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Nao foi possivel enviar para revisao.',
      );
      throw err;
    } finally {
      setSubmittingId(null);
    }
  }

  return { submitForReview, submittingId, error };
}
