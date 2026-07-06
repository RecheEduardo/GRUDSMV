import api from './api';

// Chamadas de API relacionadas a artigos.
export async function createArticle({ title, content, tags }) {
  const { data } = await api.post('/articles', { title, content, tags });
  return data.article;
}

export async function getMyArticles() {
  const { data } = await api.get('/articles/mine');
  return data.articles;
}

// Feed publico de artigos publicados (paginado + ordenado + busca por tag).
// Retorna { articles, page, limit, sort, tag, total, totalPages, hasMore }.
export async function getFeed({ page = 1, limit = 10, sort = 'recent', tag } = {}) {
  const { data } = await api.get('/articles', {
    params: { page, limit, sort, tag: tag || undefined },
  });
  return data;
}

// Artigos populares (mais curtidos entre os publicados). Tela publica.
export async function getPopularArticles(limit = 10) {
  const { data } = await api.get('/articles/popular', { params: { limit } });
  return data.articles;
}

export async function updateArticle(id, { title, content, tags }) {
  const { data } = await api.put(`/articles/${id}`, { title, content, tags });
  return data.article;
}

export async function deleteArticle(id) {
  await api.delete(`/articles/${id}`);
}

export async function likeArticle(id) {
  const { data } = await api.post(`/articles/${id}/like`);
  return data.article;
}

export async function unlikeArticle(id) {
  const { data } = await api.delete(`/articles/${id}/like`);
  return data.article;
}

export async function reportArticle(id) {
  const { data } = await api.post(`/articles/${id}/report`);
  return data; // { reported, reports }
}

export async function submitArticle(id) {
  const { data } = await api.patch(`/articles/${id}/submit`);
  return data.article;
}

// Moderacao (ADMIN): fila de artigos em revisao.
export async function getReviewArticles() {
  const { data } = await api.get('/admin/articles/review');
  return data.articles;
}

// Moderacao (ADMIN): aprova um artigo (REVIEW -> PUBLISHED).
export async function approveArticle(id) {
  const { data } = await api.patch(`/articles/${id}/approve`);
  return data.article;
}

// Moderacao (ADMIN): rejeita um artigo (REVIEW -> REJECTED).
export async function rejectArticle(id) {
  const { data } = await api.patch(`/articles/${id}/reject`);
  return data.article;
}

// Estatisticas (ADMIN): artigos publicados, curtidas e comentarios por usuario.
export async function getAdminStats() {
  const { data } = await api.get('/admin/stats');
  return data.stats;
}
