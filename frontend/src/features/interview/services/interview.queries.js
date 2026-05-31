import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { generateInterviewReport, getInterviewReportById } from "./interview.api";

const interviewKey = ["interview"];

export function useGenerateInterviewReport() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => generateInterviewReport(data),
        onSuccess: () => {
            queryClient.invalidateQueries(interviewKey);
        },
        onError: (error) => {
            console.error("Error generating interview report:", error);
        },
    });
}

export function useGetInterviewReportById(interviewId, options = {}) {
    return useQuery({
        queryKey: [...interviewKey, interviewId],
        queryFn: async () => {
            const res = await getInterviewReportById(interviewId);
            return res?.data?.data;
        },
        retry: false,
        ...options,
    });
}
