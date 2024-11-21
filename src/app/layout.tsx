import { QueryClientProvider } from "@/providers/query-client";
import { theme } from "@/theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { Page } from "@/components/page";

export const metadata: Metadata = {
    title: "Duty Report",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <AppRouterCacheProvider>
                    <QueryClientProvider>
                        <ThemeProvider theme={theme}>
                            <CssBaseline />
                            <Page>{children}</Page>
                        </ThemeProvider>
                    </QueryClientProvider>
                </AppRouterCacheProvider>
            </body>
        </html>
    );
}
