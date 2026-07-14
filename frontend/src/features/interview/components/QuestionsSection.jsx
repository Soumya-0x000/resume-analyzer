import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const getQuestionText = (q) =>
    typeof q === "string" ? q : (q.question ?? JSON.stringify(q));

const getAnswerText = (q) =>
    typeof q === "object"
        ? (q.answer ?? q.expectedAnswer ?? q.tips ?? null)
        : null;

const getDifficulty = (q) =>
    typeof q === "object" ? (q.difficulty ?? null) : null;

const DIFF_STYLES = {
    easy: "bg-green-500/10 text-green-600 dark:text-green-400",
    medium: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    hard: "bg-destructive/10 text-destructive",
};

const QuestionItem = ({ q, index }) => {
    const [open, setOpen] = useState(false);
    const text = getQuestionText(q);
    const answer = getAnswerText(q);
    const diff = getDifficulty(q);

    return (
        <div className="border-b last:border-b-0">
            <button
                type="button"
                className="flex w-full items-start gap-3 py-3 text-left"
                onClick={() => setOpen((o) => !o)}
            >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center bg-muted text-[10px] font-semibold text-muted-foreground">
                    {index + 1}
                </span>
                <span className="flex-1 text-xs leading-relaxed">{text}</span>
                <div className="flex shrink-0 items-center gap-2">
                    {diff && (
                        <span
                            className={cn(
                                "rounded-full px-2 py-0.5 text-[10px] font-medium capitalize",
                                DIFF_STYLES[diff] ?? DIFF_STYLES.medium,
                            )}
                        >
                            {diff}
                        </span>
                    )}
                    {open ? (
                        <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
                    ) : (
                        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                </div>
            </button>
            {open && answer && (
                <div className="pb-3 pl-8 pr-2">
                    <div className="border-l-2 border-primary/40 bg-primary/5 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
                        {answer}
                    </div>
                </div>
            )}
        </div>
    );
};

const QuestionsSection = ({ title, questions = [], icon: Icon }) => {
    if (!questions.length) return null;

    return (
        <Card>
            <CardHeader className="border-b py-3">
                <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-primary" />
                    <CardTitle className="text-sm">{title}</CardTitle>
                    <span className="ml-auto text-xs text-muted-foreground">
                        {questions.length} questions
                    </span>
                </div>
            </CardHeader>
            <CardContent className="divide-y p-0 px-4">
                {questions.map((q, i) => (
                    <QuestionItem key={i} q={q} index={i} />
                ))}
            </CardContent>
        </Card>
    );
};

export default QuestionsSection;
