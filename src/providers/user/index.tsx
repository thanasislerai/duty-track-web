"use client";
import { AxiosError, JWT_TOKEN_LOCAL_STORAGE_KEY } from "@/network/axios";
import { fetcher } from "@/network/fetcher";
import { mutator } from "@/network/mutator";
import { routes } from "@/routes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
    createContext,
    ReactNode,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

const userProfileQueryKey = ["user/profile"];

export interface LoginFormFields {
    userName: string;
    password: string;
}

interface User {
    id: number;
    userName: string;
    isAdmin: boolean;
}

interface UserLoginResponse {
    token: string;
}

interface UserContextValue {
    user: User | undefined;
    isLoading: boolean;
    login: (data: LoginFormFields) => void;
    logout: () => void;
    error: AxiosError | null;
}

interface UserProviderProps {
    children: ReactNode;
}

export const UserContext = createContext<UserContextValue>(null!);

export const UserProvider = ({ children }: UserProviderProps) => {
    const { push } = useRouter();
    const [user, setUser] = useState<User>();
    const [token, setToken] = useState<string | null>(
        localStorage.getItem(JWT_TOKEN_LOCAL_STORAGE_KEY),
    );
    const queryClient = useQueryClient();
    const {
        mutate: login,
        isPending: isLoginLoading,
        error: loginError,
    } = useMutation<UserLoginResponse, AxiosError, LoginFormFields>({
        mutationFn: (data) =>
            mutator({ url: "user/login", method: "post", data }),
        onSuccess: ({ token }) => {
            setToken(token);
            localStorage.setItem(JWT_TOKEN_LOCAL_STORAGE_KEY, token);
            queryClient.invalidateQueries({ queryKey: userProfileQueryKey });
        },
    });
    const {
        data: userProfile,
        isLoading: isProfileLoading,
        error: userProfileError,
    } = useQuery<User, AxiosError>({
        queryKey: userProfileQueryKey,
        queryFn: () =>
            fetcher({
                queryKey: userProfileQueryKey,
            }),
        enabled: typeof token === "string",
        retry: false,
    });

    const logout = useCallback(() => {
        setUser(undefined);
        setToken(null);
        localStorage.removeItem(JWT_TOKEN_LOCAL_STORAGE_KEY);
        queryClient.clear();
        push(routes.home);
    }, [push, queryClient]);

    const value = useMemo<UserContextValue>(
        () => ({
            user: user || userProfile,
            isLoading: isLoginLoading || isProfileLoading,
            login,
            logout,
            error: loginError || userProfileError,
        }),
        [
            isLoginLoading,
            isProfileLoading,
            login,
            loginError,
            logout,
            user,
            userProfile,
            userProfileError,
        ],
    );

    useEffect(() => {
        if (!userProfile) {
            return;
        }

        setUser(userProfile);
    }, [userProfile]);

    return (
        <UserContext.Provider value={value}>{children}</UserContext.Provider>
    );
};
