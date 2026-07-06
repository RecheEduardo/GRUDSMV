import { useState } from 'react';

import { reportArticle } from '../services/articles';

// Encapsula a denuncia de um artigo com feedback visual.
// Expoe `reported` (ja denunciado nesta sessao), `pending` (em andamento)
// e `error`. Idempotente no backend: denunciar de novo nao conta duas vezes.
export function useReports(article) {
  const [reported, setReported] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);

  async function report() {
    if (pending || reported) return;
    setError(null);
    setPending(true);
    try {
      await reportArticle(article.id);
      setReported(true);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Nao foi possivel denunciar o artigo.',
      );
      throw err;
    } finally {
      setPending(false);
    }
  }

  return { reported, pending, error, report };
}
