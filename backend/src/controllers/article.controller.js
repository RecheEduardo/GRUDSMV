const articleService = require('../services/article.service');

async function create(req, res, next) {
  try {
    const article = articleService.create(req.auth.id, req.body);
    res.status(201).json({ article });
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

module.exports = { create, listMine, submit };
