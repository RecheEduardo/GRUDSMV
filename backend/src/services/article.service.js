const articleRepository = require('../repositories/articleRepository');
const {
  ARTICLE_STATUS,
  canTransition,
  isEditable,
} = require('../models/article.model');
const httpError = require('../utils/httpError');
const config = require('../config');

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

// Feed publico: lista apenas artigos PUBLISHED, com paginacao, ordenacao e
// busca opcional por tag.
//   sort = 'likes' -> mais curtidos primeiro; caso contrario, mais recentes.
//   tag -> filtra artigos que contenham a tag informada (case-insensitive).
// Retorna metadados de paginacao para o app decidir se ha mais paginas.
function listPublished({ page = 1, limit = 10, sort = 'recent', tag } = {}) {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));

  // Oculta do feed os artigos que atingiram o limite de denuncias.
  let items = articleRepository
    .findByStatus(ARTICLE_STATUS.PUBLISHED)
    .filter(
      (a) => (a.reports?.length || 0) < config.reportThreshold,
    );

  if (tag && tag.trim()) {
    const target = tag.trim().toLowerCase();
    items = items.filter((a) =>
      (a.tags || []).some((t) => t.toLowerCase() === target),
    );
  }

  if (sort === 'likes') {
    items.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
  } else {
    items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  const total = items.length;
  const start = (pageNum - 1) * limitNum;
  const articles = items.slice(start, start + limitNum);

  return {
    articles,
    page: pageNum,
    limit: limitNum,
    sort: sort === 'likes' ? 'likes' : 'recent',
    tag: tag && tag.trim() ? tag.trim() : null,
    total,
    totalPages: Math.ceil(total / limitNum) || 1,
    hasMore: start + limitNum < total,
  };
}

// Artigos populares: os mais curtidos entre os publicados (mesma regra de
// ocultacao por denuncias do feed). Tela publica, sem paginacao.
function listPopular(limit = 10) {
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));

  return articleRepository
    .findByStatus(ARTICLE_STATUS.PUBLISHED)
    .filter((a) => (a.reports?.length || 0) < config.reportThreshold)
    .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
    .slice(0, limitNum);
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

// Registra a curtida de um usuario no artigo (idempotente: nao duplica).
// Retorna o artigo atualizado com a lista de curtidas.
function like(articleId, userId) {
  const article = articleRepository.findById(articleId);
  if (!article) throw httpError(404, 'Artigo nao encontrado');

  const likes = Array.isArray(article.likes) ? article.likes : [];
  if (likes.includes(userId)) return article;

  return articleRepository.update(articleId, { likes: [...likes, userId] });
}

// Remove a curtida de um usuario no artigo (idempotente).
function unlike(articleId, userId) {
  const article = articleRepository.findById(articleId);
  if (!article) throw httpError(404, 'Artigo nao encontrado');

  const likes = Array.isArray(article.likes) ? article.likes : [];
  if (!likes.includes(userId)) return article;

  return articleRepository.update(articleId, {
    likes: likes.filter((id) => id !== userId),
  });
}

// Registra a denuncia de um usuario no artigo (idempotente: nao conta duas
// vezes o mesmo usuario). Retorna o artigo atualizado com a lista de denuncias.
function report(articleId, userId) {
  const article = articleRepository.findById(articleId);
  if (!article) throw httpError(404, 'Artigo nao encontrado');

  const reports = Array.isArray(article.reports) ? article.reports : [];
  if (reports.includes(userId)) return article;

  return articleRepository.update(articleId, { reports: [...reports, userId] });
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
  listPublished,
  listPopular,
  changeStatus,
  submitForReview,
  listForReview,
  approve,
  reject,
  updateOwn,
  removeOwn,
  like,
  unlike,
  report,
};
