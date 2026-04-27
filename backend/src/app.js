import express from 'express';
import authRouter from './routes/auth.route.js';
import interviewRouter from './routes/interview.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

const allowedOrigins = ['http://localhost:5173', 'https://resume-analyzer-ai-phi.vercel.app'];

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (like mobile apps, postman)
            if (!origin) return callback(null, true);

            // Check if the origin is in the allowed list
            if (allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                // Block the request if the origin is not allowed
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
app.use('/api/interview', interviewRouter);

export default app;
