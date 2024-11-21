import {
    addDays,
    isFriday,
    isSaturday,
    isSunday,
    setHours,
    setMinutes,
    startOfDay,
} from "date-fns";

export const getReporSubmissionLimits = (date: Date | string) => {
    if (isFriday(date)) {
        // If it's Friday, set start to 07:30 today and end to 09:30 tomorrow
        return {
            start: setMinutes(setHours(startOfDay(date), 7), 30),
            end: setMinutes(setHours(addDays(startOfDay(date), 1), 9), 30),
        };
    }
    if (isSaturday(date)) {
        // If it's Saturday, set start to 09:30 today and end to 09:30 tomorrow
        return {
            start: setMinutes(setHours(startOfDay(date), 9), 30),
            end: setMinutes(setHours(addDays(startOfDay(date), 1), 9), 30),
        };
    }
    if (isSunday(date)) {
        // If it's Sunday, set start to 09:30 today and end to 07:30 tomorrow
        return {
            start: setMinutes(setHours(startOfDay(date), 9), 30),
            end: setMinutes(setHours(addDays(startOfDay(date), 1), 7), 30),
        };
    }

    return {
        // For other weekdays, set start to 07:30 today and end to 07:30 tomorrow
        start: setMinutes(setHours(startOfDay(date), 7), 30),
        end: setMinutes(setHours(addDays(startOfDay(date), 1), 7), 30),
    };
};
