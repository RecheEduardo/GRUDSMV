const articleRepository = require('../repositories/articleRepository');
const {
  ARTICLE_STATUS,
  canTransition,
  isEditable,
} = require('../models/article.model');
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

// Lista os artigos aguardando moderacao (status REVIEW), do mais antigo para o
// mais recente (fila de moderacao). Uso restrito ao ADMIN (checado na rota).
function listForReview() {
  return articleRepository
    .findByStatus(ARTICLE_STATUS.REVIEW)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
}

// Aprova um artigo em revisao (REVIEW -> PUBLISHED). Uso restrito ao ADMIN.
function approve(articleId) {
  const article = articleRepository.findById(articleId);
  if (!article) throw httpError(404, 'Artigo nao encontrado');
  return changeStatus(article, ARTICLE_STATUS.PUBLISHED);
}

// Rejeita um artigo em revisao (REVIEW -> REJECTED). Uso restrito ao ADMIN.
function reject(articleId) {
  const article = articleRepository.findById(articleId);
  if (!article) throw httpError(404, 'Artigo nao encontrado');
  return changeStatus(article, ARTICLE_STATUS.REJECTED);
}

// Garante que o artigo ainda esta em um status editavel (DRAFT ou REVIEW).
function assertEditable(article) {
  if (!isEditable(article.status)) {
    throw httpError(
      409,
      'Apenas artigos em rascunho ou revisao podem ser editados ou excluidos',
    );
  }
}

// Atualiza um artigo ja validado como do proprio autor (via middleware
// ownership). So permite edicao enquanto o artigo esta em DRAFT ou REVIEW.
function updateOwn(article, { title, content, tags }) {
  assertEditable(article);
  if (!title || !title.trim() || !content || !content.trim()) {
    throw httpError(400, 'titulo e conteudo sao obrigatorios');
  }
  return articleRepository.update(article.id, {
    title: title.trim(),
    content: content.trim(),
    tags: Array.isArray(tags) ? tags : article.tags || [],
  });
}

// Exclui um artigo ja validado como do proprio autor (via middleware
// ownership). So permite exclusao enquanto o artigo esta em DRAFT ou REVIEW.
function removeOwn(article) {
  assertEditable(article);
  return articleRepository.remove(article.id);
}

module.exports = {
  create,
  listByAuthor,
  changeStatus,
  submitForReview,
  listForReview,
  approve,
  reject,
  updateOwn,
  removeOwn,
};
