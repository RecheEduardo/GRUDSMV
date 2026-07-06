const { createRepository } = require('./baseRepository');

// Repositorio de artigos sobre a colecao "articles" do store JSON.
const repo = createRepository('articles');

function findByAuthor(authorId) {
  return repo.findBy((article) => article.authorId === authorId);
}

function findByStatus(status) {
  return repo.findBy((article) => article.status === status);
}

module.exports = { ...repo, findByAuthor, findByStatus };
