import { FileSearch } from "lucide-react";

const EmptyState = () => (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed py-24 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <FileSearch className="h-6 w-6 text-primary" />
        </div>
        <div>
            <p className="text-sm font-semibold">No reports yet</p>
            <p className="mt-1 text-xs text-muted-foreground">
                Generate your first interview report from the home page.
            </p>
        </div>
    </div>
);

export default EmptyState;
