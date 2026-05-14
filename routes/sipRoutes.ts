import { Router } from 'express';
import * as sipController from '../controllers/sipController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/:sipId/process', authMiddleware, sipController.processSIP);
router.get('/transactions/:investorId', authMiddleware, sipController.getTransactions);
router.get('/investor/:investorId', authMiddleware, sipController.getInvestorSips);
router.post('/', authMiddleware, sipController.createSIP);

export default router;