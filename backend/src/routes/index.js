const { Router } = require('express');

const healthRoutes = require('./health.routes');

// Agregador central de rotas. Novos modulos (auth, articles, ...) entram aqui.
const router = Router();

router.use('/health', healthRoutes);

module.exports = router;
