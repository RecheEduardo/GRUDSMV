const articleRepository = require('../repositories/articleRepository');
const { ARTICLE_STATUS, canTransition } = require('../models/article.model');
const httpError = require('../utils/httpError');

// Cria um artigo em rascunho (DRAFT) para o autor informado.
function create(authorId, { title, content, tags }) {
  if (!title || !title.trim() || !content || !content.trim()) {
    throw httpError(400, 'titulo e conteudo sao obrigatorios');
  }

  return articleRepository.insert({
    authorId,
    title: title.trim(),
    content: content.trim(),
    status: ARTICLE_STATUS.DRAFT,
    tags: Array.isArray(tags) ? tags : [],
    likes: [],
    reports: [],
    createdAt: new Date().toISOString(),
  });
}

// Lista os artigos do autor, do mais recente para o mais antigo.
function listByAuthor(authorId) {
  return articleRepository
    .findByAuthor(authorId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

// Aplica uma transicao de status validada pela maquina de estados.
function changeStatus(article, nextStatus) {
  if (!canTransition(article.status, nextStatus)) {
    throw httpError(
      409,
      `Transicao de status invalida: ${article.status} -> ${nextStatus}`,
    );
  }
  return articleRepository.update(article.id, { status: nextStatus });
}

// Envia um artigo do autor para revisao (DRAFT -> REVIEW).
function submitForReview(articleId, userId) {
  const article = articleRepository.findById(articleId);
  if (!article) throw httpError(404, 'Artigo nao encontrado');
  if (article.authorId !== userId) {
    throw httpError(403, 'Voce nao e o autor deste artigo');
  }
  return changeStatus(article, ARTICLE_STATUS.REVIEW);
}

module.exports = { create, listByAuthor, changeStatus, submitForReview };
