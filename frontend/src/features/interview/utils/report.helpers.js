export function extractJobTitle(jd) {
    const roleMatch = jd.match(/ROLE:\s*(.+?)(?:\r?\n|$)/i);
    if (roleMatch) return roleMatch[1].trim();
    const titleMatch = jd.match(/(?:Position|Title|Job Title):\s*(.+?)(?:\r?\n|$)/i);
    if (titleMatch) return titleMatch[1].trim();
    return jd.split(/\r?\n/)[0].trim().slice(0, 70);
}

export function extractJobPreview(jd) {
    return jd
        .replace(/\r/g, "")
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.length > 0 && !l.match(/^(ROLE|LOCATION|OVERVIEW):/i))
        .slice(0, 2)
        .join(" · ");
}

export function getDateFromObjectId(id) {
    return new Date(parseInt(id.substring(0, 8), 16) * 1000);
}

export function formatDate(date) {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function getScoreConfig(score) {
    if (score >= 0.7)
        return {
            label: "Strong Match",
            stroke: "stroke-green-500",
            text: "text-green-500",
            badge: "bg-green-500/10 text-green-600 dark:text-green-400",
        };
    if (score >= 0.4)
        return {
            label: "Moderate Match",
            stroke: "stroke-amber-500",
            text: "text-amber-500",
            badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
        };
    return {
        label: "Low Match",
        stroke: "stroke-destructive",
        text: "text-destructive",
        badge: "bg-destructive/10 text-destructive",
    };
}

export const SEVERITY_STYLES = {
    high: "bg-destructive/10 text-destructive border-destructive/20",
    medium: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
    low: "bg-green-500/10 text-green-600 border-green-500/20 dark:text-green-400",
};
