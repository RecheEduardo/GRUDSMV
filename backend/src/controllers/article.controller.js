const articleService = require('../services/article.service');

async function create(req, res, next) {
  try {
    const article = articleService.create(req.auth.id, req.body);
    res.status(201).json({ article });
  } catch (err) {
    next(err);
  }
}

// Feed publico de artigos publicados (paginado e ordenado).
async function listFeed(req, res, next) {
  try {
    const result = articleService.listPublished(req.query);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

// Artigos populares (mais curtidos entre os publicados). Tela publica.
async function listPopular(req, res, next) {
  try {
    const articles = articleService.listPopular(req.query.limit);
    res.status(200).json({ articles });
  } catch (err) {
    next(err);
  }
}

async function listMine(req, res, next) {
  try {
    const articles = articleService.listByAuthor(req.auth.id);
    res.status(200).json({ articles });
  } catch (err) {
    next(err);
  }
}

async function submit(req, res, next) {
  try {
    const article = articleService.submitForReview(req.params.id, req.auth.id);
    res.status(200).json({ article });
  } catch (err) {
    next(err);
  }
}

// Moderacao (ADMIN): aprova um artigo em revisao (REVIEW -> PUBLISHED).
async function approve(req, res, next) {
  try {
    const article = articleService.approve(req.params.id);
    res.status(200).json({ article });
  } catch (err) {
    next(err);
  }
}

// Moderacao (ADMIN): rejeita um artigo em revisao (REVIEW -> REJECTED).
async function reject(req, res, next) {
  try {
    const article = articleService.reject(req.params.id);
    res.status(200).json({ article });
  } catch (err) {
    next(err);
  }
}

// Edita um artigo proprio (req.article vem do middleware ownership).
async function update(req, res, next) {
  try {
    const article = articleService.updateOwn(req.article, req.body);
    res.status(200).json({ article });
  } catch (err) {
    next(err);
  }
}

// Exclui um artigo proprio (req.article vem do middleware ownership).
async function remove(req, res, next) {
  try {
    articleService.removeOwn(req.article);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

// Curte o artigo (o autor da curtida e o usuario autenticado).
async function like(req, res, next) {
  try {
    const article = articleService.like(req.params.id, req.auth.id);
    res.status(200).json({ article });
  } catch (err) {
    next(err);
  }
}

// Remove a curtida do usuario autenticado no artigo.
async function unlike(req, res, next) {
  try {
    const article = articleService.unlike(req.params.id, req.auth.id);
    res.status(200).json({ article });
  } catch (err) {
    next(err);
  }
}

// Denuncia o artigo. Nao expoe quem denunciou, apenas a contagem.
async function report(req, res, next) {
  try {
    const article = articleService.report(req.params.id, req.auth.id);
    res.status(200).json({ reported: true, reports: article.reports.length });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  create,
  listFeed,
  listPopular,
  listMine,
  submit,
  approve,
  reject,
  update,
  remove,
  like,
  unlike,
  report,
};
