"use client";
import { FC, ReactNode } from "react";
import {
    QueryClient,
    QueryClientProvider as OgQueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

export const QueryClientProvider: FC<{ children: ReactNode }> = ({
    children,
}) => (
    <OgQueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
    </OgQueryClientProvider>
);
