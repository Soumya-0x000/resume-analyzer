import { generateInterviewReport } from "../service/ai.service.js";
import InterviewReportModel from "../models/interviewReport.model.js";
import { sendResponse } from "../lib/sendResponse.js";
import { sendError } from "../lib/sendError.js";
import { extractTextFromPDF } from "../lib/extractTextFromPDF.js";

/**
 * @name generateInterviewReportController
 * @description generate interview report as per provided resume, job description, self description
 */
const generateInterviewReportController = async (req, res) => {
    try {
        const { file, user, body } = req;
        const { jobDescription, selfDescription } = body;

        if (!file) {
            sendError(res, { status: 400, message: "Resume file is required" });
            return;
        }
        if (!jobDescription) {
            sendError(res, { status: 400, message: "Job description is required" });
            return;
        }
        if (!selfDescription) {
            sendError(res, { status: 400, message: "Self description is required" });
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
            message: "Interview report generated successfully",
            data: interviewReport,
        });
    } catch (error) {
        console.error("Error in generateInterviewReportController:", error);
        sendError(res, { status: 500, message: "Server error" });
    }
};

/**
 * @name getInterviewReportById
 */
const getInterviewReportById = async (req, res) => {
    try {
        const { userId } = req.params;
        const { page = 1, offset = 10 } = req.query;

        const pageNumber = Math.max(parseInt(page, 10), 1);
        const limit = Math.max(parseInt(offset, 10), 1);
        const skip = (pageNumber - 1) * limit;

        const filter = userId ? { user: userId } : {};

        const interviewReports = await InterviewReportModel.find(filter)
            .skip(skip)
            .limit(limit)
            .sort({ _id: -1 });

        const total = await InterviewReportModel.countDocuments(filter);

        sendResponse(res, {
            status: 200,
            message: "Interview reports fetched",
            data: {
                items: interviewReports,
                pagination: {
                    page: pageNumber,
                    offset: limit,
                    total,
                    hasNext: skip + interviewReports.length < total,
                },
            },
        });
    } catch (error) {
        console.error("Error in getInterviewReportById:", error);
        sendError(res, { status: 500, message: "Server error" });
    }
};

export const interviewController = {
    generateInterviewReportController,
    getInterviewReportById,
};
