import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './configs/db.config.js';
import authRouter from './routes/auth.route.js';
import storeRouter from './routes/stores.route.js'
import productRouter from './routes/products.route.js'

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true 
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/stores', storeRouter);
app.use('/api/products', productRouter);

app.get('/', (req, res) => {
  res.send("hello");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
