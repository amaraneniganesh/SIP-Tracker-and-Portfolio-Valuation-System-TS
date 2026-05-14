import { Request, Response } from 'express';
import * as SIPModel from '../models/sipModel';

export const processSIP = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await SIPModel.processInstallment(req.params.sipId as string);
        res.status(201).json({ message: "SIP Installment Processed", data: result });
    } catch (err: any) {
        res.status(500).json({ error: typeof err === 'string' ? err : err.message });
    }
};

export const createSIP = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await SIPModel.createSIP(req.body);
        res.status(201).json({
            message: "SIP Created",
            data: result
        });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const getInvestorSips = async (req: Request, res: Response): Promise<void> => {
    try {
        const rows = await SIPModel.getSipsByInvestorId(req.params.investorId as string);
        res.json(rows);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const getTransactions = async (req: Request, res: Response): Promise<void> => {
    try {
        const rows = await SIPModel.getTransactions(req.params.investorId as string);
        res.json(rows);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};