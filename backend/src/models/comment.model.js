// Model Comment (documental) — formato de um comentario no store:
//   { id, articleId, authorId, text, likes, reports, createdAt }
// likes/reports: arrays de ids de usuarios (curtidas/denuncias em comentarios).
// Comentarios so existem em artigos com status PUBLISHED.
export const MAX_COMMENT_LENGTH = 1000;
