import { ArrowLeft, Calendar, Code2, MessageSquare } from "lucide-react";
import { useLocation, useNavigate } from "react-router";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import ScoreGauge from "../components/ScoreGauge";
import SkillGapsChart from "../components/SkillGapsChart";
import QuestionsOverview from "../components/QuestionsOverview";
import QuestionsSection from "../components/QuestionsSection";
import PrepPlanTimeline from "../components/PrepPlanTimeline";
import {
    extractJobTitle,
    formatDate,
    getDateFromObjectId,
} from "../components/report.helpers";

const ReportDetail = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const report = state?.report;

    if (!report) {
        return (
            <div className="flex h-full flex-col items-center justify-center gap-3 p-6">
                <p className="text-sm text-muted-foreground">No report data found.</p>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate("/reports")}
                    className="gap-1.5"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back to Reports
                </Button>
            </div>
        );
    }

    const title = extractJobTitle(report.jobDescription);
    const date = formatDate(getDateFromObjectId(report._id));

    return (
        <div className="space-y-6 bg-background p-6">
            {/* Header */}
            <div className="flex items-start gap-3">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate("/reports")}
                    className="mt-0.5 shrink-0 gap-1.5"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back
                </Button>
                <div className="min-w-0 flex-1">
                    <h1 className="truncate text-xl font-semibold tracking-tight">{title}</h1>
                    <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 shrink-0" />
                        {date}
                    </div>
                </div>
            </div>

            {/* Overview row: score + skill gaps + questions split */}
            <div className="grid grid-cols-3 gap-4">
                <Card>
                    <CardContent className="flex items-center justify-center pb-4 pt-6">
                        <ScoreGauge score={report.matchScore} />
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-4">
                        <SkillGapsChart skillGaps={report.skillGaps ?? []} />
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-4">
                        <QuestionsOverview
                            techCount={report.technicalQuestions?.length ?? 0}
                            behavCount={report.behavioralQuestions?.length ?? 0}
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Technical questions */}
            <QuestionsSection
                title="Technical Questions"
                questions={report.technicalQuestions ?? []}
                icon={Code2}
            />

            {/* Behavioral questions */}
            <QuestionsSection
                title="Behavioral Questions"
                questions={report.behavioralQuestions ?? []}
                icon={MessageSquare}
            />

            {/* Preparation plan */}
            <PrepPlanTimeline plan={report.preparationPlan ?? []} />
        </div>
    );
};

export default ReportDetail;
