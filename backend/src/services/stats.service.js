const userRepository = require('../repositories/userRepository');
const articleRepository = require('../repositories/articleRepository');
const commentRepository = require('../repositories/commentRepository');
const { ARTICLE_STATUS } = require('../models/article.model');

// Estatisticas do ADMIN: para cada usuario, quantidade de artigos publicados,
// curtidas e comentarios recebidos nesses artigos.
function getStatsByUser() {
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

module.exports = { getStatsByUser };
