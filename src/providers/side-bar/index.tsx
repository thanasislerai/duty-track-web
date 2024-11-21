"use client";
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
import { useRouter } from "next/navigation";
import { routes } from "@/routes";
import { useUser } from "@/hooks/use-user";

interface SideBarOption {
    text: string;
    icon: ReactNode;
    action: () => void;
}

interface SideBarProviderProps {
    children: ReactNode;
}

interface SideBarContextValue {
    sideBarOptions: SideBarOption[];
    isSideBarOpen: boolean;
    handleSideBarOpen: () => void;
    handleSideBarClose: () => void;
}

export const SideBarContext = createContext<SideBarContextValue>(null!);

export const SideBarProvider = ({ children }: SideBarProviderProps) => {
    const { push } = useRouter();
    const { user } = useUser();
    const [isSideBarOpen, setIsSideBarOpen] = useState(false);

    const handleSideBarOpen = useCallback(() => {
        setIsSideBarOpen(true);
    }, []);

    const handleSideBarClose = useCallback(() => {
        setIsSideBarOpen(false);
    }, []);

    useEffect(() => handleSideBarClose(), [handleSideBarClose, user?.id]);

    const value = useMemo<SideBarContextValue>(() => {
        return {
            isSideBarOpen,
            handleSideBarClose,
            handleSideBarOpen,
            sideBarOptions: [
                {
                    text: "Ημερήσιες Αναφορές",
                    icon: <AssessmentIcon />,
                    action: () => {
                        push(routes.adminReports);
                    },
                },
                {
                    text: "Επεξεργασία Tasks",
                    icon: <EditIcon />,
                    action: () => {
                        push(routes.adminTasks);
                    },
                },
            ],
        };
    }, [handleSideBarClose, handleSideBarOpen, isSideBarOpen, push]);

    return (
        <SideBarContext.Provider value={value}>
            {children}
        </SideBarContext.Provider>
    );
};
