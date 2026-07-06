import { Router } from 'express';

import { listReview, getStats } from '../controllers/admin.controller.js';
import auth from '../middlewares/auth.js';
import role from '../middlewares/role.js';

const router = Router();

// GET /admin/articles/review -> fila de moderacao (somente ADMIN).
router.get('/articles/review', auth, role('ADMIN'), listReview);

// GET /admin/stats -> artigos publicados, curtidas e comentarios por usuario.
router.get('/stats', auth, role('ADMIN'), getStats);

export default router;
