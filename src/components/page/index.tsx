"use client";
import { ReactNode, useCallback, useState } from "react";
import { AppBar } from "../app-bar";
import { DrawerHeader, SideBar } from "../side-bar";
import { Box } from "@mui/material";

const stylePageWrapper = { display: "flex" };
const styleMain = { flexGrow: 1, p: 3 };

interface PageProps {
    children: ReactNode;
}

export function Page({ children }: PageProps) {
    const [isSideBarOpen, setIsSideBarOpen] = useState(false);

    const handleDrawerOpen = useCallback(() => {
        setIsSideBarOpen(true);
    }, []);

    const handleDrawerClose = useCallback(() => {
        setIsSideBarOpen(false);
    }, []);

    return (
        <Box sx={stylePageWrapper}>
            <AppBar
                isSideBarOpen={isSideBarOpen}
                handleMenuButtonClick={handleDrawerOpen}
            />
            <SideBar isOpen={isSideBarOpen} onClose={handleDrawerClose} />
            <Box component="main" sx={styleMain}>
                <DrawerHeader />
                {children}
            </Box>
        </Box>
    );
}
