import { z } from "zod";
import { Briefcase, FileText, User } from "lucide-react";

export const MAX_JOB_DESC = 2000;
export const MAX_SELF_DESC = 1000;

export const inputFormSchema = z.object({
    jobDescription: z
        .string()
        .min(10, "At least 10 characters required")
        .max(MAX_JOB_DESC, `Max ${MAX_JOB_DESC} characters`),
    resumeFile: z
        .instanceof(File, { message: "Please upload your resume" })
        .refine((f) => f.type === "application/pdf", "Only PDF files are allowed"),
    selfDescription: z
        .string()
        .min(10, "At least 10 characters required")
        .max(MAX_SELF_DESC, `Max ${MAX_SELF_DESC} characters`),
});

export const STEPS = [
    { label: "Job Role", icon: Briefcase },
    { label: "Resume", icon: FileText },
    { label: "About You", icon: User },
];

export function formatFileSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
