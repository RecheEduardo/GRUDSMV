const { Router } = require('express');

const {
  create,
  listMine,
  submit,
  approve,
  reject,
} = require('../controllers/article.controller');
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');

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

module.exports = router;
