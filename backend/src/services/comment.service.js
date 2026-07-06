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
  return withAuthor(comment);
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

module.exports = { create, listByArticle, removeOwn };
