import { Router } from 'express';
import * as investorController from '../controllers/investorController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', investorController.register);
router.post('/login', investorController.login);
router.get('/:investorId/networth', authMiddleware, investorController.getNetWorth);
router.get('/:investorId', authMiddleware, investorController.getInvestorById);
router.get('/:investorId/holdings', authMiddleware, investorController.getInvestorHoldings);
router.post('/logout', authMiddleware, investorController.logout);

export default router;