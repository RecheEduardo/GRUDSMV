import { createRepository } from './baseRepository.js';

// Repositorio de comentarios sobre a colecao "comments" do store JSON.
const repo = createRepository('comments');

function findByArticle(articleId) {
  return repo.findBy((comment) => comment.articleId === articleId);
}

export default { ...repo, findByArticle };
