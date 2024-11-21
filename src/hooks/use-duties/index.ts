import { fetcher } from "@/network/fetcher";
import { useQuery } from "@tanstack/react-query";

export const weekDayTranslator = (day: Duty["weeklyOn"]) => {
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

export const frequencyTranslator = (frequency: Duty["frequency"]) => {
    switch (frequency) {
        case "daily":
            return "Καθημερινά";
        case "weekly":
            return "Εβδομαδιαία";
    }
};

export interface Duty {
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
    enabled: boolean;
}

export const dutiesQueryKey = ["duty"];

export function useDuties() {
    const { data, ...rest } = useQuery({
        queryKey: dutiesQueryKey,
        queryFn: () => fetcher<Duty[]>({ queryKey: dutiesQueryKey }),
    });

    return {
        duties: data ?? [],
        ...rest,
    };
}
