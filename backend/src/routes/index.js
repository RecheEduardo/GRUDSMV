import { Router } from 'express';

import healthRoutes from './health.routes.js';
import authRoutes from './auth.routes.js';
import articleRoutes from './article.routes.js';
import commentRoutes from './comment.routes.js';
import adminRoutes from './admin.routes.js';

// Agregador central de rotas.
const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/articles', articleRoutes);
router.use('/comments', commentRoutes);
router.use('/admin', adminRoutes);

export default router;
