import { Request, Response } from 'express';
import * as FundModel from '../models/fundModel';

export const getFunds = async (req: Request, res: Response): Promise<void> => {
    try {
        const rows = await FundModel.getAll();
        res.json(rows);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const addFund = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await FundModel.create(req.body);
        res.status(201).json(result);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const updateNav = async (req: Request, res: Response): Promise<void> => {
    try {
        await FundModel.updateNav(req.params.fundId as string, req.body.current_nav);
        res.json({ message: "NAV updated successfully" });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};