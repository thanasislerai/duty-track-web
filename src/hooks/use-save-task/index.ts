import { mutator } from "@/network/mutator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tasksQueryKey, Task } from "../use-tasks";
import { AxiosError } from "@/network/axios";

export type FormFields = Pick<
    Task,
    "description" | "frequency" | "weekDay" | "enabled"
>;

interface UseSaveTaskProps {
    taskId?: number;
    onSuccess?: () => void;
}

export const useSaveTask = ({
    taskId,
    onSuccess: _onSuccess,
}: UseSaveTaskProps) => {
    const queryClient = useQueryClient();
    const isUpdate = typeof taskId === "number";
    const method = isUpdate ? "patch" : "post";
    const url = isUpdate ? `task/${taskId}` : "task";

    return useMutation<Task, AxiosError, FormFields>({
        mutationFn: (data) =>
            mutator({
                method,
                url,
                data,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: tasksQueryKey });
            _onSuccess?.();
        },
    });
};
