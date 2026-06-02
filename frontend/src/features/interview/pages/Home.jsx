import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const inputFormSchema = z.object({
    jobDescription: z.string().min(1, "Job description is required"),
    resumeFile: z
        .instanceof(File, "Resume file is required")
        .refine((file) => file.type === "application/pdf", "Only PDF files are allowed"),
    selfDescription: z.string().min(1, "Self-description is required"),
});

const Home = () => {
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, touchedFields, dirtyFields },
    } = useForm({
        resolver: zodResolver(inputFormSchema),
        defaultValues: {
            jobDescription: "",
            resumeFile: null,
            selfDescription: "",
        },
    });

    const onSubmit = (data) => {
        console.log("Form data:", data);
        // Here you can handle the form submission, e.g., send data to the backend
    };

    return (
        <div className="" id="home">
            <form
                about="give information for getting interview report"
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col md:flex-row gap-8"
            >
                <div id="left-section">
                    <Label htmlFor="jobDescription">Job Description:</Label>
                    <Textarea
                        id="jobDescription"
                        placeholder="Enter your job description here..."
                        {...register("jobDescription")}
                    />
                </div>

                <div id="right-section">
                    <div>
                        <Label htmlFor="resumeFile">Upload your resume (PDF only):</Label>
                        <Input
                            type="file"
                            id="resumeFile"
                            accept="application/pdf"
                            {...register("resumeFile")}
                        />
                    </div>
                    <div className="mt-4">
                        <Label htmlFor="selfDescription">Describe yourself:</Label>
                        <Textarea
                            id="selfDescription"
                            placeholder="Enter a brief self-description..."
                            {...register("selfDescription")}
                        />
                    </div>
                    <Button className="mt-4" type="submit">
                        Generate Interview Report
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default Home;
