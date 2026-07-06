const { Router } = require('express');

const { create, listMine, submit } = require('../controllers/article.controller');
const auth = require('../middlewares/auth');

const router = Router();

// POST /articles -> cria artigo (rascunho). Requer autenticacao.
router.post('/', auth, create);

// GET /articles/mine -> artigos do autor logado.
router.get('/mine', auth, listMine);

// PATCH /articles/:id/submit -> envia para revisao (DRAFT -> REVIEW).
router.patch('/:id/submit', auth, submit);

module.exports = router;
