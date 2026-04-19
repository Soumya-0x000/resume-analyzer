import express from 'express';
import authRouter from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

const allowedOrigins = ['http://localhost:5173', 'https://resume-analyzer-3cau.vercel.app/'];

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (like mobile apps or curl requests)
            if (!origin) return callback(null, true);

            // Allow specific origins
            if (allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
    }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth', authRouter);

export default app;
