import { authApi } from '@/lib/axios';

export const generateInterviewReport = (data) => authApi.post('/interview/generate-report', data);
export const getInterviewReportById = (interviewId) => authApi.get(`/interview/report/${interviewId}`);
