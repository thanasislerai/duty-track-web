"use client";
import { usePageContentContext } from "@/hooks/use-page-content";
import { AdminProfilePage } from "@/pages/admin-profile";
import { AdminReportsPage } from "@/pages/admin-reports";
import { UnauthorizedPage } from "@/pages/unauthorized";
import { UserProfilePage } from "@/pages/user-profile";
import { UserReportPage } from "@/pages/user-report";
import { PageContentId } from "@/providers/page-content";
import { ReactNode } from "react";

const pageMap: Record<PageContentId, ReactNode> = {
    "admin-reports": <AdminReportsPage />,
    "user-report": <UserReportPage />,
    "admin-profile": <AdminProfilePage />,
    "user-profile": <UserProfilePage />,
};

export default function HomePage() {
    const { authorized, pageId } = usePageContentContext();

    if (!authorized) {
        return <UnauthorizedPage />;
    }

    return pageMap[pageId!];
}
