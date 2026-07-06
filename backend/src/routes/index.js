const { Router } = require('express');

const healthRoutes = require('./health.routes');
const authRoutes = require('./auth.routes');
const articleRoutes = require('./article.routes');

// Agregador central de rotas.
const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/articles', articleRoutes);

module.exports = router;
