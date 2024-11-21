import { mutator } from "@/network/mutator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dutiesQueryKey, Duty } from "../use-duties";
import { AxiosError } from "axios";

export type FormFields = Pick<
    Duty,
    "title" | "frequency" | "weeklyOn" | "enabled"
>;

interface UseSaveDutyProps {
    dutyId?: number;
    onSuccess?: () => void;
}

export const useSaveDuty = ({
    dutyId,
    onSuccess: _onSuccess,
}: UseSaveDutyProps) => {
    const queryClient = useQueryClient();
    const isUpdate = typeof dutyId === "number";
    const method = isUpdate ? "patch" : "post";
    const url = isUpdate ? `duty/${dutyId}` : "duty";

    return useMutation<Duty, AxiosError<{ message: string }>, FormFields>({
        mutationFn: (data) => mutator({ method, url, data }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: dutiesQueryKey });
            _onSuccess?.();
        },
    });
};
