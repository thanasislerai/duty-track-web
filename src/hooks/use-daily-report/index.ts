import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "@/network/axios";
import { fetcher } from "@/network/fetcher";
import { useUser } from "../use-user";
import { Report } from "../use-reports";

export const dailyReportQueryKey = ["report/daily"];

export const useDailyReport = () => {
    const { user } = useUser();
    const { data: dailyReport, ...rest } = useQuery<Report, AxiosError>({
        queryKey: dailyReportQueryKey,
        queryFn: () => fetcher({ queryKey: dailyReportQueryKey }),
        enabled: typeof user?.id === "number",
        retry: 3,
    });

    return {
        dailyReport,
        ...rest,
    };
};
