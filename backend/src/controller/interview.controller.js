import { generateInterviewReport } from '../service/ai.service.js';
import InterviewReportModel from '../models/interviewReport.model.js';
import { sendResponse } from '../lib/sendResponse.js';
import { sendError } from '../lib/sendError.js';
import { extractTextFromPDF } from '../lib/extractTextFromPDF.js';

/**
 * @name generateInterviewReportController
 * @description generate interview report as per provided resume, job description, self description
 */
const generateInterviewReportController = async (req, res) => {
    try {
        const { file, user, body } = req;
        const { jobDescription, selfDescription } = body;

        if (!file) {
            sendError(res, { status: 400, message: 'Resume file is required' });
            return;
        }
        if (!jobDescription) {
            sendError(res, { status: 400, message: 'Job description is required' });
            return;
        }
        if (!selfDescription) {
            sendError(res, { status: 400, message: 'Self description is required' });
            return;
        }
        const resumeContent = await extractTextFromPDF(file);

        const interviewReportByAi = await generateInterviewReport({
            resume: resumeContent,
            jobDescription,
            selfDescription,
        });

        const interviewReport = await InterviewReportModel.create({
            user: req.user.id,
            resume: resumeContent,
            selfDescription,
            jobDescription,
            ...interviewReportByAi,
        });

        sendResponse(res, {
            status: 201,
            message: 'Interview report generated successfully',
            data: interviewReport,
        });
    } catch (error) {
        console.error('Error in generateInterviewReportController:', error);
        sendError(res, { status: 500, message: 'Server error' });
    }
};

/**
 * @name getInterviewReportById
 */
const getInterviewReportById = () => {};

export const interviewController = {
    generateInterviewReportController,
};
