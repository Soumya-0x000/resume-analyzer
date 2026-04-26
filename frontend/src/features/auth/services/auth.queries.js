import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { login, register, logout, getMe, updateMe } from './auth.api';

const authKey = ['auth', 'me'];

export function useMe() {
    return useQuery({
        queryKey: authKey,
        queryFn: async () => {
            const res = await getMe();
            return res.data;
        },
        retry: false,
        staleTime: 1000 * 60 * 10,
    });
}

export function useUpdateMe() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateMe,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: authKey });
        },
    });
}

export function useLogin() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: login,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: authKey });
        },
    });
}

export function useRegister() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: register,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: authKey });
        },
    });
}

export function useLogout() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: logout,
        onSuccess: () => {
            queryClient.setQueryData(authKey, null);
            queryClient.removeQueries({ queryKey: authKey });
        },
    });
}
