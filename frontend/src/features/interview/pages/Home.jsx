import { useState, useRef, useCallback } from "react";
import { Sparkles } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { useGenerateInterviewReport } from "../services/interview.queries";
import { inputFormSchema } from "../utils/home.helpers";
import AboutYouCard from "../components/AboutYouCard";
import JobDescriptionCard from "../components/JobDescriptionCard";
import ResumeUploadCard from "../components/ResumeUploadCard";
import StepsPanel from "../components/StepsPanel";

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
        <div className="bg-background p-6 space-y-6 h-full">
            <form onSubmit={handleSubmit(onSubmit)} className="h-full">
                <div className="grid grid-cols-[1fr_1fr_auto] grid-rows-[auto_1fr] gap-4 h-full">
                    <JobDescriptionCard
                        register={register}
                        errors={errors}
                        jobDescValue={jobDescValue}
                    />
                    <ResumeUploadCard
                        uploadedFile={uploadedFile}
                        dragActive={dragActive}
                        errors={errors}
                        fileInputRef={fileInputRef}
                        handleDrag={handleDrag}
                        handleDrop={handleDrop}
                        applyFile={applyFile}
                        removeFile={removeFile}
                    />
                    <AboutYouCard
                        register={register}
                        errors={errors}
                        selfDescValue={selfDescValue}
                    />
                    <StepsPanel
                        completedFields={completedFields}
                        isPending={isPending}
                        isValid={isValid}
                    />
                </div>
            </form>
        </div>
    );
};

export default Home;
