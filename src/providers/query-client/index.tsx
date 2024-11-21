"use client";
import { FC, ReactNode } from "react";
import {
    QueryClient,
    QueryClientProvider as OgQueryClientProvider,
} from "react-query";

const queryClient = new QueryClient();

export const QueryClientProvider: FC<{ children: ReactNode }> = ({
    children,
}) => (
    <OgQueryClientProvider client={queryClient}>
        {children}
    </OgQueryClientProvider>
);
