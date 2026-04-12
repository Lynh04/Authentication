import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js'; // Nhớ đuôi .js
import authRoutes from './routes/authRoutes.js';
// Load biến môi trường
dotenv.config();

const app = express();

// Middleware quan trọng
app.use(cors());
app.use(express.json());

// Kết nối Database
connectDB();

// Route gốc
// Mọi request bắt đầu bằng /api/users sẽ đi vào userRoutes
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});