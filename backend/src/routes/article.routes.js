const { Router } = require('express');

const {
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
} = require('../controllers/article.controller');
const {
  create: createComment,
  list: listComments,
} = require('../controllers/comment.controller');
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');
const { articleOwnership } = require('../middlewares/ownership');

const router = Router();

// GET /articles -> feed publico de artigos publicados (?page, ?limit, ?sort, ?tag).
router.get('/', listFeed);

// GET /articles/popular -> artigos publicados mais curtidos (?limit). Publica.
router.get('/popular', listPopular);

// POST /articles -> cria artigo (rascunho). Requer autenticacao.
router.post('/', auth, create);

// GET /articles/mine -> artigos do autor logado.
router.get('/mine', auth, listMine);

// PATCH /articles/:id/submit -> envia para revisao (DRAFT -> REVIEW).
router.patch('/:id/submit', auth, submit);

// PATCH /articles/:id/approve -> aprova (REVIEW -> PUBLISHED). Somente ADMIN.
router.patch('/:id/approve', auth, role('ADMIN'), approve);

// PATCH /articles/:id/reject -> rejeita (REVIEW -> REJECTED). Somente ADMIN.
router.patch('/:id/reject', auth, role('ADMIN'), reject);

// POST /articles/:id/like -> curte o artigo (sem duplicar por usuario).
router.post('/:id/like', auth, like);

// DELETE /articles/:id/like -> remove a curtida do usuario.
router.delete('/:id/like', auth, unlike);

// POST /articles/:id/report -> denuncia o artigo (sem duplicar por usuario).
router.post('/:id/report', auth, report);

// GET /articles/:id/comments -> lista os comentarios do artigo (paginado).
router.get('/:id/comments', listComments);

// POST /articles/:id/comments -> comenta no artigo (somente PUBLISHED).
router.post('/:id/comments', auth, createComment);

// PUT /articles/:id -> edita o proprio artigo (somente DRAFT/REVIEW).
router.put('/:id', auth, articleOwnership, update);

// DELETE /articles/:id -> exclui o proprio artigo (somente DRAFT/REVIEW).
router.delete('/:id', auth, articleOwnership, remove);

module.exports = router;
