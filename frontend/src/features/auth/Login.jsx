import { useState, useMemo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { EyeSlashIcon, WarningIcon } from '@phosphor-icons/react';
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { memo } from 'react';
import { EyeIcon } from 'lucide-react';
import { Link } from 'react-router';
import { useLogin } from './services/auth.queries';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const Login = memo(() => {
    const { mutateAsync: loginUser, isPending: isLoginPending } = useLogin();

    const [authMode, setAuthMode] = useState('username'); // 'username' or 'email'
    const [showPassword, setShowPassword] = useState(false);

    // Dynamic zod schema based on auth mode
    const validationSchema = useMemo(() => {
        const baseSchema = {
            password: z.string().min(6, 'Password must be at least 6 characters'),
        };

        if (authMode === 'username') {
            return z.object({
                ...baseSchema,
                username: z.string().min(3, 'Username must be at least 3 characters'),
            });
        } else {
            return z.object({
                ...baseSchema,
                email: z.string().email('Invalid email format'),
            });
        }
    }, [authMode]);

    const {
        register,
        handleSubmit,
        formState: { errors, touchedFields, dirtyFields },
        getValues,
        setValue,
    } = useForm({
        resolver: zodResolver(validationSchema),
        mode: 'onChange',
        reValidateMode: 'onChange',
        defaultValues: {
            username: '',
            email: '',
            password: '',
        },
    });

    // Handle auth mode toggle with value preservation
    const handleModeToggle = useCallback(
        (newMode) => {
            if (newMode === authMode) return;

            const currentIdentifier =
                authMode === 'username' ? getValues('username') : getValues('email');

            setAuthMode(newMode);

            // Preserve the input value in the new field
            if (newMode === 'email') {
                setValue('email', currentIdentifier, { shouldValidate: false });
            } else {
                setValue('username', currentIdentifier, { shouldValidate: false });
            }
        },
        [authMode, getValues, setValue],
    );

    // Toggle password visibility
    const togglePasswordVisibility = useCallback(() => {
        setShowPassword((prev) => !prev);
    }, []);

    // Form submission handler
    const onSubmit = useCallback(
        async (data) => {
            toast.promise(loginUser(data), {
                loading: 'Signing in...',
                success: (res) => {
                    return res?.data?.message || 'Successfully logged in!';
                },
                error: (error) => {
                    return error.response?.data?.message || 'Failed to login. Please try again.';
                },
            });
        },
        [loginUser],
    );

    // Determine which field to show and its error
    const identifierField = authMode === 'username' ? 'username' : 'email';
    const identifierError = errors[identifierField];
    const showIdentifierError =
        (touchedFields[identifierField] || dirtyFields[identifierField]) && identifierError;
    const showPasswordError = (touchedFields.password || dirtyFields.password) && errors.password;

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background to-muted/30 p-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold tracking-tight">
                        Welcome back
                    </CardTitle>
                    <CardDescription>Enter your credentials to sign in</CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Auth Mode Tabs */}
                    <Tabs value={authMode} onValueChange={handleModeToggle} className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="username" className="text-[0.8rem]">
                                Username
                            </TabsTrigger>
                            <TabsTrigger value="email" className="text-[0.8rem]">
                                Email
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Identifier Field (Username or Email) */}
                        <div className="space-y-2">
                            <Label htmlFor={identifierField}>
                                {authMode === 'username' ? 'Username' : 'Email'}
                            </Label>
                            <Input
                                id={identifierField}
                                type={authMode === 'email' ? 'email' : 'text'}
                                autoComplete={authMode === 'email' ? 'email' : 'username'}
                                placeholder={
                                    authMode === 'username'
                                        ? 'Enter your username'
                                        : 'Enter your email'
                                }
                                className={showIdentifierError ? 'border-destructive' : ''}
                                {...register(identifierField)}
                            />
                            {showIdentifierError && (
                                <p className="text-sm text-destructive flex items-center gap-1.5">
                                    <WarningIcon size={16} weight="fill" />
                                    <span>{identifierError.message}</span>
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
                                    autoComplete="current-password"
                                    placeholder="Enter your password"
                                    className={`pr-10 ${
                                        showPasswordError ? 'border-destructive' : ''
                                    }`}
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
                                        <EyeIcon size={18} className="text-muted-foreground" />
                                    ) : (
                                        <EyeSlashIcon size={18} className="text-muted-foreground" />
                                    )}
                                </Button>
                            </div>
                            {showPasswordError && (
                                <p className="text-sm text-destructive flex items-center gap-1.5">
                                    <WarningIcon size={16} weight="fill" />
                                    <span>{errors.password.message}</span>
                                </p>
                            )}
                        </div>

                        {/* Forgot Password Link */}
                        <div className="flex justify-end">
                            <Button
                                type="button"
                                variant="link"
                                className="px-0 text-sm font-normal"
                            >
                                Forgot password?
                            </Button>
                        </div>

                        {/* Submit Button */}
                        <Button type="submit" className="w-full" disabled={isLoginPending}>
                            {isLoginPending ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="animate-spin" size={18} />
                                    Signing in...
                                </span>
                            ) : (
                                'Sign in'
                            )}
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="flex justify-center">
                    <p className="text-sm text-muted-foreground">
                        Don&apos;t have an account?{' '}
                        <Link to="/register">
                            <Button type="button" variant="link" className="px-0 font-normal">
                                Sign up
                            </Button>
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
});

export default Login;
