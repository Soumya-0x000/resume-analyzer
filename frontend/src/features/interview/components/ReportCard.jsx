import { AlertTriangle, Calendar, ChevronRight, Code2, Layers, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import CircularScore from "./CircularScore";
import SeverityBadge from "./SeverityBadge";
import StatChip from "./StatChip";
import {
    extractJobPreview,
    extractJobTitle,
    formatDate,
    getDateFromObjectId,
    getScoreConfig,
} from "../utils/report.helpers";

const ReportCard = ({ report }) => {
    const navigate = useNavigate();
    const title = extractJobTitle(report.jobDescription);
    const preview = extractJobPreview(report.jobDescription);
    const date = formatDate(getDateFromObjectId(report._id));
    const scoreCfg = getScoreConfig(report.matchScore);

    return (
        <Card className="flex flex-col transition-all duration-200 hover:shadow-md">
            <CardHeader className="border-b">
                <div className="flex items-start gap-3">
                    <CircularScore score={report.matchScore} />
                    <div className="min-w-0 flex-1">
                        <h3 className="line-clamp-2 text-sm font-semibold leading-snug">{title}</h3>
                        <span
                            className={cn(
                                "mt-1.5 inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium",
                                scoreCfg.badge,
                            )}
                        >
                            {scoreCfg.label}
                        </span>
                        <div className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3 shrink-0" />
                            {date}
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col gap-4 pt-4">
                {preview && (
                    <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                        {preview}
                    </p>
                )}

                {report.skillGaps?.length > 0 && (
                    <div className="space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-medium">
                            <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                            Skill Gaps
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {report.skillGaps.map((sg, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-1 rounded-full border bg-muted/40 py-0.5 pl-2.5 pr-1.5"
                                >
                                    <span className="text-xs">{sg.gap}</span>
                                    <SeverityBadge severity={sg.severity} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-auto" />

                <Separator />

                <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-3">
                        <StatChip
                            icon={Code2}
                            value={report.technicalQuestions?.length ?? 0}
                            label="Tech Q"
                        />
                        <StatChip
                            icon={MessageSquare}
                            value={report.behavioralQuestions?.length ?? 0}
                            label="Behavioral"
                        />
                        <StatChip
                            icon={Layers}
                            value={report.preparationPlan?.length ?? 0}
                            label="Phases"
                        />
                    </div>
                    <Button
                        variant="ghost"
                        size="xs"
                        className="shrink-0 gap-0.5 text-xs"
                        onClick={() => navigate(`/reports/${report._id}`, { state: { report } })}
                    >
                        View
                        <ChevronRight className="h-3 w-3" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default ReportCard;
