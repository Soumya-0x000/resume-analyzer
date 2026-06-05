import { Briefcase, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { MAX_JOB_DESC } from "./home.helpers";

const JobDescriptionCard = ({ register, errors, jobDescValue }) => (
    <Card className="col-start-1 row-start-1 row-span-2 flex flex-col">
        <CardHeader className="shrink-0 border-b">
            <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Briefcase className="h-3.5 w-3.5 text-primary" />
                </div>
                <div>
                    <CardTitle>Job Description</CardTitle>
                    <CardDescription>Paste the full role you're targeting</CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col pt-4">
            <Textarea
                id="jobDescription"
                placeholder="e.g. We are looking for a Senior Frontend Engineer with 5+ years of React experience, strong TypeScript skills, and experience with modern build tools..."
                className="h-72 flex-1 resize-none overflow-y-auto text-xs leading-relaxed"
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
);

export default JobDescriptionCard;
