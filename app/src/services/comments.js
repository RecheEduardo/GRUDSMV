import api from './api';

// Chamadas de API relacionadas a comentarios de artigos.

// Lista os comentarios de um artigo (paginado).
// Retorna { comments, page, limit, total, totalPages, hasMore }.
export async function getComments(articleId, { page = 1, limit = 20 } = {}) {
  const { data } = await api.get(`/articles/${articleId}/comments`, {
    params: { page, limit },
  });
  return data;
}

// Cria um comentario em um artigo publicado.
export async function createComment(articleId, text) {
  const { data } = await api.post(`/articles/${articleId}/comments`, { text });
  return data.comment;
}

// Exclui o proprio comentario.
export async function deleteComment(id) {
  await api.delete(`/comments/${id}`);
}
