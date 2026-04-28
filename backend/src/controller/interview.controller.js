import { PDFParse } from 'pdf-parse';
import { generateInterviewReport } from '../service/ai.service.js';
import InterviewReportModel from '../models/interviewReport.model.js';
import { sendResponse } from '../lib/sendResponse.js';
import { sendError } from '../lib/sendError.js';

const generateInterviewReportController = async (req, res) => {
    try {
        const {
            file: { buffer: resumeBuffer },
            user,
            body: { jobDescription, selfDescription },
        } = req;

        if (!resumeBuffer) {
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
        const resumeContent = new PDFParse(resumeBuffer);
        console.log(resumeContent);
        console.log(jobDescription);
        console.log(selfDescription);

        // const interviewReportByAi = await generateInterviewReport({
        //     resume: resumeContent,
        //     jobDescription,
        //     selfDescription,
        // });

        // const interviewReport = await InterviewReportModel.create({
        //     user: req.user.id,
        //     resume: resumeContent,
        //     selfDescription,
        //     jobDescription,
        //     ...interviewReportByAi
        // });

        sendResponse(res, {
            status: 201,
            message: 'Interview report generated successfully',
            data: 'interviewReport',
        });
    } catch (error) {
        console.error('Error in generateInterviewReportController:', error);
        sendError(res, { status: 500, message: 'Server error' });
    }
};

export const interviewController = {
    generateInterviewReportController,
};
