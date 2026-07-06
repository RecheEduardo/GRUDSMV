import commentService from '../services/comment.service.js';

// Cria um comentario no artigo :id (o autor e o usuario autenticado).
// Responde com o comentario e os dados para o app notificar o autor.
export async function create(req, res, next) {
  try {
    const result = commentService.create(req.params.id, req.auth.id, req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

// Lista os comentarios do artigo :id (paginado e ordenado por data).
export async function list(req, res, next) {
  try {
    const result = commentService.listByArticle(req.params.id, req.query);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

// Comentarios mais curtidos entre os artigos publicados (?limit). Tela publica.
export async function listTop(req, res, next) {
  try {
    const comments = commentService.listTop(req.query.limit);
    res.status(200).json({ comments });
  } catch (err) {
    next(err);
  }
}

// Exclui o proprio comentario :id.
export async function remove(req, res, next) {
  try {
    commentService.removeOwn(req.params.id, req.auth.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

// Curte o comentario (o autor da curtida e o usuario autenticado).
export async function like(req, res, next) {
  try {
    const comment = commentService.like(req.params.id, req.auth.id);
    res.status(200).json({ comment });
  } catch (err) {
    next(err);
  }
}

// Remove a curtida do usuario autenticado no comentario.
export async function unlike(req, res, next) {
  try {
    const comment = commentService.unlike(req.params.id, req.auth.id);
    res.status(200).json({ comment });
  } catch (err) {
    next(err);
  }
}

// Denuncia o comentario. Nao expoe quem denunciou, apenas a contagem.
export async function report(req, res, next) {
  try {
    const comment = commentService.report(req.params.id, req.auth.id);
    res.status(200).json({ reported: true, reports: comment.reports.length });
  } catch (err) {
    next(err);
  }
}
