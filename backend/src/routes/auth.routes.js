import { Router } from 'express';

import { register, login, me } from '../controllers/auth.controller.js';
import auth from '../middlewares/auth.js';

const router = Router();

// POST /auth/register -> cria usuario (senha com hash bcrypt)
router.post('/register', register);

// POST /auth/login -> { token, user }
router.post('/login', login);

// GET /auth/me -> usuario do token (rota protegida)
router.get('/me', auth, me);

export default router;
