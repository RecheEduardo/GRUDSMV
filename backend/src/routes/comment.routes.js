const { Router } = require('express');

const { remove } = require('../controllers/comment.controller');
const auth = require('../middlewares/auth');

const router = Router();

// DELETE /comments/:id -> exclui o proprio comentario (apenas o autor).
router.delete('/:id', auth, remove);

module.exports = router;
