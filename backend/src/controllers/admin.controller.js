const articleService = require('../services/article.service');

// Lista a fila de moderacao (artigos em REVIEW). Rota protegida por role ADMIN.
async function listReview(req, res, next) {
  try {
    const articles = articleService.listForReview();
    res.status(200).json({ articles });
  } catch (err) {
    next(err);
  }
}

module.exports = { listReview };
