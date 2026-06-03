import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { useGenerateInterviewReport } from "../services/interview.queries";
import { toast } from "sonner";
import {
    FileText,
    User,
    Briefcase,
    CheckCircle,
    X,
    AlertCircle,
    Sparkles,
    ChevronRight,
    FileUp,
} from "lucide-react";

const MAX_JOB_DESC = 2000;
const MAX_SELF_DESC = 1000;

const inputFormSchema = z.object({
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

const STEPS = [
    { label: "Job Role", icon: Briefcase },
    { label: "Resume", icon: FileText },
    { label: "About You", icon: User },
];

const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const Home = () => {
    const [dragActive, setDragActive] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(null);
    const fileInputRef = useRef(null);
    const { mutate: generateReport, isPending } = useGenerateInterviewReport();

    const {
        register,
        handleSubmit,
        setValue,
        control,
        formState: { errors, isValid },
    } = useForm({
        resolver: zodResolver(inputFormSchema),
        defaultValues: { jobDescription: "", resumeFile: undefined, selfDescription: "" },
        mode: "onChange",
    });

    const jobDescValue = useWatch({ control, name: "jobDescription" });
    const selfDescValue = useWatch({ control, name: "selfDescription" });

    const applyFile = useCallback(
        (file) => {
            if (!file) return;
            if (file.type !== "application/pdf") {
                toast.error("Only PDF files are accepted");
                return;
            }
            setUploadedFile(file);
            setValue("resumeFile", file, { shouldValidate: true });
        },
        [setValue],
    );

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(e.type === "dragenter" || e.type === "dragover");
    }, []);

    const handleDrop = useCallback(
        (e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(false);
            applyFile(e.dataTransfer.files?.[0]);
        },
        [applyFile],
    );

    const removeFile = useCallback(() => {
        setUploadedFile(null);
        setValue("resumeFile", undefined, { shouldValidate: true });
        if (fileInputRef.current) fileInputRef.current.value = "";
    }, [setValue]);

    const onSubmit = (data) => {
        const formData = new FormData();
        formData.append("jobDescription", data.jobDescription);
        formData.append("resumeFile", data.resumeFile);
        formData.append("selfDescription", data.selfDescription);
        const toastId = toast.loading("Generating your interview report...");
        try {
            generateReport(formData, {
                onSuccess: () =>
                    toast.success("Interview report is being generated!", { id: toastId }),
                onError: () =>
                    toast.error("Failed to generate report. Please try again.", { id: toastId }),
            });
        } catch (error) {
            toast.error(error.message || "Failed to generate report. Please try again.", {
                id: toastId,
            });
        }
    };

    const completedFields = [
        (jobDescValue?.length ?? 0) >= 10,
        !!uploadedFile,
        (selfDescValue?.length ?? 0) >= 10,
    ];

    return (
        <div className="flex flex-1 min-h-0 h-full bg-background p-4">
            <div className="flex flex-1 flex-row-reverse gap-10">
                {/* ── Step badges ── */}
                <div className="flex flex-col items-start justify-end gap-2">
                    {STEPS.map(({ label, icon }, i) => {
                        const Icon = icon;
                        return (
                            <div key={label} className="flex flex-col items-start gap-1">
                                <div
                                    className={cn(
                                        "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-300",
                                        completedFields[i]
                                            ? "bg-primary text-primary-foreground"
                                            : "border border-border bg-card text-muted-foreground",
                                    )}
                                >
                                    {completedFields[i] ? (
                                        <CheckCircle className="h-3.5 w-3.5" />
                                    ) : (
                                        <Icon className="h-3.5 w-3.5" />
                                    )}
                                    {label}
                                </div>
                                {i < STEPS.length - 1 && (
                                    <div
                                        className={cn(
                                            "ml-4.75 h-5 w-px transition-colors duration-300",
                                            completedFields[i] ? "bg-primary" : "bg-border",
                                        )}
                                    />
                                )}
                            </div>
                        );
                    })}

                    {/* ── Submit ── */}
                    <div className="mt-4">
                        <div className="flex flex-col items-center gap-3">
                            <Button
                                type="submit"
                                size="lg"
                                disabled={isPending || !isValid}
                                className="gap-2 px-10"
                            >
                                {isPending ? (
                                    <>
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="h-4 w-4" />
                                        Generate Interview Report
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* ── Form ── */}
                <form onSubmit={handleSubmit(onSubmit)} className="w-full grid gap-6 md:grid-cols-2">
                    {/* Job Description */}
                    <Card className="flex flex-col">
                        <CardHeader className="border-b">
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                    <Briefcase className="h-3.5 w-3.5 text-primary" />
                                </div>
                                <div>
                                    <CardTitle>Job Description</CardTitle>
                                    <CardDescription>
                                        Paste the full role you're targeting
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="flex flex-1 flex-col pt-4">
                            <Textarea
                                id="jobDescription"
                                placeholder="e.g. We are looking for a Senior Frontend Engineer with 5+ years of React experience, strong TypeScript skills, and experience with modern build tools..."
                                className="min-h-70 flex-1 resize-none text-xs leading-relaxed"
                                {...register("jobDescription")}
                            />
                            <div className="mt-2 flex items-center justify-between">
                                {errors.jobDescription ? (
                                    <p className="flex items-center gap-1 text-xs text-destructive">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.jobDescription.message}
                                    </p>
                                ) : (
                                    <span />
                                )}
                                <span
                                    className={cn(
                                        "text-xs tabular-nums",
                                        (jobDescValue?.length ?? 0) > MAX_JOB_DESC * 0.9
                                            ? "text-destructive"
                                            : "text-muted-foreground",
                                    )}
                                >
                                    {jobDescValue?.length ?? 0}/{MAX_JOB_DESC}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Right column */}
                    <div className="flex flex-col gap-6">
                        {/* Resume Upload */}
                        <Card>
                            <CardHeader className="border-b">
                                <div className="flex items-center gap-2.5">
                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                        <FileText className="h-3.5 w-3.5 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle>Resume</CardTitle>
                                        <CardDescription>PDF format · max 10 MB</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4">
                                {uploadedFile ? (
                                    <div className="flex items-center gap-3 rounded-lg border border-primary/25 bg-primary/5 p-3">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                            <FileText className="h-4 w-4 text-primary" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-xs font-medium">
                                                {uploadedFile.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatFileSize(uploadedFile.size)}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={removeFile}
                                            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                                        >
                                            <X className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                ) : (
                                    <div
                                        role="button"
                                        tabIndex={0}
                                        onDragEnter={handleDrag}
                                        onDragLeave={handleDrag}
                                        onDragOver={handleDrag}
                                        onDrop={handleDrop}
                                        onClick={() => fileInputRef.current?.click()}
                                        onKeyDown={(e) =>
                                            e.key === "Enter" && fileInputRef.current?.click()
                                        }
                                        className={cn(
                                            "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-8 text-center outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                                            dragActive
                                                ? "border-primary bg-primary/5"
                                                : "border-border hover:border-primary/40 hover:bg-accent/30",
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                "flex h-10 w-10 items-center justify-center rounded-full transition-colors",
                                                dragActive ? "bg-primary/15" : "bg-muted",
                                            )}
                                        >
                                            <FileUp
                                                className={cn(
                                                    "h-5 w-5 transition-colors",
                                                    dragActive
                                                        ? "text-primary"
                                                        : "text-muted-foreground",
                                                )}
                                            />
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium">
                                                {dragActive
                                                    ? "Drop your PDF here"
                                                    : "Drag & drop your resume"}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                or click to browse
                                            </p>
                                        </div>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="application/pdf"
                                            className="hidden"
                                            onChange={(e) => applyFile(e.target.files?.[0])}
                                        />
                                    </div>
                                )}
                                {errors.resumeFile && (
                                    <p className="mt-2 flex items-center gap-1 text-xs text-destructive">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.resumeFile.message}
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Self Description */}
                        <Card className="flex flex-1 flex-col">
                            <CardHeader className="border-b">
                                <div className="flex items-center gap-2.5">
                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                        <User className="h-3.5 w-3.5 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle>About You</CardTitle>
                                        <CardDescription>
                                            Your background and key strengths
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="flex flex-1 flex-col pt-4">
                                <Textarea
                                    id="selfDescription"
                                    placeholder="e.g. I'm a frontend developer with 3 years in React and TypeScript. I've led small teams, enjoy performance optimization, and have shipped features used by 50k+ users..."
                                    className="min-h-30 flex-1 resize-none text-xs leading-relaxed"
                                    {...register("selfDescription")}
                                />
                                <div className="mt-2 flex items-center justify-between">
                                    {errors.selfDescription ? (
                                        <p className="flex items-center gap-1 text-xs text-destructive">
                                            <AlertCircle className="h-3 w-3" />
                                            {errors.selfDescription.message}
                                        </p>
                                    ) : (
                                        <span />
                                    )}
                                    <span
                                        className={cn(
                                            "text-xs tabular-nums",
                                            (selfDescValue?.length ?? 0) > MAX_SELF_DESC * 0.9
                                                ? "text-destructive"
                                                : "text-muted-foreground",
                                        )}
                                    >
                                        {selfDescValue?.length ?? 0}/{MAX_SELF_DESC}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Home;
