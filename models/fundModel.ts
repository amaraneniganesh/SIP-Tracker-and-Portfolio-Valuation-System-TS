import client from '../utility/pgManager';

export interface FundData {
    fund_name: string;
    amc_name: string;
    current_nav: number;
}

export const getAll = async (): Promise<any[]> => {
    const result = await client.query("SELECT * FROM funds");
    return result.rows;
};

export const create = async (data: FundData): Promise<{ id: number }> => {
    const sql = `INSERT INTO funds (fund_name, amc_name, current_nav) VALUES ($1, $2, $3) RETURNING id`;
    const result = await client.query(sql, [data.fund_name, data.amc_name, data.current_nav]);
    return { id: result.rows[0].id };
};

export const updateNav = async (id: number | string, newNav: number): Promise<{ updated: number }> => {
    const sql = `UPDATE funds SET current_nav = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`;
    const result = await client.query(sql, [newNav, id]);
    return { updated: result.rowCount || 0 };
};