"use client";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import AssessmentIcon from "@mui/icons-material/Assessment";
import EditIcon from "@mui/icons-material/Edit";
import {
    createContext,
    ReactNode,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import { useUser } from "@/hooks/use-user";
import { useRouter, useSearchParams } from "next/navigation";

interface SideBarOption {
    text: string;
    icon: ReactNode;
    action: () => void;
}

const pageContentIds = [
    "user-profile",
    "user-report",
    "admin-duties",
    "admin-profile",
    "admin-reports",
] as const;

export type PageContentId = (typeof pageContentIds)[number];

interface PageContentProviderProps {
    children: ReactNode;
}

interface PageContentContextValue {
    authorized: boolean;
    pageId?: PageContentId;
    sideBarOptions: SideBarOption[];
    isSideBarOpen: boolean;
    handleSideBarOpen: () => void;
    handleSideBarClose: () => void;
}

export const PageContentContext = createContext<PageContentContextValue>({
    authorized: false,
    sideBarOptions: [],
    pageId: undefined,
    isSideBarOpen: true,
    handleSideBarOpen: () => {},
    handleSideBarClose: () => {},
});

export const PageContentProvider = ({ children }: PageContentProviderProps) => {
    const { user } = useUser();
    const searchParams = useSearchParams();
    const router = useRouter();
    const [pageContentId, setPageContentId] = useState<PageContentId>();
    const [isSideBarOpen, setIsSideBarOpen] = useState(true);
    const pageIdParam = searchParams?.get("pageId");

    const handleSideBarOpen = useCallback(() => {
        setIsSideBarOpen(true);
    }, []);

    const handleSideBarClose = useCallback(() => {
        setIsSideBarOpen(false);
    }, []);

    const setQueryParam = useCallback(
        (value: PageContentId) => {
            if (!searchParams) {
                return;
            }
            const params = new URLSearchParams(searchParams.toString()); // Clone current query params
            if (value) {
                params.set("pageId", value); // Update or add query param
            } else {
                params.delete("pageId"); // Remove the param if value is falsy
            }

            router.push(`?${params.toString()}`); // Navigate to new URL with updated query
        },
        [router, searchParams],
    );

    useEffect(() => {
        if (!pageIdParam) {
            return;
        }

        if (pageContentIds.includes(pageIdParam as PageContentId)) {
            setPageContentId(pageIdParam as PageContentId);
        }
    }, [pageIdParam]);

    const value = useMemo<PageContentContextValue>(() => {
        // If there is no user, return no value
        if (!user?.id) {
            return {
                authorized: false,
                sideBarOptions: [],
                isSideBarOpen,
                handleSideBarClose,
                handleSideBarOpen,
            };
        }

        if (user.isAdmin) {
            return {
                authorized: true,
                pageId: pageContentId,
                isSideBarOpen,
                handleSideBarClose,
                handleSideBarOpen,
                sideBarOptions: [
                    {
                        text: "Ημερήσιες Αναφορές",
                        icon: <AssessmentIcon />,
                        action: () => {
                            setPageContentId("admin-reports");
                            setQueryParam("admin-reports");
                        },
                    },
                    {
                        text: "Επεξεργασία Καθηκόντων",
                        icon: <EditIcon />,
                        action: () => {
                            setPageContentId("admin-duties");
                            setQueryParam("admin-duties");
                        },
                    },
                    {
                        text: "Προφίλ",
                        icon: <AccountBoxIcon />,
                        action: () => {
                            setPageContentId("admin-profile");
                            setQueryParam("admin-profile");
                        },
                    },
                ],
            };
        }

        return {
            authorized: true,
            pageId: pageContentId,
            isSideBarOpen,
            handleSideBarClose,
            handleSideBarOpen,
            sideBarOptions: [
                {
                    text: "Συμπλήρωση Αναφοράς",
                    icon: <AssessmentIcon />,
                    action: () => {
                        setPageContentId("user-report");
                        setQueryParam("user-report");
                    },
                },
                {
                    text: "Προφίλ",
                    icon: <AccountBoxIcon />,
                    action: () => {
                        setPageContentId("user-profile");
                        setQueryParam("user-profile");
                    },
                },
            ],
        };
    }, [
        handleSideBarClose,
        handleSideBarOpen,
        isSideBarOpen,
        pageContentId,
        setQueryParam,
        user?.id,
        user?.isAdmin,
    ]);

    return (
        <PageContentContext.Provider value={value}>
            {children}
        </PageContentContext.Provider>
    );
};
