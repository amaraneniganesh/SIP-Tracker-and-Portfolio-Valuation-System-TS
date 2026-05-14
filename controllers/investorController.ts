import { Request, Response } from 'express';
import * as InvestorModel from '../models/investorModel';
import { AuthRequest } from '../middleware/authMiddleware';

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await InvestorModel.createInvestor(req.body);
        res.status(201).json(result);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await InvestorModel.loginInvestor(req.body.email, req.body.password);
        res.json(result);
    } catch (err: any) {
        res.status(401).json({ error: err.message });
    }
};

export const getInvestorHoldings = async (req: Request, res: Response): Promise<void> => {
    try {
        const rows = await InvestorModel.getHoldings(req.params.investorId as string);
        res.json(rows);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const getInvestorById = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await InvestorModel.getInvestorById(req.params.investorId as string);
        res.json(result);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const getNetWorth = async (req: Request, res: Response): Promise<void> => {
    try {
        const row = await InvestorModel.getNetWorth(req.params.investorId as string);
        res.json(row);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const logout = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (req.token) {
            await InvestorModel.logout(req.token);
        }
        res.json({ message: "Logged out successfully" });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};