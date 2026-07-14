import { EyeSlashIcon, EyeIcon, WarningIcon } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const LABEL_CLS = 'text-[10px] uppercase tracking-[0.15em] text-muted-foreground';

export function FieldError({ message }) {
    return (
        <p className="text-[11px] text-destructive flex items-center gap-1.5">
            <WarningIcon size={11} weight="fill" />
            {message}
        </p>
    );
}

export function PasswordInput({ id, show, onToggle, hasError, ...props }) {
    return (
        <div className="relative">
            <Input
                id={id}
                type={show ? 'text' : 'password'}
                placeholder="••••••••"
                className={`pr-10 rounded-none${hasError ? ' border-destructive' : ''}`}
                {...props}
            />
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onToggle}
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent rounded-none"
                aria-label={show ? 'Hide password' : 'Show password'}
            >
                {show
                    ? <EyeSlashIcon size={15} className="text-muted-foreground" />
                    : <EyeIcon     size={15} className="text-muted-foreground" />}
            </Button>
        </div>
    );
}
