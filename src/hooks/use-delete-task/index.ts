import { mutator } from "@/network/mutator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Task, tasksQueryKey } from "../use-tasks";
import { AxiosError } from "@/network/axios";

interface useDeleteTaskProps {
    onSuccess?: () => void;
}

export const useDeleteTask = ({
    onSuccess: _onSuccess,
}: useDeleteTaskProps) => {
    const queryClient = useQueryClient();

    return useMutation<Task, AxiosError, number>({
        mutationFn: (taskId) =>
            mutator({ method: "delete", url: `task/${taskId}` }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: tasksQueryKey });
            _onSuccess?.();
        },
    });
};
