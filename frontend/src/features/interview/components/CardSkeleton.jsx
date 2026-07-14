import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const CardSkeleton = () => (
    <Card className="animate-pulse">
        <CardHeader className="border-b">
            <div className="flex items-start gap-4">
                <div className="h-[60px] w-[60px] shrink-0 rounded-full bg-muted" />
                <div className="flex-1 space-y-2 pt-1">
                    <div className="h-4 w-3/4 rounded bg-muted" />
                    <div className="h-3 w-1/3 rounded bg-muted" />
                    <div className="h-3 w-1/4 rounded bg-muted" />
                </div>
            </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
            <div className="space-y-1.5">
                <div className="h-3 w-full rounded bg-muted" />
                <div className="h-3 w-5/6 rounded bg-muted" />
            </div>
            <div className="flex gap-2">
                <div className="h-6 w-28 rounded-full bg-muted" />
                <div className="h-6 w-24 rounded-full bg-muted" />
            </div>
            <Separator />
            <div className="flex justify-between">
                <div className="flex gap-3">
                    <div className="h-4 w-14 rounded bg-muted" />
                    <div className="h-4 w-18 rounded bg-muted" />
                </div>
                <div className="h-6 w-14 rounded bg-muted" />
            </div>
        </CardContent>
    </Card>
);

export default CardSkeleton;
