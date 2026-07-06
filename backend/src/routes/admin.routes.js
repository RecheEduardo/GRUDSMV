const { Router } = require('express');

const { listReview, getStats } = require('../controllers/admin.controller');
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');

const router = Router();

// GET /admin/articles/review -> fila de moderacao (somente ADMIN).
router.get('/articles/review', auth, role('ADMIN'), listReview);

// GET /admin/stats -> artigos publicados, curtidas e comentarios por usuario.
router.get('/stats', auth, role('ADMIN'), getStats);

module.exports = router;
