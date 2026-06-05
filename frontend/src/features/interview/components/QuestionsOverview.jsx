import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Code2 } from "lucide-react";

const COLORS = ["#6366f1", "#f59e0b"];

const QuestionsOverview = ({ techCount = 0, behavCount = 0 }) => {
    const data = [
        { name: "Technical", value: techCount },
        { name: "Behavioral", value: behavCount },
    ].filter((d) => d.value > 0);

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-sm font-medium">
                <Code2 className="h-4 w-4 text-primary" />
                Questions
            </div>

            {data.length > 0 ? (
                <ResponsiveContainer width="100%" height={90}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={28}
                            outerRadius={44}
                            dataKey="value"
                            strokeWidth={0}
                        >
                            {data.map((_, i) => (
                                <Cell key={i} fill={COLORS[i % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                borderRadius: 0,
                                fontSize: 11,
                                border: "1px solid #e2e8f0",
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            ) : (
                <div className="flex h-[90px] items-center justify-center text-xs text-muted-foreground">
                    No questions yet
                </div>
            )}

            <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                        <div
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: COLORS[0] }}
                        />
                        <span className="text-muted-foreground">Technical</span>
                    </div>
                    <span className="font-semibold">{techCount}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                        <div
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: COLORS[1] }}
                        />
                        <span className="text-muted-foreground">Behavioral</span>
                    </div>
                    <span className="font-semibold">{behavCount}</span>
                </div>
            </div>
        </div>
    );
};

export default QuestionsOverview;
