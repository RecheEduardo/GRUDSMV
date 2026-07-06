const commentService = require('../services/comment.service');

// Cria um comentario no artigo :id (o autor e o usuario autenticado).
async function create(req, res, next) {
  try {
    const comment = commentService.create(req.params.id, req.auth.id, req.body);
    res.status(201).json({ comment });
  } catch (err) {
    next(err);
  }
}

// Lista os comentarios do artigo :id (paginado e ordenado por data).
async function list(req, res, next) {
  try {
    const result = commentService.listByArticle(req.params.id, req.query);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

// Exclui o proprio comentario :id.
async function remove(req, res, next) {
  try {
    commentService.removeOwn(req.params.id, req.auth.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { create, list, remove };
