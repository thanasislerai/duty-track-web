import { CSSObject, styled, Theme } from "@mui/material/styles";
import {
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Drawer as MuiDrawer,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { useMemo } from "react";
import { usePageContentContext } from "@/hooks/use-page-content";

export const SIDE_BAR_WIDTH = 300;

interface SideBarProps {
    isOpen: boolean;
    onClose: () => void;
}

const styleListItem = { display: "block" };

const styleListItemButton = (isSideBarOpen: boolean) => ({
    minHeight: 48,
    px: 2.5,
    justifyContent: isSideBarOpen ? "initial" : "center",
});

const styleListItemIcon = (isSideBarOpen: boolean) => ({
    minWidth: 0,
    justifyContent: "center",
    mr: isSideBarOpen ? 3 : "auto",
});

const styleListItemText = (isSideBarOpen: boolean) => ({
    opacity: isSideBarOpen ? 1 : 0,
});

const openedMixin = (theme: Theme): CSSObject => ({
    width: SIDE_BAR_WIDTH,
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up("sm")]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

export const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
    width: SIDE_BAR_WIDTH,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    variants: [
        {
            props: ({ open }) => open,
            style: {
                ...openedMixin(theme),
                "& .MuiDrawer-paper": openedMixin(theme),
            },
        },
        {
            props: ({ open }) => !open,
            style: {
                ...closedMixin(theme),
                "& .MuiDrawer-paper": closedMixin(theme),
            },
        },
    ],
}));

export const SideBar = ({ isOpen, onClose }: SideBarProps) => {
    const { sideBarOptions } = usePageContentContext();
    const listItemStyles = useMemo(
        () => ({
            button: styleListItemButton(isOpen),
            icon: styleListItemIcon(isOpen),
            text: styleListItemText(isOpen),
        }),
        [isOpen],
    );

    return (
        <Drawer variant="permanent" open={isOpen}>
            <DrawerHeader>
                <IconButton onClick={onClose}>
                    <ChevronLeftIcon />
                </IconButton>
            </DrawerHeader>
            <Divider />
            {sideBarOptions.length > 0 && (
                <List>
                    {sideBarOptions.map(({ text, icon, action }) => (
                        <ListItem key={text} disablePadding sx={styleListItem}>
                            <ListItemButton
                                onClick={action}
                                sx={listItemStyles.button}
                            >
                                <ListItemIcon sx={listItemStyles.icon}>
                                    {icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={text}
                                    sx={listItemStyles.text}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            )}
        </Drawer>
    );
};
