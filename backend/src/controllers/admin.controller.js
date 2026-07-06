const articleService = require('../services/article.service');
const statsService = require('../services/stats.service');

// Lista a fila de moderacao (artigos em REVIEW). Rota protegida por role ADMIN.
async function listReview(req, res, next) {
  try {
    const articles = articleService.listForReview();
    res.status(200).json({ articles });
  } catch (err) {
    next(err);
  }
}

// Estatisticas do ADMIN: artigos publicados, curtidas e comentarios por usuario.
async function getStats(req, res, next) {
  try {
    const stats = statsService.getStatsByUser();
    res.status(200).json({ stats });
  } catch (err) {
    next(err);
  }
}

module.exports = { listReview, getStats };
