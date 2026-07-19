import { FileText, FileUp, AlertCircle, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatFileSize } from "../utils/home.helpers";

const ResumeUploadCard = ({
    uploadedFile,
    dragActive,
    errors,
    fileInputRef,
    handleDrag,
    handleDrop,
    applyFile,
    removeFile,
}) => (
    <Card className="col-start-2 row-start-1">
        <CardHeader className="border-b">
            <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <FileText className="h-3.5 w-3.5 text-primary" />
                </div>
                <div>
                    <CardTitle>Resume</CardTitle>
                    <CardDescription>PDF format · max 10 MB</CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent className="pt-4">
            {uploadedFile ? (
                <div className="flex items-center gap-3 rounded-none border border-primary/25 bg-primary/5 p-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-none bg-primary/10">
                        <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium">{uploadedFile.name}</p>
                        <p className="text-xs text-muted-foreground">
                            {formatFileSize(uploadedFile.size)}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={removeFile}
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    >
                        <X className="h-3.5 w-3.5" />
                    </button>
                </div>
            ) : (
                <div
                    role="button"
                    tabIndex={0}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
                    className={cn(
                        "flex cursor-pointer items-center gap-3 rounded-none border-2 border-dashed px-4 py-3 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                        dragActive
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/40 hover:bg-accent/30",
                    )}
                >
                    <div
                        className={cn(
                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors",
                            dragActive ? "bg-primary/15" : "bg-muted",
                        )}
                    >
                        <FileUp
                            className={cn(
                                "h-4 w-4 transition-colors",
                                dragActive ? "text-primary" : "text-muted-foreground",
                            )}
                        />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium">
                            {dragActive ? "Drop your PDF here" : "Drag & drop your resume"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            PDF · max 10 MB · or click to browse
                        </p>
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        onChange={(e) => applyFile(e.target.files?.[0])}
                    />
                </div>
            )}
            {errors.resumeFile && (
                <p className="mt-2 flex items-center gap-1 text-xs text-destructive">
                    <AlertCircle className="h-3 w-3" />
                    {errors.resumeFile.message}
                </p>
            )}
        </CardContent>
    </Card>
);

export default ResumeUploadCard;
