"use client";
import { ReactNode, useCallback, useMemo, useState } from "react";
import { AppBar } from "../app-bar";
import { DrawerHeader, SideBar } from "../side-bar";
import { Box } from "@mui/material";
import { usePageContentContext } from "@/hooks/use-page-content";

const stylePageWrapper = { display: "flex" };
const styleMain = (withPadding: boolean) => ({
    flexGrow: 1,
    p: withPadding ? 3 : 0,
});

interface PageProps {
    children: ReactNode;
}

export function Page({ children }: PageProps) {
    const { authorized } = usePageContentContext();
    const [isSideBarOpen, setIsSideBarOpen] = useState(true);

    const handleDrawerOpen = useCallback(() => {
        setIsSideBarOpen(true);
    }, []);

    const handleDrawerClose = useCallback(() => {
        setIsSideBarOpen(false);
    }, []);

    const sxMain = useMemo(() => styleMain(authorized), [authorized]);

    return (
        <Box sx={stylePageWrapper}>
            {authorized && (
                <>
                    <AppBar
                        isSideBarOpen={isSideBarOpen}
                        handleMenuButtonClick={handleDrawerOpen}
                    />
                    <SideBar
                        isOpen={isSideBarOpen}
                        onClose={handleDrawerClose}
                    />
                </>
            )}
            <Box component="main" sx={sxMain}>
                {authorized && <DrawerHeader />}
                {children}
            </Box>
        </Box>
    );
}
