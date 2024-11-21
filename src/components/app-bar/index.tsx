import { styled } from "@mui/material/styles";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { SIDE_BAR_WIDTH } from "../side-bar";
import { Box, Button, IconButton, Toolbar } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import { useUser } from "@/hooks/use-user";
import { useCallback, useMemo } from "react";

interface _AppBarProps extends MuiAppBarProps {
    isSideBarOpen: boolean;
}

interface AppBarProps extends _AppBarProps {
    handleMenuButtonClick: () => void;
}

const styleMenuIcon = (isSideBarOpen: boolean) => ({
    marginRight: 5,
    ...(isSideBarOpen ? { display: "none" } : {}),
});

const styleSpacer = {
    flexGrow: 1,
};

const _AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "isSideBarOpen",
})<_AppBarProps>(({ theme }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    variants: [
        {
            props: ({ isSideBarOpen }) => isSideBarOpen,
            style: {
                marginLeft: SIDE_BAR_WIDTH,
                width: `calc(100% - ${SIDE_BAR_WIDTH}px)`,
                transition: theme.transitions.create(["width", "margin"], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.enteringScreen,
                }),
            },
        },
    ],
}));

export const AppBar = ({
    isSideBarOpen,
    handleMenuButtonClick,
}: AppBarProps) => {
    const { user, logout } = useUser();

    const sxMenuIcon = useMemo(
        () => styleMenuIcon(isSideBarOpen),
        [isSideBarOpen],
    );

    const handleLogout = useCallback(() => logout(), [logout]);

    return (
        <_AppBar isSideBarOpen={isSideBarOpen}>
            <Toolbar>
                {user?.isAdmin && (
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleMenuButtonClick}
                        edge="start"
                        sx={sxMenuIcon}
                    >
                        <MenuIcon />
                    </IconButton>
                )}

                <Box sx={styleSpacer} />
                {!!user && (
                    <Button onClick={handleLogout} startIcon={<LogoutIcon />}>
                        Εξοδος
                    </Button>
                )}
            </Toolbar>
        </_AppBar>
    );
};
