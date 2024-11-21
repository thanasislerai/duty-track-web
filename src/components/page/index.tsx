"use client";
import { ReactNode, useMemo } from "react";
import { AppBar } from "../app-bar";
import { DrawerHeader, SideBar } from "../side-bar";
import { Box, LinearProgress } from "@mui/material";
import { useSideBarContext } from "@/hooks/use-side-bar";
import { useUser } from "@/hooks/use-user";
import UnauthorizedPage from "@/partials/unauthorized";
import { usePathname } from "next/navigation";
import { routes } from "@/routes";
import NotFoundPage from "@/app/not-found";

const stylePageWrapper = { display: "flex" };
const styleMain = (withPadding: boolean) => ({
    flexGrow: 1,
    p: withPadding ? 3 : 0,
});

interface PageProps {
    children: ReactNode;
}

export function Page({ children }: PageProps) {
    const pathName = usePathname() ?? "";
    const { user, isLoading: isUserLoading } = useUser();
    const { isSideBarOpen, handleSideBarClose, handleSideBarOpen } =
        useSideBarContext();

    const sxMain = useMemo(
        () => styleMain(typeof user?.id === "number"),
        [user?.id],
    );

    if (isUserLoading) {
        return <LinearProgress />;
    }

    if (!user) {
        return pathName === routes.home ? (
            <UnauthorizedPage />
        ) : (
            <NotFoundPage />
        );
    }

    return (
        <Box sx={stylePageWrapper}>
            <AppBar
                isSideBarOpen={isSideBarOpen}
                handleMenuButtonClick={handleSideBarOpen}
            />
            {user?.isAdmin && (
                <SideBar isOpen={isSideBarOpen} onClose={handleSideBarClose} />
            )}

            <Box component="main" sx={sxMain}>
                {!!user && <DrawerHeader />}
                {children}
            </Box>
        </Box>
    );
}
