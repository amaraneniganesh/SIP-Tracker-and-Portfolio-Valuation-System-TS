import { Router } from 'express';
import * as fundController from '../controllers/fundController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authMiddleware, fundController.getFunds);
router.post('/', authMiddleware, fundController.addFund);
router.put('/:fundId/nav', authMiddleware, fundController.updateNav);

export default router;