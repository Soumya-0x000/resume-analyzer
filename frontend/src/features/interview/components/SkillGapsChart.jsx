import { BarChart, Bar, XAxis, YAxis, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { AlertTriangle } from "lucide-react";
import SeverityBadge from "./SeverityBadge";

const FILL = { high: "#ef4444", medium: "#f59e0b", low: "#22c55e" };

const chartData = (skillGaps) => {
    const counts = skillGaps.reduce(
        (acc, { severity }) => ({ ...acc, [severity]: (acc[severity] || 0) + 1 }),
        { high: 0, medium: 0, low: 0 },
    );
    return [
        { name: "High", count: counts.high, fill: FILL.high },
        { name: "Med", count: counts.medium, fill: FILL.medium },
        { name: "Low", count: counts.low, fill: FILL.low },
    ];
};

const SkillGapsChart = ({ skillGaps = [] }) => {
    const data = chartData(skillGaps);

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-sm font-medium">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Skill Gaps
                <span className="ml-1 text-xs font-normal text-muted-foreground">
                    ({skillGaps.length})
                </span>
            </div>

            <ResponsiveContainer width="100%" height={90}>
                <BarChart data={data} barSize={28} margin={{ top: 4, bottom: 0, left: -20, right: 0 }}>
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10 }}
                    />
                    <YAxis hide allowDecimals={false} />
                    <Tooltip
                        cursor={{ fill: "transparent" }}
                        contentStyle={{ borderRadius: 0, fontSize: 11, border: "1px solid #e2e8f0" }}
                        formatter={(val) => [val, "gaps"]}
                    />
                    <Bar dataKey="count" radius={[2, 2, 0, 0]}>
                        {data.map((entry, i) => (
                            <Cell key={i} fill={entry.fill} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>

            {skillGaps.length > 0 && (
                <div className="max-h-40 space-y-1 overflow-y-auto">
                    {skillGaps.map((sg, i) => (
                        <div
                            key={i}
                            className="flex items-center justify-between gap-2 border bg-muted/30 px-3 py-1.5"
                        >
                            <span className="text-xs">{sg.gap}</span>
                            <SeverityBadge severity={sg.severity} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SkillGapsChart;
