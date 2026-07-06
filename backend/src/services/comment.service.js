const commentRepository = require('../repositories/commentRepository');
const articleRepository = require('../repositories/articleRepository');
const userRepository = require('../repositories/userRepository');
const { ARTICLE_STATUS } = require('../models/article.model');
const { MAX_COMMENT_LENGTH } = require('../models/comment.model');
const httpError = require('../utils/httpError');

// Enriquece um comentario com o username do autor (join manual com users),
// para o app exibir quem escreveu sem uma segunda requisicao.
function withAuthor(comment) {
  const author = userRepository.findById(comment.authorId);
  return { ...comment, authorUsername: author ? author.username : null };
}

// Cria um comentario em um artigo. So e permitido em artigos PUBLISHED.
function create(articleId, authorId, { text }) {
  if (!text || !text.trim()) {
    throw httpError(400, 'texto do comentario e obrigatorio');
  }
  if (text.trim().length > MAX_COMMENT_LENGTH) {
    throw httpError(
      400,
      `comentario deve ter no maximo ${MAX_COMMENT_LENGTH} caracteres`,
    );
  }

  const article = articleRepository.findById(articleId);
  if (!article) throw httpError(404, 'Artigo nao encontrado');
  if (article.status !== ARTICLE_STATUS.PUBLISHED) {
    throw httpError(409, 'So e possivel comentar em artigos publicados');
  }

  const comment = commentRepository.insert({
    articleId,
    authorId,
    text: text.trim(),
    likes: [],
    reports: [],
    createdAt: new Date().toISOString(),
  });

  // Alem do comentario, devolve os dados para o app notificar o autor do
  // artigo localmente (quem notificar e o titulo do artigo comentado).
  return {
    comment: withAuthor(comment),
    notifyAuthorId: article.authorId,
    articleTitle: article.title,
  };
}

// Lista os comentarios de um artigo, paginados, do mais recente ao mais antigo.
function listByArticle(articleId, { page = 1, limit = 20 } = {}) {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 20));

  const all = commentRepository
    .findByArticle(articleId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const total = all.length;
  const start = (pageNum - 1) * limitNum;
  const comments = all.slice(start, start + limitNum).map(withAuthor);

  return {
    comments,
    page: pageNum,
    limit: limitNum,
    total,
    totalPages: Math.ceil(total / limitNum) || 1,
    hasMore: start + limitNum < total,
  };
}

// Enriquece um comentario com o titulo do artigo, para a tela publica de
// comentarios mais curtidos exibir o contexto sem uma segunda requisicao.
function withArticleTitle(comment) {
  const article = articleRepository.findById(comment.articleId);
  return { ...comment, articleTitle: article ? article.title : null };
}

// Comentarios mais curtidos entre os artigos publicados. Tela publica, sem
// paginacao.
function listTop(limit = 10) {
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
  const publishedIds = new Set(
    articleRepository
      .findByStatus(ARTICLE_STATUS.PUBLISHED)
      .map((a) => a.id),
  );

  return commentRepository
    .getAll()
    .filter((c) => publishedIds.has(c.articleId))
    .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
    .slice(0, limitNum)
    .map((c) => withAuthor(withArticleTitle(c)));
}

// Exclui um comentario, permitido apenas ao proprio autor.
function removeOwn(commentId, userId) {
  const comment = commentRepository.findById(commentId);
  if (!comment) throw httpError(404, 'Comentario nao encontrado');
  if (comment.authorId !== userId) {
    throw httpError(403, 'Voce nao e o autor deste comentario');
  }
  commentRepository.remove(commentId);
  return comment;
}

// Registra a curtida de um usuario no comentario (idempotente: nao duplica).
function like(commentId, userId) {
  const comment = commentRepository.findById(commentId);
  if (!comment) throw httpError(404, 'Comentario nao encontrado');

  const likes = Array.isArray(comment.likes) ? comment.likes : [];
  if (likes.includes(userId)) return withAuthor(comment);

  return withAuthor(
    commentRepository.update(commentId, { likes: [...likes, userId] }),
  );
}

// Remove a curtida de um usuario no comentario (idempotente).
function unlike(commentId, userId) {
  const comment = commentRepository.findById(commentId);
  if (!comment) throw httpError(404, 'Comentario nao encontrado');

  const likes = Array.isArray(comment.likes) ? comment.likes : [];
  if (!likes.includes(userId)) return withAuthor(comment);

  return withAuthor(
    commentRepository.update(commentId, {
      likes: likes.filter((id) => id !== userId),
    }),
  );
}

// Registra a denuncia de um usuario no comentario (idempotente: nao conta
// duas vezes o mesmo usuario).
function report(commentId, userId) {
  const comment = commentRepository.findById(commentId);
  if (!comment) throw httpError(404, 'Comentario nao encontrado');

  const reports = Array.isArray(comment.reports) ? comment.reports : [];
  if (reports.includes(userId)) return withAuthor(comment);

  return withAuthor(
    commentRepository.update(commentId, { reports: [...reports, userId] }),
  );
}

module.exports = {
  create,
  listByArticle,
  listTop,
  removeOwn,
  like,
  unlike,
  report,
};
