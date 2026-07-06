import { useState } from 'react';

import { reportArticle } from '../services/articles';
import { reportComment } from '../services/comments';

// Mapeia o tipo da entidade (artigo ou comentario) para a chamada de denuncia
// correspondente, permitindo reaproveitar o mesmo hook nos dois casos.
const REPORT_API = {
  article: reportArticle,
  comment: reportComment,
};

// Encapsula a denuncia de uma entidade (artigo ou comentario) com feedback
// visual. Expoe `reported` (ja denunciado nesta sessao), `pending` (em
// andamento) e `error`. Idempotente no backend: denunciar de novo nao conta.
export function useReports(entity, type = 'article') {
  const reportEntity = REPORT_API[type] || REPORT_API.article;
  const [reported, setReported] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);

  async function report() {
    if (pending || reported) return;
    setError(null);
    setPending(true);
    try {
      await reportEntity(entity.id);
      setReported(true);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Nao foi possivel registrar a denuncia.',
      );
      throw err;
    } finally {
      setPending(false);
    }
  }

  return { reported, pending, error, report };
}
