import { useQuery } from "@tanstack/react-query";
import { User } from "../use-user";
import { fetcher } from "@/network/fetcher";

interface Duty {
    id: number;
    title: string;
    frequency: "daily" | "weekly";
    weeklyOn?:
        | "Monday"
        | "Tuesday"
        | "Wednesday"
        | "Thursday"
        | "Friday"
        | "Saturday"
        | "Sunday";
    isDone: boolean;
}

interface DailyReport {
    date: string;
    id: number;
    user: User;
    duties: Duty[];
}

export const dailyReportQueryKey = ["report/daily"];

export const useDailyReport = () => {
    const { data, ...rest } = useQuery({
        queryKey: dailyReportQueryKey,
        queryFn: () => fetcher<DailyReport>({ queryKey: dailyReportQueryKey }),
    });

    return {
        report: data,
        ...rest,
    };
};
