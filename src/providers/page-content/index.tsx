"use client";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import AssessmentIcon from "@mui/icons-material/Assessment";
import { createContext, ReactNode, useMemo, useState } from "react";
import { useUser } from "@/hooks/use-user";

interface SideBarOption {
    text: string;
    icon: ReactNode;
    action: () => void;
}

export type PageContentId =
    | "user-profile"
    | "user-report"
    | "admin-profile"
    | "admin-reports";

interface PageContentProviderProps {
    children: ReactNode;
}

interface PageContentContextValue {
    authorized: boolean;
    pageId?: PageContentId;
    sideBarOptions: SideBarOption[];
}

export const PageContentContext = createContext<PageContentContextValue>({
    authorized: false,
    sideBarOptions: [],
    pageId: undefined,
});

export const PageContentProvider = ({ children }: PageContentProviderProps) => {
    const { user } = useUser();
    const [pageContentId, setPageContentId] = useState<PageContentId>();

    const value = useMemo<PageContentContextValue>(() => {
        // If there is no user, return no value
        if (!user?.id) {
            return {
                authorized: false,
                sideBarOptions: [],
            };
        }

        if (user.isAdmin) {
            return {
                authorized: true,
                pageId: pageContentId,
                sideBarOptions: [
                    {
                        text: "Ημερήσιες Αναφορές",
                        icon: <AssessmentIcon />,
                        action: () => setPageContentId("admin-reports"),
                    },
                    {
                        text: "Προφίλ",
                        icon: <AccountBoxIcon />,
                        action: () => setPageContentId("admin-profile"),
                    },
                ],
            };
        }

        return {
            authorized: true,
            pageId: pageContentId,
            sideBarOptions: [
                {
                    text: "Συμπλήρωση Αναφοράς",
                    icon: <AssessmentIcon />,
                    action: () => setPageContentId("user-report"),
                },
                {
                    text: "Προφίλ",
                    icon: <AccountBoxIcon />,
                    action: () => setPageContentId("user-profile"),
                },
            ],
        };
    }, [pageContentId, user?.id, user?.isAdmin]);

    return (
        <PageContentContext.Provider value={value}>
            {children}
        </PageContentContext.Provider>
    );
};
