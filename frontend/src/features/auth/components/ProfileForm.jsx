import { useCallback, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Camera, Loader2, X } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/auth/useAuth';
import { fileToDataUrl, getInitials } from '@/lib/utils';
import { useUpdateMe } from '../services/auth.queries';
import { FieldError, LABEL_CLS } from './AuthField';

const MAX_AVATAR_BYTES = 1.5 * 1024 * 1024;

const profileSchema = z.object({
    username: z
        .string()
        .min(3, 'Username must be at least 3 characters')
        .max(20, 'Username must not exceed 20 characters')
        .regex(/^[a-zA-Z0-9_-]+$/, 'Letters, numbers, underscores and hyphens only'),
    email: z.string().refine((v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), {
        message: 'Invalid email format',
    }),
});

export function ProfileForm() {
    const { user } = useAuth();
    const { mutateAsync: updateMe, isPending } = useUpdateMe();
    const fileInputRef = useRef(null);
    const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');
    const [avatarDirty, setAvatarDirty] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, touchedFields, dirtyFields },
    } = useForm({
        resolver: zodResolver(profileSchema),
        mode: 'onChange',
        reValidateMode: 'onChange',
        defaultValues: { username: user?.username || '', email: user?.email || '' },
    });

    const handleAvatarChange = useCallback(async (file) => {
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }
        if (file.size > MAX_AVATAR_BYTES) {
            toast.error('Image must be smaller than 1.5 MB');
            return;
        }
        const dataUrl = await fileToDataUrl(file);
        setAvatarPreview(dataUrl);
        setAvatarDirty(true);
    }, []);

    const removeAvatar = useCallback(() => {
        setAvatarPreview('');
        setAvatarDirty(true);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }, []);

    const onSubmit = useCallback(
        (data) => {
            const payload = { ...data };
            if (avatarDirty) payload.avatar = avatarPreview;
            toast.promise(updateMe(payload), {
                loading: 'Saving changes...',
                success: (res) => {
                    setAvatarDirty(false);
                    return res?.data?.message || 'Profile updated';
                },
                error: (err) => err?.response?.data?.message || 'Failed to update profile',
            });
        },
        [avatarDirty, avatarPreview, updateMe],
    );

    const showErr = (field) => (touchedFields[field] || dirtyFields[field]) && errors[field];

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex items-center gap-4">
                <div className="relative">
                    <Avatar className="h-16 w-16 rounded-none">
                        <AvatarImage src={avatarPreview} alt={user?.username} />
                        <AvatarFallback className="rounded-none text-base">
                            {getInitials(user?.username)}
                        </AvatarFallback>
                    </Avatar>
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
                        aria-label="Change avatar"
                    >
                        <Camera className="h-3 w-3" />
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleAvatarChange(e.target.files?.[0])}
                    />
                </div>
                <div className="space-y-1.5">
                    <p className="text-xs font-medium">Profile photo</p>
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-7 rounded-none text-xs"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            Upload
                        </Button>
                        {avatarPreview && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-7 rounded-none text-xs text-destructive hover:text-destructive"
                                onClick={removeAvatar}
                            >
                                <X className="h-3 w-3" />
                                Remove
                            </Button>
                        )}
                    </div>
                    <p className="text-[11px] text-muted-foreground">JPG or PNG · max 1.5 MB</p>
                </div>
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="username" className={LABEL_CLS}>Username</Label>
                <Input
                    id="username"
                    autoComplete="username"
                    className={`rounded-none${showErr('username') ? ' border-destructive' : ''}`}
                    {...register('username')}
                />
                {showErr('username') && <FieldError message={errors.username.message} />}
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="email" className={LABEL_CLS}>Email</Label>
                <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    className={`rounded-none${showErr('email') ? ' border-destructive' : ''}`}
                    {...register('email')}
                />
                {showErr('email') && <FieldError message={errors.email.message} />}
            </div>

            <Button type="submit" className="rounded-none" disabled={isPending}>
                {isPending ? (
                    <span className="flex items-center gap-2">
                        <Loader2 className="animate-spin" size={14} />
                        Saving...
                    </span>
                ) : (
                    'Save changes'
                )}
            </Button>
        </form>
    );
}
