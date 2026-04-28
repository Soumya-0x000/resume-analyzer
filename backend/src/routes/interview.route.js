import { Router } from 'express';
import authenticateUser from '../middlewares/auth.middleware.js';
import upload from '../middlewares/file.middleware.js';
import { interviewController } from '../controller/interview.controller.js';

const interviewRouter = Router();

/**
 * @route POST /api/interview/generate-report
 * @description Generate interview report
 * @access Private
 */
interviewRouter.post(
    '/generate-report',
    authenticateUser,
    upload.single('resume'),
    interviewController.generateInterviewReportController,
);

export default interviewRouter;
