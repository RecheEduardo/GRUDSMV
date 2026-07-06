const { Router } = require('express');

const { register, login, me } = require('../controllers/auth.controller');
const auth = require('../middlewares/auth');

const router = Router();

// POST /auth/register -> cria usuario (senha com hash bcrypt)
router.post('/register', register);

// POST /auth/login -> { token, user }
router.post('/login', login);

// GET /auth/me -> usuario do token (rota protegida)
router.get('/me', auth, me);

module.exports = router;
