import { ResumeIllustration } from './ResumeIllustration';

export function AuthPageShell({ mode, children }) {
    return (
        <div className="min-h-screen flex bg-background">
            <div className="hidden lg:flex flex-col flex-1 relative overflow-hidden border-r border-border">
                <ResumeIllustration mode={mode} />
            </div>
            <div className="flex-1 lg:max-w-[440px] flex flex-col justify-center px-8 md:px-14 py-12 overflow-hidden">
                <div className="auth-enter-right">{children}</div>
            </div>
        </div>
    );
}
