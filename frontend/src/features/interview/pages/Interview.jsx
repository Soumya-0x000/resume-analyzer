import { useState } from "react";
import { Brain } from "lucide-react";

import { useAuth } from "@/context/auth/useAuth";
import Pagination from "@/components/ui/pagination";

import CardSkeleton from "../components/CardSkeleton";
import EmptyState from "../components/EmptyState";
import ReportCard from "../components/ReportCard";
import { useGetInterviewReportByUserId } from "../services/interview.queries";

const Interview = () => {
    const { user } = useAuth();
    const [pagination, setPagination] = useState({ page: 1, offset: 6 });
    const { data, isLoading } = useGetInterviewReportByUserId({
        pagination,
        options: { enabled: !!user },
    });

    const items = data?.items ?? [];
    const paginationInfo = data?.pagination;

    const handlePrev = () => setPagination((p) => ({ ...p, page: p.page - 1 }));
    const handleNext = () => setPagination((p) => ({ ...p, page: p.page + 1 }));

    return (
        <div className="bg-background p-6 space-y-6 h-full overflow-y-auto">
            {isLoading ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <CardSkeleton key={i} />
                    ))}
                </div>
            ) : items.length === 0 ? (
                <EmptyState />
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((report) => (
                        <ReportCard key={report._id} report={report} />
                    ))}
                </div>
            )}

            {paginationInfo &&
                (paginationInfo.total > pagination.offset || paginationInfo.page > 1) && (
                    <Pagination
                        page={paginationInfo.page}
                        hasNext={paginationInfo.hasNext}
                        total={paginationInfo.total}
                        offset={pagination.offset}
                        onPrev={handlePrev}
                        onNext={handleNext}
                    />
                )}
        </div>
    );
};

export default Interview;
