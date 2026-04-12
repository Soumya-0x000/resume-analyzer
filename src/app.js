import express from 'express';
import authRouter from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import { sendResponse } from './lib/sendResponse.js';

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/', (req, res) => sendResponse(res, { status: 200, message: 'Connected' }));
app.use('/api/auth', authRouter);

export default app;
