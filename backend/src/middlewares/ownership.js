const articleRepository = require('../repositories/articleRepository');
const httpError = require('../utils/httpError');

// Middleware de posse (ownership) de artigos.
// Carrega o artigo de :id, garante que o usuario logado e o autor e anexa
// req.article para o controller/service reaproveitarem (evita buscar de novo).
// Deve rodar depois do middleware auth (que define req.auth).
function articleOwnership(req, res, next) {
  const article = articleRepository.findById(req.params.id);
  if (!article) return next(httpError(404, 'Artigo nao encontrado'));
  if (article.authorId !== req.auth.id) {
    return next(httpError(403, 'Voce nao e o autor deste artigo'));
  }
  req.article = article;
  return next();
}

module.exports = { articleOwnership };
