"use client";
import LuggageIcon from "@mui/icons-material/Luggage";
import AssessmentIcon from "@mui/icons-material/Assessment";
import { createContext, ReactNode, useMemo, useState } from "react";
import { useUser } from "@/hooks/use-user";

interface SideBarOption {
    text: string;
    icon: ReactNode;
    action: () => void;
}

export type PageContentId =
    | "user-leave"
    | "user-report"
    | "admin-leaves"
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
                        text: "Άδειες",
                        icon: <LuggageIcon />,
                        action: () => setPageContentId("admin-leaves"),
                    },
                    {
                        text: "Ημερήσιες Αναφορές",
                        icon: <AssessmentIcon />,
                        action: () => setPageContentId("admin-reports"),
                    },
                ],
            };
        }

        return {
            authorized: true,
            pageId: pageContentId,
            sideBarOptions: [
                {
                    text: "Αίτηση για Άδεια",
                    icon: <LuggageIcon />,
                    action: () => setPageContentId("user-leave"),
                },
                {
                    text: "Συμπλήρωση Αναφοράς",
                    icon: <AssessmentIcon />,
                    action: () => setPageContentId("user-report"),
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
