import { useState, useMemo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { EyeIcon, EyeSlashIcon, WarningIcon } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Link } from 'react-router';
import { useCheckUsernameOrEmail, useRegister } from './services/auth.queries';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { debounce } from '@/lib/utils';

const Register = () => {
    const { mutateAsync: registerUser, isPending: isRegisterPending } = useRegister();
    const { mutateAsync: checkAvailability } = useCheckUsernameOrEmail();

    const [isChecking, setIsChecking] = useState({ username: false, email: false });
    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);

    // Zod validation schema with password confirmation
    const validationSchema = useMemo(
        () =>
            z
                .object({
                    username: z
                        .string()
                        .min(3, 'Username must be at least 3 characters')
                        .max(20, 'Username must not exceed 20 characters')
                        .regex(
                            /^[a-zA-Z0-9_-]+$/,
                            'Username can only contain letters, numbers, underscores, and hyphens',
                        ),
                    email: z.string().refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
                        message: 'Invalid email format',
                    }),
                    password: z
                        .string()
                        .min(6, 'Password must be at least 6 characters')
                        .max(100, 'Password must not exceed 100 characters'),
                    repeatPassword: z.string(),
                })
                .refine((data) => data.password === data.repeatPassword, {
                    message: 'Passwords do not match',
                    path: ['repeatPassword'],
                }),
        [],
    );

    const {
        register,
        watch,
        setError,
        clearErrors,
        handleSubmit,
        formState: { errors, touchedFields, dirtyFields },
    } = useForm({
        resolver: zodResolver(validationSchema),
        mode: 'onChange',
        reValidateMode: 'onChange',
        defaultValues: {
            username: '',
            email: '',
            password: '',
            repeatPassword: '',
        },
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

    // 2. Watch and trigger
    const watchedUsername = watch('username');
    const watchedEmail = watch('email');

    useEffect(() => {
        // Only trigger if Zod hasn't found a basic format error yet
        if (watchedUsername && !errors.username) {
            debouncedCheck('username', watchedUsername);
        }
    }, [watchedUsername, debouncedCheck, errors.username]);

    useEffect(() => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(watchedEmail) && !errors.email) {
            debouncedCheck('email', watchedEmail);
        }
    }, [watchedEmail, debouncedCheck, errors.email]);

    // Toggle password visibility
    const togglePasswordVisibility = useCallback(() => {
        setShowPassword((prev) => !prev);
    }, []);

    // Toggle repeat password visibility
    const toggleRepeatPasswordVisibility = useCallback(() => {
        setShowRepeatPassword((prev) => !prev);
    }, []);

    // Form submission handler
    const onSubmit = useCallback(
        (data) => {
            toast.promise(registerUser(data), {
                loading: 'Registering...',
                success: (res) => {
                    return res?.data?.message || "You're registered successfully";
                },
                error: (error) => {
                    return error?.response?.data?.message || 'Registration failed';
                },
            });
        },
        [registerUser],
    );

    // Helper function to determine if error should be shown
    const shouldShowError = useCallback(
        (fieldName) => {
            return (touchedFields[fieldName] || dirtyFields[fieldName]) && errors[fieldName];
        },
        [touchedFields, dirtyFields, errors],
    );

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background to-muted/30 p-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold tracking-tight">
                        Create an account
                    </CardTitle>
                    <CardDescription>
                        Enter your details to analyse your resume through AI
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Username Field */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="username">Username</Label>
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
                                placeholder="Enter your username"
                                className={shouldShowError('username') ? 'border-destructive' : ''}
                                {...register('username')}
                            />
                            {shouldShowError('username') && (
                                <p className="text-sm text-destructive flex items-center gap-1.5">
                                    <WarningIcon size={16} weight="fill" />
                                    <span>{errors.username.message}</span>
                                </p>
                            )}
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="email">Email</Label>
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
                                placeholder="Enter your email"
                                className={shouldShowError('email') ? 'border-destructive' : ''}
                                {...register('email')}
                            />
                            {shouldShowError('email') && (
                                <p className="text-sm text-destructive flex items-center gap-1.5">
                                    <WarningIcon size={16} weight="fill" />
                                    <span>{errors.email.message}</span>
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    placeholder="Create a password"
                                    className={`pr-10 ${shouldShowError('password') ? 'border-destructive' : ''}`}
                                    {...register('password')}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? (
                                        <EyeSlashIcon size={18} className="text-muted-foreground" />
                                    ) : (
                                        <EyeIcon size={18} className="text-muted-foreground" />
                                    )}
                                </Button>
                            </div>
                            {shouldShowError('password') && (
                                <p className="text-sm text-destructive flex items-center gap-1.5">
                                    <WarningIcon size={16} weight="fill" />
                                    <span>{errors.password.message}</span>
                                </p>
                            )}
                        </div>

                        {/* Repeat Password Field */}
                        <div className="space-y-2">
                            <Label htmlFor="repeatPassword">Confirm Password</Label>
                            <div className="relative">
                                <Input
                                    id="repeatPassword"
                                    type={showRepeatPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    placeholder="Confirm your password"
                                    className={`pr-10 ${shouldShowError('repeatPassword') ? 'border-destructive' : ''}`}
                                    {...register('repeatPassword')}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={toggleRepeatPasswordVisibility}
                                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                    aria-label={
                                        showRepeatPassword
                                            ? 'Hide confirm password'
                                            : 'Show confirm password'
                                    }
                                >
                                    {showRepeatPassword ? (
                                        <EyeSlashIcon size={18} className="text-muted-foreground" />
                                    ) : (
                                        <EyeIcon size={18} className="text-muted-foreground" />
                                    )}
                                </Button>
                            </div>
                            {shouldShowError('repeatPassword') && (
                                <p className="text-sm text-destructive flex items-center gap-1.5">
                                    <WarningIcon size={16} weight="fill" />
                                    <span>{errors.repeatPassword.message}</span>
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <Button type="submit" className="w-full" disabled={isRegisterPending}>
                            {isRegisterPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                'Create account'
                            )}
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="flex justify-center">
                    <p className="text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link to="/login">
                            <Button type="button" variant="link" className="px-0 font-normal">
                                Sign in
                            </Button>
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Register;
