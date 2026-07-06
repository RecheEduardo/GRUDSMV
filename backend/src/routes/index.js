const { Router } = require('express');

const healthRoutes = require('./health.routes');
const authRoutes = require('./auth.routes');

// Agregador central de rotas. Novos modulos (articles, ...) entram aqui.
const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);

module.exports = router;
