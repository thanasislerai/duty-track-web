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
        if (user) {
            if (user.isAdmin) {
                push(routes.adminReports);
            } else {
                setIsRoleChecked(true);
            }
        }
    }, [push, user]);

    if (!isRoleChecked) {
        return null;
    }

    return <UserReport />;
}
