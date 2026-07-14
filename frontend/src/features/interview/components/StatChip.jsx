const StatChip = ({ icon: IconComp, value, label }) => (
    <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <IconComp className="h-3.5 w-3.5 shrink-0 text-primary/70" />
        <span className="font-semibold tabular-nums text-foreground">{value}</span>
        <span>{label}</span>
    </div>
);

export default StatChip;
