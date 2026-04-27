const generateInterviewReportController = async (req, res) => {
    try {
    } catch (error) {
        console.error('Error in generateInterviewReportController:', error);
        sendError(res, { status: 500, message: 'Server error' });
    }
};

export const interviewController = {
    generateInterviewReportController,
};
