import { User, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { MAX_SELF_DESC } from "./home.helpers";

const AboutYouCard = ({ register, errors, selfDescValue }) => (
    <Card className="flex flex-col min-h-0 overflow-hidden">
        <CardHeader className="shrink-0 border-b">
            <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-3.5 w-3.5 text-primary" />
                </div>
                <div>
                    <CardTitle>About Me</CardTitle>
                    <CardDescription>Your background and key strengths</CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col pt-4 min-h-0 overflow-hidden">
            <Textarea
                id="selfDescription"
                placeholder="e.g. I'm a frontend developer with 3 years in React and TypeScript. I've led small teams, enjoy performance optimization, and have shipped features used by 50k+ users..."
                className="flex-1 min-h-0 field-sizing-fixed resize-none overflow-y-auto text-xs leading-relaxed"
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
);

export default AboutYouCard;
