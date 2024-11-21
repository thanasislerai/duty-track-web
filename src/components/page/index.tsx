"use client";
import { ReactNode, useMemo } from "react";
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
    const { authorized, isSideBarOpen, handleSideBarClose, handleSideBarOpen } =
        usePageContentContext();

    const sxMain = useMemo(() => styleMain(authorized), [authorized]);

    return (
        <Box sx={stylePageWrapper}>
            {authorized && (
                <>
                    <AppBar
                        isSideBarOpen={isSideBarOpen}
                        handleMenuButtonClick={handleSideBarOpen}
                    />
                    <SideBar
                        isOpen={isSideBarOpen}
                        onClose={handleSideBarClose}
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
