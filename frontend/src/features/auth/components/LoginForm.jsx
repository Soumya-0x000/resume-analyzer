import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useLogin, useRecoverPassword } from "../services/auth.queries";
import { toast } from "sonner";
import { FieldError, PasswordInput, LABEL_CLS } from "./AuthField";

const loginSchema = z.object({
    identifier: z.string().min(3, "Enter your username or email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export function LoginForm({ onSwitch }) {
    const { mutateAsync: loginUser, isPending } = useLogin();
    const { mutateAsync: recoverPswd, isLoading: isRecovering } = useRecoverPassword();
    const [showPw, setShowPw] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, touchedFields, dirtyFields },
    } = useForm({
        resolver: zodResolver(loginSchema),
        mode: "onChange",
        reValidateMode: "onChange",
        defaultValues: { identifier: "", password: "" },
    });

    const onSubmit = useCallback(
        (data) => {
            toast.promise(loginUser(data), {
                loading: "Signing in...",
                success: (res) => res?.data?.message || "Successfully logged in!",
                error: (err) => err.response?.data?.message || "Failed to login. Please try again.",
            });
        },
        [loginUser],
    );

    const showIdErr = (touchedFields.identifier || dirtyFields.identifier) && errors.identifier;
    const showPwErr = (touchedFields.password || dirtyFields.password) && errors.password;

    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground leading-tight">
                    Welcome back<span className="text-primary login-blink ml-0.5">_</span>
                </h1>
                <p className="text-xs text-muted-foreground tracking-wide">
                    Sign in to continue your career analysis
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-1.5">
                    <Label htmlFor="identifier" className={LABEL_CLS}>
                        Username or Email
                    </Label>
                    <Input
                        id="identifier"
                        type="text"
                        autoComplete="username"
                        placeholder="you@example.com"
                        className={`rounded-none${showIdErr ? " border-destructive" : ""}`}
                        {...register("identifier")}
                    />
                    {showIdErr && <FieldError message={errors.identifier.message} />}
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="login-password" className={LABEL_CLS}>
                        Password
                    </Label>
                    <PasswordInput
                        id="login-password"
                        autoComplete="current-password"
                        show={showPw}
                        onToggle={() => setShowPw((p) => !p)}
                        hasError={!!showPwErr}
                        {...register("password")}
                    />
                    {showPwErr && <FieldError message={errors.password.message} />}
                </div>

                <div className="flex justify-end">
                    <Button
                        type="button"
                        variant="link"
                        onClick={() => {
                            const identifier = prompt(
                                "Please enter your username or email for password recovery:",
                            );
                            if (identifier) {
                                recoverPswd({ email: identifier })
                                    .then((res) => {
                                        toast.success(
                                            res?.data?.message || "Password recovery email sent!",
                                        );
                                    })
                                    .catch((err) => {
                                        toast.error(
                                            err.response?.data?.message ||
                                                "Failed to send recovery email. Please try again.",
                                        );
                                    });
                            }
                        }}
                        className="px-0 text-[11px] text-muted-foreground hover:text-primary h-auto font-normal"
                    >
                        Forgot password?
                    </Button>
                </div>

                <Button type="submit" className="w-full rounded-none" disabled={isPending}>
                    {isPending ? (
                        <span className="flex items-center gap-2">
                            <Loader2 className="animate-spin" size={14} />
                            Authenticating...
                        </span>
                    ) : (
                        "Sign in →"
                    )}
                </Button>
            </form>

            <div className="pt-4 border-t border-border">
                <p className="text-[11px] text-muted-foreground">
                    No account yet?{" "}
                    <button
                        onClick={onSwitch}
                        className="text-primary hover:underline text-[11px] font-normal cursor-pointer bg-transparent border-0 p-0"
                    >
                        Create one →
                    </button>
                </p>
            </div>
        </div>
    );
}
