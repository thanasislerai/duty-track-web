"use client";
import { useUser } from "@/hooks/use-user";
import UserReport from "@/partials/user-report";
import { routes } from "@/routes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function HomePage() {
    const { user } = useUser();
    const { push } = useRouter();
    const [isRoleChecked, setIsRoleChecked] = useState(false);

    useEffect(() => {
        // If there is not user then do nothing
        if (typeof user?.id !== "number") {
            return;
        }

        if (user.isAdmin) {
            // If user is an admin, redirect them to the `/reports` page
            push(routes.adminReports);
        } else {
            // If user is not an admin, then set the role to checked so that the user report
            // page is displayed
            setIsRoleChecked(true);
        }
    }, [push, user?.id, user?.isAdmin]);

    if (!isRoleChecked) {
        return null;
    }

    return <UserReport />;
}
