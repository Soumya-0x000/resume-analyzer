import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useUpdateMe } from '../services/auth.queries';
import { FieldError, PasswordInput, LABEL_CLS } from './AuthField';

const passwordSchema = z
    .object({
        currentPassword: z.string().min(1, 'Current password is required'),
        newPassword: z
            .string()
            .min(6, 'Password must be at least 6 characters')
            .max(100, 'Password must not exceed 100 characters'),
        confirmPassword: z.string(),
    })
    .refine((d) => d.newPassword === d.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

export function PasswordForm() {
    const { mutateAsync: updateMe, isPending } = useUpdateMe();
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, touchedFields, dirtyFields },
    } = useForm({
        resolver: zodResolver(passwordSchema),
        mode: 'onChange',
        reValidateMode: 'onChange',
        defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
    });

    const onSubmit = useCallback(
        (data) => {
            toast.promise(
                updateMe({
                    currentPassword: data.currentPassword,
                    newPassword: data.newPassword,
                }),
                {
                    loading: 'Updating password...',
                    success: (res) => {
                        reset();
                        return res?.data?.message || 'Password updated';
                    },
                    error: (err) => err?.response?.data?.message || 'Failed to update password',
                },
            );
        },
        [reset, updateMe],
    );

    const showErr = (field) => (touchedFields[field] || dirtyFields[field]) && errors[field];

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm space-y-4">
            <div className="space-y-1.5">
                <Label htmlFor="currentPassword" className={LABEL_CLS}>Current password</Label>
                <PasswordInput
                    id="currentPassword"
                    autoComplete="current-password"
                    show={showCurrent}
                    onToggle={() => setShowCurrent((p) => !p)}
                    hasError={!!showErr('currentPassword')}
                    {...register('currentPassword')}
                />
                {showErr('currentPassword') && <FieldError message={errors.currentPassword.message} />}
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="newPassword" className={LABEL_CLS}>New password</Label>
                <PasswordInput
                    id="newPassword"
                    autoComplete="new-password"
                    show={showNew}
                    onToggle={() => setShowNew((p) => !p)}
                    hasError={!!showErr('newPassword')}
                    {...register('newPassword')}
                />
                {showErr('newPassword') && <FieldError message={errors.newPassword.message} />}
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className={LABEL_CLS}>Confirm new password</Label>
                <PasswordInput
                    id="confirmPassword"
                    autoComplete="new-password"
                    show={showConfirm}
                    onToggle={() => setShowConfirm((p) => !p)}
                    hasError={!!showErr('confirmPassword')}
                    {...register('confirmPassword')}
                />
                {showErr('confirmPassword') && <FieldError message={errors.confirmPassword.message} />}
            </div>

            <Button type="submit" className="rounded-none" disabled={isPending}>
                {isPending ? (
                    <span className="flex items-center gap-2">
                        <Loader2 className="animate-spin" size={14} />
                        Updating...
                    </span>
                ) : (
                    'Update password'
                )}
            </Button>
        </form>
    );
}
