import { AxiosError } from "@/network/axios";
import { mutator } from "@/network/mutator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dailyReportQueryKey } from "../use-daily-report";

export type ReportFormFields = { author: string } & Record<string, boolean>;

const getReportSubmitData = ({ author, ...tasks }: ReportFormFields) => {
    return {
        author: author.trim(),
        completedTasks: Object.entries(tasks)
            .map(([taskId, isDone]) => ({ taskId, isDone }))
            .filter(({ isDone }) => isDone)
            .map(({ taskId }) => Number(taskId)),
    };
};

export const useReportSubmit = () => {
    const queryClient = useQueryClient();

    return useMutation<
        null,
        AxiosError,
        { reportId: number; fields: ReportFormFields }
    >({
        mutationFn: ({ reportId, fields }) =>
            mutator({
                method: "patch",
                url: `report/${reportId}`,
                data: getReportSubmitData(fields),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: dailyReportQueryKey });
        },
    });
};
