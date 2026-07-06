import { createRepository } from './baseRepository.js';

// Repositorio de artigos sobre a colecao "articles" do store JSON.
const repo = createRepository('articles');

function findByAuthor(authorId) {
  return repo.findBy((article) => article.authorId === authorId);
}

function findByStatus(status) {
  return repo.findBy((article) => article.status === status);
}

export default { ...repo, findByAuthor, findByStatus };
