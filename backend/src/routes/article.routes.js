const { Router } = require('express');

const {
  create,
  listMine,
  submit,
  approve,
  reject,
  update,
  remove,
} = require('../controllers/article.controller');
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');
const { articleOwnership } = require('../middlewares/ownership');

const router = Router();

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

// PUT /articles/:id -> edita o proprio artigo (somente DRAFT/REVIEW).
router.put('/:id', auth, articleOwnership, update);

// DELETE /articles/:id -> exclui o proprio artigo (somente DRAFT/REVIEW).
router.delete('/:id', auth, articleOwnership, remove);

module.exports = router;
