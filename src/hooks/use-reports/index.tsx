import { useQuery } from "@tanstack/react-query";
import { Task } from "../use-tasks";
import { useUser } from "../use-user";
import { AxiosError } from "@/network/axios";
import { fetcher } from "@/network/fetcher";
import { getReporSubmissionLimits } from "@/helpers";
import { isAfter } from "date-fns";
import { Tooltip } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import { useMemo } from "react";

enum ReportStatus {
    CREATED = "Εκκρεμής",
    SUBMITTED = "Υποβλήθηκε",
    OVERDUE = "Εκπρόθεσμη",
}

export const getReportStatus = (report: ReportResponse): ReportStatus => {
    const now = new Date();
    const { end } = getReporSubmissionLimits(report.createdAt);
    if (!!report.submittedAt) {
        return ReportStatus.SUBMITTED;
    }

    if (isAfter(now, end)) {
        return ReportStatus.OVERDUE;
    }

    return ReportStatus.CREATED;
};

export const renderReportStatusIcon = (report: Report, tooltip = true) => {
    switch (report.status) {
        case ReportStatus.SUBMITTED:
            return tooltip ? (
                <Tooltip title={ReportStatus.SUBMITTED} placement="top" arrow>
                    <CheckCircleIcon color="success" />
                </Tooltip>
            ) : (
                <CheckCircleIcon color="success" />
            );
        case ReportStatus.OVERDUE:
            return tooltip ? (
                <Tooltip title={ReportStatus.OVERDUE} placement="top" arrow>
                    <BlockOutlinedIcon color="error" />
                </Tooltip>
            ) : (
                <BlockOutlinedIcon color="error" />
            );
        case ReportStatus.CREATED:
            return tooltip ? (
                <Tooltip title={ReportStatus.CREATED} placement="top" arrow>
                    <WatchLaterIcon color="info" />
                </Tooltip>
            ) : (
                <WatchLaterIcon color="info" />
            );
    }
};

export interface ReportResponse {
    id: number;
    submittedAt?: string;
    author?: string;
    completedTasks: number[];
    totalTasks: Task[];
    createdAt: string;
}

export interface Report extends ReportResponse {
    status: ReportStatus;
}

const reportsQueryKey = ["report"];

export const useReports = () => {
    const { user } = useUser();
    const { data, ...rest } = useQuery<ReportResponse[], AxiosError>({
        queryKey: reportsQueryKey,
        queryFn: () => fetcher({ queryKey: reportsQueryKey }),
        enabled: typeof user?.id === "number",
    });

    const reports = useMemo<Report[]>(
        () =>
            (data ?? []).map((report) => ({
                ...report,
                status: getReportStatus(report),
            })),
        [data],
    );

    return {
        reports,
        ...rest,
    };
};
