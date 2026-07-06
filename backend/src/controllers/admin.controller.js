import articleService from '../services/article.service.js';
import statsService from '../services/stats.service.js';

// Lista a fila de moderacao (artigos em REVIEW). Rota protegida por role ADMIN.
export async function listReview(req, res, next) {
  try {
    const articles = articleService.listForReview();
    res.status(200).json({ articles });
  } catch (err) {
    next(err);
  }
}

// Estatisticas do ADMIN: artigos publicados, curtidas e comentarios por usuario.
export async function getStats(req, res, next) {
  try {
    const stats = statsService.getStatsByUser();
    res.status(200).json({ stats });
  } catch (err) {
    next(err);
  }
}
