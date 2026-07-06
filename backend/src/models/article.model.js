// Model Article (documental) — formato de um artigo no store:
//   { id, authorId, title, content, status, tags, likes, reports, createdAt }
// likes/reports: arrays de ids de usuarios (preenchidos nos commits 09/10).
const ARTICLE_STATUS = {
  DRAFT: 'DRAFT',
  REVIEW: 'REVIEW',
  PUBLISHED: 'PUBLISHED',
  REJECTED: 'REJECTED',
};

module.exports = { ARTICLE_STATUS };
