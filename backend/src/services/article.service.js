const articleRepository = require('../repositories/articleRepository');
const { ARTICLE_STATUS } = require('../models/article.model');
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

module.exports = { create, listByAuthor };
