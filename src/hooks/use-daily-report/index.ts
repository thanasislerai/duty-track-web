import { useQuery } from "@tanstack/react-query";
import { User } from "../use-user";
import { fetcher } from "@/network/fetcher";
import { Duty } from "../use-duties";

interface ReportDuty extends Duty {
    isDone: boolean;
}

interface DailyReport {
    date: string;
    id: number;
    user: User;
    duties: ReportDuty[];
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
