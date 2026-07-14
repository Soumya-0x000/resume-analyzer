export function AuthBrandLogo({ className = '' }) {
    return (
        <div className={`flex items-center gap-2.5 ${className}`}>
            <div className="w-5 h-5 border border-primary/70 flex items-center justify-center shrink-0">
                <div className="w-2.5 h-2.5 bg-primary" />
            </div>
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-foreground">
                Resume<span className="text-primary">.</span>AI
            </span>
        </div>
    );
}
