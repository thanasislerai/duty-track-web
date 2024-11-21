"use client";
import { usePageContentContext } from "@/hooks/use-page-content";
import { AdminLeavesPage } from "@/pages/admin-leaves";
import { AdminReportsPage } from "@/pages/admin-reports";
import { UnauthorizedPage } from "@/pages/unauthorized";
import { UserLeavePage } from "@/pages/user-leave";
import { UserReportPage } from "@/pages/user-report";
import { PageContentId } from "@/providers/page-content";
import { ReactNode } from "react";

const pageMap: Record<PageContentId, ReactNode> = {
    "admin-leaves": <AdminLeavesPage />,
    "admin-reports": <AdminReportsPage />,
    "user-leave": <UserLeavePage />,
    "user-report": <UserReportPage />,
};

export default function HomePage() {
    const { authorized, pageId } = usePageContentContext();

    if (!authorized) {
        return <UnauthorizedPage />;
    }

    return pageMap[pageId!];
}
