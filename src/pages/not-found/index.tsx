"use client";
import { useUser } from "@/hooks/use-user";
import { routes } from "@/routes";
import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import CottageIcon from "@mui/icons-material/Cottage";

const styleWrapper = (adjustHeight: boolean) => ({
    height: adjustHeight
        ? { xs: "calc(100vh - 56px - 48px)", sm: "calc(100vh - 64px - 48px)" }
        : "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
});

export const NotFoundPage = () => {
    const { user } = useUser();
    const { push } = useRouter();

    const sxWrapper = useMemo(
        () => styleWrapper(typeof user?.id === "number"),
        [user?.id],
    );

    const onNavigateToHome = useCallback(() => push(routes.home), [push]);

    return (
        <Box sx={sxWrapper}>
            <Typography textAlign="center" variant="h3">
                Η σελίδα δε βρέθηκε
            </Typography>
            <Button
                startIcon={<CottageIcon />}
                variant="contained"
                onClick={onNavigateToHome}
            >
                Επιστροφή στην Αρχική Σελίδα
            </Button>
        </Box>
    );
};
