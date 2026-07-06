const { Router } = require('express');

const {
  remove,
  like,
  unlike,
  report,
} = require('../controllers/comment.controller');
const auth = require('../middlewares/auth');

const router = Router();

// DELETE /comments/:id -> exclui o proprio comentario (apenas o autor).
router.delete('/:id', auth, remove);

// POST /comments/:id/like -> curte o comentario (sem duplicar por usuario).
router.post('/:id/like', auth, like);

// DELETE /comments/:id/like -> remove a curtida do usuario.
router.delete('/:id/like', auth, unlike);

// POST /comments/:id/report -> denuncia o comentario (sem duplicar por usuario).
router.post('/:id/report', auth, report);

module.exports = router;
