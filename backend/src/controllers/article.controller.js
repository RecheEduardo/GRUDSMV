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

module.exports = { create, listMine, submit, approve, reject };
