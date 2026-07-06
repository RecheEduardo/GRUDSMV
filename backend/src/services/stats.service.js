import userRepository from '../repositories/userRepository.js';
import articleRepository from '../repositories/articleRepository.js';
import commentRepository from '../repositories/commentRepository.js';
import { ARTICLE_STATUS } from '../models/article.model.js';

// Estatisticas do ADMIN: para cada usuario, quantidade de artigos publicados,
// curtidas e comentarios recebidos nesses artigos.
export function getStatsByUser() {
  const users = userRepository.getAll();
  const articles = articleRepository.getAll();
  const comments = commentRepository.getAll();

  return users.map((user) => {
    const publishedArticles = articles.filter(
      (a) => a.authorId === user.id && a.status === ARTICLE_STATUS.PUBLISHED,
    );
    const articleIds = new Set(publishedArticles.map((a) => a.id));

    const likes = publishedArticles.reduce(
      (sum, a) => sum + (a.likes?.length || 0),
      0,
    );
    const commentsCount = comments.filter((c) => articleIds.has(c.articleId)).length;

    return {
      userId: user.id,
      username: user.username,
      publishedArticles: publishedArticles.length,
      likes,
      comments: commentsCount,
    };
  });
}

export default { getStatsByUser };
