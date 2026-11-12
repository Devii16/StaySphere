import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import hotelRoutes from './routes/hotelRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';

const app = express();
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173'
}));
app.use(express.json());

app.get('/', (_req, res) => res.json({ success: true, message: 'StaySphere API is running' }));
app.get('/api/health', (_req, res) => res.json({ success: true, message: 'Backend healthy' }));
app.use('/api/hotels', hotelRoutes);
app.use('/api/bookings', bookingRoutes);

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`StaySphere API running at http://localhost:${PORT}`));
}).catch((error) => {
  console.error(`Database connection failed: ${error.message}`);
  process.exit(1);
});
