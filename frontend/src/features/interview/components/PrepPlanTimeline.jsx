import { CheckSquare, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const getPhaseTitle = (phase, i) => {
    if (typeof phase === "string") return phase;
    return phase.phase ?? phase.title ?? phase.week ?? `Phase ${i + 1}`;
};

const getPhaseTasks = (phase) => {
    if (typeof phase === "string") return [];
    return phase.tasks ?? phase.activities ?? phase.steps ?? [];
};

const getPhaseDescription = (phase) => {
    if (typeof phase === "string") return null;
    return phase.description ?? phase.focus ?? phase.overview ?? null;
};

const getPhaseDuration = (phase) => {
    if (typeof phase === "string") return null;
    return phase.duration ?? phase.timeframe ?? null;
};

const PrepPlanTimeline = ({ plan = [] }) => {
    if (!plan.length) return null;

    return (
        <Card>
            <CardHeader className="border-b py-3">
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <CardTitle className="text-sm">Preparation Plan</CardTitle>
                    <span className="ml-auto text-xs text-muted-foreground">
                        {plan.length} phase{plan.length !== 1 ? "s" : ""}
                    </span>
                </div>
            </CardHeader>
            <CardContent className="pb-2 pt-5">
                <div>
                    {plan.map((phase, i) => {
                        const title = getPhaseTitle(phase, i);
                        const tasks = getPhaseTasks(phase);
                        const desc = getPhaseDescription(phase);
                        const duration = getPhaseDuration(phase);
                        const isLast = i === plan.length - 1;

                        return (
                            <div key={i} className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 ring-2 ring-background ring-offset-1 ring-offset-primary/20">
                                        <span className="text-[10px] font-bold text-primary">
                                            {i + 1}
                                        </span>
                                    </div>
                                    {!isLast && (
                                        <div className="my-1 w-px flex-1 bg-border" />
                                    )}
                                </div>

                                <div className={cn("flex-1 pb-5", isLast && "pb-2")}>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium">{title}</span>
                                        {duration && (
                                            <span className="rounded-full border px-2 py-0.5 text-[10px] text-muted-foreground">
                                                {duration}
                                            </span>
                                        )}
                                    </div>
                                    {desc && (
                                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                                            {desc}
                                        </p>
                                    )}
                                    {tasks.length > 0 && (
                                        <ul className="mt-2 space-y-1.5">
                                            {tasks.map((task, ti) => (
                                                <li
                                                    key={ti}
                                                    className="flex items-start gap-1.5 text-xs text-muted-foreground"
                                                >
                                                    <CheckSquare className="mt-0.5 h-3 w-3 shrink-0 text-primary/60" />
                                                    {typeof task === "string"
                                                        ? task
                                                        : (task.task ?? task.title ?? JSON.stringify(task))}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
};

export default PrepPlanTimeline;
