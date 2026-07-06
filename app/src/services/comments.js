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
// Retorna { comment, notifyAuthorId, articleTitle } (dados p/ notificar o autor).
export async function createComment(articleId, text) {
  const { data } = await api.post(`/articles/${articleId}/comments`, { text });
  return data;
}

// Exclui o proprio comentario.
export async function deleteComment(id) {
  await api.delete(`/comments/${id}`);
}

// Curte um comentario (sem duplicar por usuario).
export async function likeComment(id) {
  const { data } = await api.post(`/comments/${id}/like`);
  return data.comment;
}

// Remove a curtida do usuario no comentario.
export async function unlikeComment(id) {
  const { data } = await api.delete(`/comments/${id}/like`);
  return data.comment;
}

// Denuncia um comentario (sem duplicar por usuario).
export async function reportComment(id) {
  const { data } = await api.post(`/comments/${id}/report`);
  return data; // { reported, reports }
}
