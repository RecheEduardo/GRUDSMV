import { useState } from 'react';

import {
  approveArticle,
  rejectArticle,
  submitArticle,
} from '../services/articles';

// Encapsula as transicoes de status de um artigo.
// Expoe submittingId (qual artigo esta em transicao) para feedback visual.
export function useArticleStatus() {
  const [submittingId, setSubmittingId] = useState(null);
  const [error, setError] = useState(null);

  // Executa uma transicao mantendo o feedback visual (submittingId) e o
  // tratamento de erro consistentes entre as acoes.
  async function runTransition(articleId, action, fallbackMessage) {
    setError(null);
    setSubmittingId(articleId);
    try {
      return await action(articleId);
    } catch (err) {
      setError(err.response?.data?.message || fallbackMessage);
      throw err;
    } finally {
      setSubmittingId(null);
    }
  }

  function submitForReview(articleId) {
    return runTransition(
      articleId,
      submitArticle,
      'Nao foi possivel enviar para revisao.',
    );
  }

  function approve(articleId) {
    return runTransition(
      articleId,
      approveArticle,
      'Nao foi possivel aprovar o artigo.',
    );
  }

  function reject(articleId) {
    return runTransition(
      articleId,
      rejectArticle,
      'Nao foi possivel rejeitar o artigo.',
    );
  }

  return { submitForReview, approve, reject, submittingId, error };
}
