import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { generateInterviewReport, getInterviewReportById } from "./interview.api";
import { useAuth } from "@/context/auth/useAuth";

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

export function useGetInterviewReportByUserId(options = {}) {
    const { user } = useAuth();
    const userId = user?.id;

    return useQuery({
        queryKey: [...interviewKey, userId],
        queryFn: async () => {
            const res = await getInterviewReportById(userId);
            return res?.data?.data;
        },
        retry: false,
        ...options,
    });
}
