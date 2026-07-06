import { Router } from 'express';

import {
  listTop,
  remove,
  like,
  unlike,
  report,
} from '../controllers/comment.controller.js';
import auth from '../middlewares/auth.js';

const router = Router();

// GET /comments/top -> comentarios mais curtidos (?limit). Publica.
router.get('/top', listTop);

// DELETE /comments/:id -> exclui o proprio comentario (apenas o autor).
router.delete('/:id', auth, remove);

// POST /comments/:id/like -> curte o comentario (sem duplicar por usuario).
router.post('/:id/like', auth, like);

// DELETE /comments/:id/like -> remove a curtida do usuario.
router.delete('/:id/like', auth, unlike);

// POST /comments/:id/report -> denuncia o comentario (sem duplicar por usuario).
router.post('/:id/report', auth, report);

export default router;
