import client from '../utility/pgManager';

export interface SIPData {
    investor_id: number;
    fund_id: number;
    amount: number;
    execution_date: number | string;
    status?: string;
}

export const processInstallment = async (sipId: number | string): Promise<any> => {
    const dbClient = await client.connect();
    
    try {
        await dbClient.query("BEGIN");

        const selectSql = `SELECT s.*, f.current_nav FROM sips s 
                           JOIN funds f ON s.fund_id = f.id 
                           WHERE s.id = $1`;
        
        const result = await dbClient.query(selectSql, [sipId]);
        const sip = result.rows[0];
        
        if (!sip) {
            throw new Error("SIP not found");
        }

        const units = sip.amount / sip.current_nav;
        const insertSql = `INSERT INTO transactions (sip_id, investor_id, fund_id, units_allotted, nav_at_transaction, amount_paid)
                           VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`;
        
        const insertRes = await dbClient.query(insertSql, [sip.id, sip.investor_id, sip.fund_id, units, sip.current_nav, sip.amount]);
        
        await dbClient.query("COMMIT");
        return { transactionId: insertRes.rows[0].id, units };
    } catch (error) {
        await dbClient.query("ROLLBACK");
        throw error;
    } finally {
        dbClient.release();
    }
};

export const getTransactions = async (investorId: number | string): Promise<any[]> => {
    const sql = `
        SELECT t.id, f.fund_name, t.units_allotted, t.nav_at_transaction, t.amount_paid, t.transaction_date
        FROM transactions t
        JOIN funds f ON t.fund_id = f.id
        WHERE t.investor_id = $1
        ORDER BY t.transaction_date DESC`;
        
    const result = await client.query(sql, [investorId]);
    return result.rows;
};

export const createSIP = async (data: SIPData): Promise<{ id: number }> => {
    const sql = `INSERT INTO sips (investor_id, fund_id, amount, execution_date, status) 
                 VALUES ($1, $2, $3, $4, $5) RETURNING id`;
    const status = data.status || 'ACTIVE';

    const result = await client.query(sql, [data.investor_id, data.fund_id, data.amount, data.execution_date, status]);
    return { id: result.rows[0].id };
};

export const getSipsByInvestorId = async (investorId: number | string): Promise<any[]> => {
    const sql = `
        SELECT s.*, f.fund_name 
        FROM sips s 
        JOIN funds f ON s.fund_id = f.id 
        WHERE s.investor_id = $1`;
        
    const result = await client.query(sql, [investorId]);
    return result.rows;
};

export const getSipById = async (id: number | string): Promise<any> => {
    const sql = `SELECT * FROM sips WHERE id = $1`;
    const result = await client.query(sql, [id]);
    return result.rows[0];
};