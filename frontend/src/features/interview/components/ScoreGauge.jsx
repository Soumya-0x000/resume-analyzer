import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";
import { getScoreConfig } from "./report.helpers";

const SCORE_HEX = { high: "#22c55e", medium: "#f59e0b", low: "#ef4444" };

const ScoreGauge = ({ score }) => {
    const pct = Math.round((score ?? 0) * 100);
    const cfg = getScoreConfig(score ?? 0);
    const fill =
        score >= 0.7 ? SCORE_HEX.high : score >= 0.4 ? SCORE_HEX.medium : SCORE_HEX.low;

    const data = [
        { value: pct, fill },
        { value: 100 - pct, fill: "#e2e8f0" },
    ];

    return (
        <div className="flex flex-col items-center gap-3">
            <div className="relative h-44 w-44">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="56%"
                            startAngle={210}
                            endAngle={-30}
                            innerRadius="72%"
                            outerRadius="88%"
                            dataKey="value"
                            strokeWidth={0}
                        >
                            {data.map((entry, i) => (
                                <Cell key={i} fill={entry.fill} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={cn("text-5xl font-bold tabular-nums", cfg.text)}>
                        {pct}
                    </span>
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                        Match %
                    </span>
                </div>
            </div>
            <span className={cn("rounded-full px-3 py-1 text-xs font-medium", cfg.badge)}>
                {cfg.label}
            </span>
        </div>
    );
};

export default ScoreGauge;
