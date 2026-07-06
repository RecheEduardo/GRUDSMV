const { Router } = require('express');

const { create, listMine } = require('../controllers/article.controller');
const auth = require('../middlewares/auth');

const router = Router();

// POST /articles -> cria artigo (rascunho). Requer autenticacao.
router.post('/', auth, create);

// GET /articles/mine -> artigos do autor logado.
router.get('/mine', auth, listMine);

module.exports = router;
