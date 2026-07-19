import { CheckCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { STEPS } from "../utils/home.helpers";

const StepsPanel = ({ completedFields, isPending, isValid }) => (
    <div className="col-start-3 row-start-1 row-span-2 flex flex-col justify-end gap-2 pb-1">
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

        <Button type="submit" size="lg" disabled={isPending || !isValid} className="mt-3 gap-2">
            {isPending ? (
                <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Generating...
                </>
            ) : (
                <>
                    <Sparkles className="h-4 w-4" />
                    Generate Report
                </>
            )}
        </Button>
    </div>
);

export default StepsPanel;
