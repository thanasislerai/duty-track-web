"use client";
import {
    Task,
    frequencyTranslator,
    weekDayTranslator,
} from "@/hooks/use-tasks";
import { FormFields, useSaveTask } from "@/hooks/use-save-task";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogProps,
    DialogTitle,
    FormControlLabel,
    MenuItem,
    Switch,
    TextField,
} from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { InfoSnackbar } from "../info-snackbar";

const styleDialogContent = {
    display: "flex",
    flexDirection: "column",
    gap: 4,
};

interface TaskFormProps extends Omit<DialogProps, "open" | "onClose"> {
    isOpen: boolean;
    task?: Task;
    onClose: () => void;
}

export const TaskForm = ({
    isOpen,
    task,
    onClose,
    ...dialogProps
}: TaskFormProps) => {
    const {
        control,
        watch,
        reset,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<FormFields>({
        mode: "onSubmit",
    });
    const {
        mutate: save,
        error: saveError,
        isSuccess: isSaveSuccessful,
        isPending,
    } = useSaveTask({ taskId: task?.id, onSuccess: onClose });
    const [isEditMode, setIsEditMode] = useState(false);

    const frequency = watch("frequency");
    const saveSuccessInfoMessage = useMemo(
        () =>
            isEditMode
                ? "Το task ενημερώθηκε επιτυχώς"
                : "Το νέο task προστέθηκε με επιτυχία",
        [isEditMode],
    );
    const dialogTitle = useMemo(
        () => (isEditMode ? "Επεξεργασία Task" : "Προσθήκη Task"),
        [isEditMode],
    );

    const onSubmit = useCallback(
        (data: FormFields) => {
            save(data);
        },
        [save],
    );

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        setIsEditMode(typeof task?.id === "number");
    }, [isOpen, task?.id]);

    useEffect(() => {
        if (isOpen) {
            reset({
                description: task?.description || "",
                frequency: task?.frequency,
                weekDay: task?.weekDay,
            });
        }
    }, [isOpen, reset, task?.description, task?.frequency, task?.weekDay]);

    useEffect(() => {
        setValue("weekDay", frequency === "daily" ? undefined : task?.weekDay);
    }, [task?.weekDay, frequency, setValue]);

    return (
        <>
            {!!saveError?.response?.data.message && (
                <InfoSnackbar
                    severity="error"
                    message={saveError.response?.data.message}
                />
            )}
            {isSaveSuccessful && (
                <InfoSnackbar
                    severity="success"
                    message={saveSuccessInfoMessage}
                />
            )}
            <Dialog
                open={isOpen}
                onClose={onClose}
                maxWidth="sm"
                fullWidth
                {...dialogProps}
            >
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogTitle>{dialogTitle}</DialogTitle>
                    <DialogContent dividers sx={styleDialogContent}>
                        <Controller
                            control={control}
                            name="description"
                            defaultValue={task?.description}
                            rules={{
                                required:
                                    "Ο τίτλος του task είναι υποχρεωτικό πεδίο",
                            }}
                            render={({ field }) => (
                                <TextField
                                    fullWidth
                                    name={field.name}
                                    onChange={field.onChange}
                                    ref={field.ref}
                                    value={field.value ?? ""}
                                    label="Τίτλος"
                                    error={!!errors.description}
                                    helperText={errors.description?.message}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="frequency"
                            defaultValue={task?.frequency}
                            rules={{
                                required:
                                    "Θα πρέπει να καθορίσετε τη συχνότητα του task",
                            }}
                            render={({ field }) => (
                                <TextField
                                    fullWidth
                                    name={field.name}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        // Clear weeklyOn field if frequency changes to daily
                                        setValue(
                                            "weekDay",
                                            e.target.value === "daily"
                                                ? undefined
                                                : task?.weekDay,
                                        );
                                    }}
                                    ref={field.ref}
                                    value={field.value ?? ""}
                                    label="Συχνότητα"
                                    select
                                    error={!!errors.frequency}
                                    helperText={errors.frequency?.message}
                                >
                                    {["daily", "weekly"].map((frequency) => (
                                        <MenuItem
                                            key={frequency}
                                            value={
                                                frequency as Task["frequency"]
                                            }
                                        >
                                            {frequencyTranslator(
                                                frequency as Task["frequency"],
                                            )}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />
                        <Controller
                            control={control}
                            name="weekDay"
                            defaultValue={task?.weekDay}
                            rules={{
                                required:
                                    frequency === "weekly"
                                        ? "Θα πρέπει να καθορίσετε ποια μέρα της εβδομάδας θα πρέπει να εκτελείται αυτό το task"
                                        : false,
                            }}
                            render={({ field }) => (
                                <TextField
                                    fullWidth
                                    name={field.name}
                                    onChange={field.onChange}
                                    ref={field.ref}
                                    value={field.value ?? ""}
                                    label="Κάθε"
                                    select
                                    disabled={frequency !== "weekly"}
                                    error={!!errors.weekDay}
                                    helperText={errors.weekDay?.message}
                                >
                                    {[
                                        "Monday",
                                        "Tuesday",
                                        "Wednesday",
                                        "Thursday",
                                        "Friday",
                                        "Saturday",
                                        "Sunday",
                                    ].map((day) => (
                                        <MenuItem
                                            key={day}
                                            value={day as Task["weekDay"]}
                                        >
                                            {weekDayTranslator(
                                                day as Task["weekDay"],
                                            )}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />
                        <Controller
                            control={control}
                            name="enabled"
                            defaultValue={task?.enabled ?? true}
                            render={({ field }) => (
                                <FormControlLabel
                                    control={
                                        <Switch
                                            name={field.name}
                                            onChange={field.onChange}
                                            ref={field.ref}
                                            checked={field.value}
                                        />
                                    }
                                    label="Ενεργό"
                                    defaultChecked={task?.enabled}
                                />
                            )}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button
                            color="error"
                            variant="contained"
                            onClick={onClose}
                        >
                            ΑΚΥΡΩΣΗ
                        </Button>
                        <Button
                            type="submit"
                            color="success"
                            variant="contained"
                            disabled={isPending}
                        >
                            ΑΠΟΘΗΚΕΥΣΗ{isPending ? "..." : ""}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
};
