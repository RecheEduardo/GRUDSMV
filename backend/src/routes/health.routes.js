const { Router } = require('express');

const { getHealth } = require('../controllers/health.controller');

const router = Router();

// GET /health -> { status: "ok" }
router.get('/', getHealth);

module.exports = router;
