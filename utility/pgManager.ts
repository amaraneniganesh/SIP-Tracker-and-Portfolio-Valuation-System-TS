import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    host: process.env.host,
    port: Number(process.env.dbport) || 5432,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
    max: 2,
    ssl: {
        rejectUnauthorized: false
    }
});

async function testConnection() {
    try {
        const client = await pool.connect();
        console.log("✅ Database connected successfully");
        client.release();
    } catch (err: any) {
        console.error("❌ Connection error:", err.message);
    }
}

testConnection();

export default pool;