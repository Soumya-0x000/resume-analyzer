import { cn } from "@/lib/utils";
import { SEVERITY_STYLES } from "../utils/report.helpers";

const SeverityBadge = ({ severity }) => (
    <span
        className={cn(
            "inline-flex items-center rounded-full border px-1.5 py-px text-[9px] font-bold uppercase tracking-wide",
            SEVERITY_STYLES[severity] ?? SEVERITY_STYLES.medium,
        )}
    >
        {severity}
    </span>
);

export default SeverityBadge;
