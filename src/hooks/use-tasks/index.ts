import { fetcher } from "@/network/fetcher";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "../use-user";

export const weekDayTranslator = (day: Task["weekDay"]) => {
    switch (day) {
        case "Monday":
            return "Δευτέρα";
        case "Tuesday":
            return "Τρίτη";
        case "Wednesday":
            return "Τετάρτη";
        case "Thursday":
            return "Πέμπτη";
        case "Friday":
            return "Παρασκευή";
        case "Saturday":
            return "Σάββατο";
        case "Sunday":
            return "Κυριακή";
        default:
            return undefined;
    }
};

export const frequencyTranslator = (frequency: Task["frequency"]) => {
    switch (frequency) {
        case "daily":
            return "Καθημερινά";
        case "weekly":
            return "Εβδομαδιαία";
    }
};

export interface Task {
    id: number;
    description: string;
    frequency: "daily" | "weekly";
    weekDay?:
        | "Monday"
        | "Tuesday"
        | "Wednesday"
        | "Thursday"
        | "Friday"
        | "Saturday"
        | "Sunday";
    enabled: boolean;
}

export const tasksQueryKey = ["task"];

export function useTasks() {
    const { user } = useUser();
    const { data, ...rest } = useQuery({
        queryKey: tasksQueryKey,
        queryFn: () =>
            fetcher<Task[]>({
                queryKey: tasksQueryKey,
            }),
        enabled: Boolean(user?.isAdmin),
    });

    return {
        tasks: data ?? [],
        ...rest,
    };
}
