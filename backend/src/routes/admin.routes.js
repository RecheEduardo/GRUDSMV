const { Router } = require('express');

const { listReview } = require('../controllers/admin.controller');
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');

const router = Router();

// GET /admin/articles/review -> fila de moderacao (somente ADMIN).
router.get('/articles/review', auth, role('ADMIN'), listReview);

module.exports = router;
