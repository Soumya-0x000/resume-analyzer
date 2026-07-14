import { useState, useCallback, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useRegister, useCheckUsernameOrEmail } from '../services/auth.queries';
import { toast } from 'sonner';
import { debounce } from '@/lib/utils';
import { FieldError, PasswordInput, LABEL_CLS } from './AuthField';

const registerSchema = z
    .object({
        username: z
            .string()
            .min(3, 'Username must be at least 3 characters')
            .max(20, 'Username must not exceed 20 characters')
            .regex(/^[a-zA-Z0-9_-]+$/, 'Letters, numbers, underscores and hyphens only'),
        email: z.string().refine((v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), {
            message: 'Invalid email format',
        }),
        password: z
            .string()
            .min(6, 'Password must be at least 6 characters')
            .max(100, 'Password must not exceed 100 characters'),
        repeatPassword: z.string(),
    })
    .refine((d) => d.password === d.repeatPassword, {
        message: 'Passwords do not match',
        path: ['repeatPassword'],
    });

export function RegisterForm({ onSwitch }) {
    const { mutateAsync: registerUser, isPending } = useRegister();
    const { mutateAsync: checkAvailability }       = useCheckUsernameOrEmail();
    const [showPw, setShowPw]                      = useState(false);
    const [showRepeatPw, setShowRepeatPw]           = useState(false);
    const [isChecking, setIsChecking]              = useState({ username: false, email: false });

    const {
        register,
        watch,
        setError,
        clearErrors,
        handleSubmit,
        formState: { errors, touchedFields, dirtyFields },
    } = useForm({
        resolver: zodResolver(registerSchema),
        mode: 'onChange',
        reValidateMode: 'onChange',
        defaultValues: { username: '', email: '', password: '', repeatPassword: '' },
    });

    const debouncedCheck = useMemo(
        () =>
            debounce(async (field, value) => {
                if (!value || value.length < 3) return;
                setIsChecking((prev) => ({ ...prev, [field]: true }));
                try {
                    await checkAvailability({ [field]: value });
                    clearErrors(field);
                } catch (err) {
                    setError(field, {
                        type: 'manual',
                        message: err?.response?.data?.message || `${field} is taken`,
                    });
                } finally {
                    setIsChecking((prev) => ({ ...prev, [field]: false }));
                }
            }, 500),
        [checkAvailability, clearErrors, setError],
    );

    const watchedUsername = watch('username');
    const watchedEmail    = watch('email');

    useEffect(() => {
        if (watchedUsername && !errors.username) debouncedCheck('username', watchedUsername);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [watchedUsername]);

    useEffect(() => {
        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(watchedEmail) && !errors.email)
            debouncedCheck('email', watchedEmail);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [watchedEmail]);

    const onSubmit = useCallback(
        (data) => {
            toast.promise(registerUser(data), {
                loading: 'Registering...',
                success: (res) => res?.data?.message || "You're registered successfully",
                error: (err) => err?.response?.data?.message || 'Registration failed',
            });
        },
        [registerUser],
    );

    const showErr = (field) => (touchedFields[field] || dirtyFields[field]) && errors[field];

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground leading-tight">
                    Create account<span className="text-primary login-blink ml-0.5">_</span>
                </h1>
                <p className="text-xs text-muted-foreground tracking-wide">
                    Start your AI-powered career analysis
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="username" className={LABEL_CLS}>Username</Label>
                        {isChecking.username && (
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                <Loader2 size={10} className="animate-spin" /> Checking...
                            </span>
                        )}
                    </div>
                    <Input
                        id="username"
                        type="text"
                        autoComplete="username"
                        placeholder="your_username"
                        className={`rounded-none${showErr('username') ? ' border-destructive' : ''}`}
                        {...register('username')}
                    />
                    {showErr('username') && <FieldError message={errors.username.message} />}
                </div>

                <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="email" className={LABEL_CLS}>Email</Label>
                        {isChecking.email && (
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                <Loader2 size={10} className="animate-spin" /> Checking...
                            </span>
                        )}
                    </div>
                    <Input
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        className={`rounded-none${showErr('email') ? ' border-destructive' : ''}`}
                        {...register('email')}
                    />
                    {showErr('email') && <FieldError message={errors.email.message} />}
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="reg-password" className={LABEL_CLS}>Password</Label>
                    <PasswordInput
                        id="reg-password"
                        autoComplete="new-password"
                        show={showPw}
                        onToggle={() => setShowPw((p) => !p)}
                        hasError={!!showErr('password')}
                        {...register('password')}
                    />
                    {showErr('password') && <FieldError message={errors.password.message} />}
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="repeatPassword" className={LABEL_CLS}>Confirm Password</Label>
                    <PasswordInput
                        id="repeatPassword"
                        autoComplete="new-password"
                        show={showRepeatPw}
                        onToggle={() => setShowRepeatPw((p) => !p)}
                        hasError={!!showErr('repeatPassword')}
                        {...register('repeatPassword')}
                    />
                    {showErr('repeatPassword') && <FieldError message={errors.repeatPassword.message} />}
                </div>

                <Button type="submit" className="w-full rounded-none" disabled={isPending}>
                    {isPending ? (
                        <span className="flex items-center gap-2">
                            <Loader2 className="animate-spin" size={14} />
                            Creating account...
                        </span>
                    ) : 'Create account →'}
                </Button>
            </form>

            <div className="pt-4 border-t border-border">
                <p className="text-[11px] text-muted-foreground">
                    Already have an account?{' '}
                    <button
                        onClick={onSwitch}
                        className="text-primary hover:underline text-[11px] font-normal cursor-pointer bg-transparent border-0 p-0"
                    >
                        Sign in →
                    </button>
                </p>
            </div>
        </div>
    );
}
