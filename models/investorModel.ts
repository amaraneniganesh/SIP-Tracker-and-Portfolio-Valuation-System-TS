import client from '../utility/pgManager';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export interface InvestorData {
    name: string;
    email: string;
    password?: string;
    phone: string;
}

export const createInvestor = async (data: InvestorData): Promise<any> => {
    if (!data.password) throw new Error("Password is required");
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const sql = `
        INSERT INTO investors (name, email, password, phone)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;

    const result = await client.query(sql, [data.name, data.email, hashedPassword, data.phone]);
    return result.rows[0];
};

export const loginInvestor = async (email: string, password: string): Promise<any> => {
    const sql = `SELECT * FROM investors WHERE email = $1`;
    const result = await client.query(sql, [email]);
    const user = result.rows[0];

    if (!user) throw new Error("User not found");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    const secret = process.env.JWT_SECRET || 'fallback_secret';
    const token = jwt.sign({ id: user.id }, secret, { expiresIn: "10h" });
    
    return { token, user: { id: user.id, name: user.name } };
};

export const logout = async (token: string): Promise<void> => {
    const sql = `INSERT INTO token_blacklist (token) VALUES ($1)`;
    await client.query(sql, [token]);
};

export const getInvestorById = async (id: number | string): Promise<any> => {
    const sql = `SELECT id, name, email, phone FROM investors WHERE id = $1`;
    const result = await client.query(sql, [id]);
    return result.rows[0];
};

export const getHoldings = async (investorId: number | string): Promise<any[]> => {
    const sql = `
        SELECT f.fund_name, SUM(t.units_allotted) as total_units, 
        f.current_nav, (SUM(t.units_allotted) * f.current_nav) as current_value
        FROM transactions t
        JOIN funds f ON t.fund_id = f.id
        WHERE t.investor_id = $1
        GROUP BY f.id, f.fund_name, f.current_nav`;
    
    const result = await client.query(sql, [investorId]);
    return result.rows;
};

export const getNetWorth = async (investorId: number | string): Promise<{ total_net_worth: number }> => {
    const sql = `
        SELECT SUM(t.units_allotted * f.current_nav) as total_net_worth
        FROM transactions t
        JOIN funds f ON t.fund_id = f.id
        WHERE t.investor_id = $1`;

    const result = await client.query(sql, [investorId]);
    return { total_net_worth: result.rows[0].total_net_worth || 0 };
};