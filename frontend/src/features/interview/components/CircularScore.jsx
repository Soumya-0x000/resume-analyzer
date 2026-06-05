import { cn } from "@/lib/utils";
import { getScoreConfig } from "./report.helpers";

const CircularScore = ({ score }) => {
    const r = 22;
    const circ = 2 * Math.PI * r;
    const cfg = getScoreConfig(score);
    const pct = Math.round(score * 100);

    return (
        <div className="relative flex shrink-0 items-center justify-center">
            <svg width="60" height="60" viewBox="0 0 60 60">
                <circle cx="30" cy="30" r={r} fill="none" className="stroke-muted" strokeWidth="4" />
                <circle
                    cx="30" cy="30" r={r}
                    fill="none"
                    className={cfg.stroke}
                    strokeWidth="4"
                    strokeDasharray={circ}
                    strokeDashoffset={circ - score * circ}
                    strokeLinecap="round"
                    transform="rotate(-90 30 30)"
                />
            </svg>
            <span className={cn("absolute text-xs font-bold tabular-nums", cfg.text)}>
                {pct}%
            </span>
        </div>
    );
};

export default CircularScore;
