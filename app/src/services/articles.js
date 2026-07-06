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

export async function submitArticle(id) {
  const { data } = await api.patch(`/articles/${id}/submit`);
  return data.article;
}
