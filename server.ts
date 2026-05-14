import express, { Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// Import routers
import investorRoutes from './routes/investorRoutes';
import fundRoutes from './routes/fundRoutes';
import sipRoutes from './routes/sipRoutes';

dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.json());

// Link all routes
app.use('/api/investors', investorRoutes);
app.use('/api/funds', fundRoutes);
app.use('/api/sips', sipRoutes);

const PORT: number = Number(process.env.PORT) || 4000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});