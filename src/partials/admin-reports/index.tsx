"use client";
import { useUser } from "@/hooks/use-user";
import { Typography } from "@mui/material";
import NotFoundPage from "../not-found";

export default function AdminReports() {
    const { user } = useUser();

    if (!user?.isAdmin) {
        return <NotFoundPage />;
    }

    return <Typography variant="h3">Admin Reports</Typography>;
}
