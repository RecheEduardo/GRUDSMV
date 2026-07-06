const { createRepository } = require('./baseRepository');

// Repositorio de artigos sobre a colecao "articles" do store JSON.
const repo = createRepository('articles');

function findByAuthor(authorId) {
  return repo.findBy((article) => article.authorId === authorId);
}

module.exports = { ...repo, findByAuthor };
