import { authApi } from "@/lib/axios";

export const generateInterviewReport = (data) => authApi.post("/interview/generate-report", data);
export const getInterviewReportById = ({ userId, pagination }) =>
    authApi.get(`/interview/report/${userId}`, { params: pagination });
