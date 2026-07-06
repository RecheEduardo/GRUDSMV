const { Router } = require('express');

const { register, login } = require('../controllers/auth.controller');

const router = Router();

// POST /auth/register -> cria usuario (senha com hash bcrypt)
router.post('/register', register);

// POST /auth/login -> { token, user }
router.post('/login', login);

module.exports = router;
