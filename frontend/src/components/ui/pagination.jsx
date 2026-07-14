import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Pagination = ({ page, hasNext, total, offset, onPrev, onNext, className }) => {
    const totalPages = offset > 0 ? Math.ceil(total / offset) : 1;

    return (
        <div className={cn("flex items-center justify-between", className)}>
            <p className="text-xs text-muted-foreground">
                Page{" "}
                <span className="font-medium text-foreground">{page}</span>
                {" "}of{" "}
                <span className="font-medium text-foreground">{totalPages}</span>
                <span className="ml-1.5">
                    &mdash; {total} report{total !== 1 ? "s" : ""} total
                </span>
            </p>
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onPrev}
                    disabled={page <= 1}
                    className="gap-1.5"
                >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onNext}
                    disabled={!hasNext}
                    className="gap-1.5"
                >
                    Next
                    <ChevronRight className="h-3.5 w-3.5" />
                </Button>
            </div>
        </div>
    );
};

export default Pagination;
