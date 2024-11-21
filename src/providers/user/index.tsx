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

const getLocalStorageItem = (key: string) => {
    if (typeof window !== "undefined") {
        return localStorage.getItem(key);
    }
    return null;
};

const setLocalStorageItem = (key: string, value: string) => {
    if (typeof window !== "undefined") {
        localStorage.setItem(key, value);
    }
};

const removeLocalStorageItem = (key: string) => {
    if (typeof window !== "undefined") {
        localStorage.removeItem(key);
    }
};

export const UserProvider = ({ children }: UserProviderProps) => {
    const { push } = useRouter();
    const [user, setUser] = useState<User>();
    const [token, setToken] = useState<string | null>(null);
    const [isTokenLoading, setIsTokenLoading] = useState(true);
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
            setLocalStorageItem(JWT_TOKEN_LOCAL_STORAGE_KEY, token);
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
        removeLocalStorageItem(JWT_TOKEN_LOCAL_STORAGE_KEY);
        queryClient.clear();
        push(routes.home);
    }, [push, queryClient]);

    const value = useMemo<UserContextValue>(
        () => ({
            user: user || userProfile,
            isLoading: isLoginLoading || isProfileLoading || isTokenLoading,
            login,
            logout,
            error: loginError || userProfileError,
        }),
        [
            isLoginLoading,
            isProfileLoading,
            isTokenLoading,
            login,
            loginError,
            logout,
            user,
            userProfile,
            userProfileError,
        ],
    );

    useEffect(() => {
        setToken(getLocalStorageItem(JWT_TOKEN_LOCAL_STORAGE_KEY));
        setIsTokenLoading(false);
    }, []);

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
