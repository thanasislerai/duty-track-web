import { mutator } from "@/network/mutator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { dailyReportQueryKey } from "../use-daily-report";

export type ReportFormFields = Record<string, boolean>;

type ReportSubmitData = {
    dutyId: number;
    isDone: boolean;
}[];

export function useReportSubmit(reportId: number | undefined) {
    const queryClient = useQueryClient();
    const { mutate, ...rest } = useMutation<void, Error, ReportSubmitData>({
        mutationFn: (data) =>
            mutator({ method: "put", url: `report/${reportId}`, data }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: dailyReportQueryKey });
        },
    });

    const submit = useCallback(
        (data: ReportFormFields) => {
            mutate(
                Object.entries(data).map(([key, isDone]) => ({
                    dutyId: Number(key),
                    isDone,
                })),
            );
        },
        [mutate],
    );

    return {
        submit,
        ...rest,
    };
}
