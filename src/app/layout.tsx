import { QueryClientProvider } from "@/providers/query-client";
import { theme } from "@/theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { Page } from "@/components/page";
import { SideBarProvider } from "@/providers/side-bar";
import { UserProvider } from "@/providers/user";

export const metadata: Metadata = {
    title: "Task Report",
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
                            <UserProvider>
                                <SideBarProvider>
                                    <CssBaseline />
                                    <Page>{children}</Page>
                                </SideBarProvider>
                            </UserProvider>
                        </ThemeProvider>
                    </QueryClientProvider>
                </AppRouterCacheProvider>
            </body>
        </html>
    );
}
