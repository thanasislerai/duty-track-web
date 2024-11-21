import {
    Duty,
    frequencyTranslator,
    weekDayTranslator,
} from "@/hooks/use-duties";
import { FormFields, useSaveDuty } from "@/hooks/use-save-duty";
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

interface DutyFormProps extends Omit<DialogProps, "open" | "onClose"> {
    isOpen: boolean;
    duty?: Duty;
    onClose: () => void;
}

export const DutyForm = ({
    isOpen,
    duty,
    onClose,
    ...dialogProps
}: DutyFormProps) => {
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
    } = useSaveDuty({ dutyId: duty?.id, onSuccess: onClose });
    const [isEditMode, setIsEditMode] = useState(false);

    const frequency = watch("frequency");
    const saveSuccessInfoMessage = useMemo(
        () =>
            isEditMode
                ? "Το καθήκον ενημερώθηκε επιτυχώς"
                : "Το νέο καθήκον προστέθηκε με επιτυχία",
        [isEditMode],
    );
    const dialogTitle = useMemo(
        () => (isEditMode ? "Επεξεργασία Καθήκοντος" : "Προσθήκη Καθήκοντος"),
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

        setIsEditMode(typeof duty?.id === "number");
    }, [isOpen, duty]);

    useEffect(() => {
        if (isOpen) {
            // Reset form values to the current duty when the dialog opens
            reset({
                title: duty?.title || "",
                frequency: duty?.frequency,
                weeklyOn: duty?.weeklyOn,
            });
        }
    }, [isOpen, duty, reset]);

    useEffect(() => {
        setValue(
            "weeklyOn",
            frequency === "daily" ? undefined : duty?.weeklyOn,
        );
    }, [duty?.weeklyOn, frequency, setValue]);

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
                            name="title"
                            defaultValue={duty?.title}
                            rules={{
                                required:
                                    "Ο τίτλος του καθήκοντος είναι υποχρεωτικό πεδίο",
                            }}
                            render={({ field }) => (
                                <TextField
                                    fullWidth
                                    name={field.name}
                                    onChange={field.onChange}
                                    ref={field.ref}
                                    value={field.value ?? ""}
                                    label="Τίτλος"
                                    error={!!errors.title}
                                    helperText={errors.title?.message}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="frequency"
                            defaultValue={duty?.frequency}
                            rules={{
                                required:
                                    "Θα πρέπει να καθορίσετε τη συχνότητα του καθήκοντος",
                            }}
                            render={({ field }) => (
                                <TextField
                                    fullWidth
                                    name={field.name}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        // Clear weeklyOn field if frequency changes to daily
                                        setValue(
                                            "weeklyOn",
                                            e.target.value === "daily"
                                                ? undefined
                                                : duty?.weeklyOn,
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
                                                frequency as Duty["frequency"]
                                            }
                                        >
                                            {frequencyTranslator(
                                                frequency as Duty["frequency"],
                                            )}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />
                        <Controller
                            control={control}
                            name="weeklyOn"
                            defaultValue={duty?.weeklyOn}
                            rules={{
                                required:
                                    frequency === "weekly"
                                        ? "Θα πρέπει να καθορίσετε ποια μέρα της εβδομάδας θα πρέπει να εκτελείται αυτό το καθήκον"
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
                                    error={!!errors.weeklyOn}
                                    helperText={errors.weeklyOn?.message}
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
                                            value={day as Duty["weeklyOn"]}
                                        >
                                            {weekDayTranslator(
                                                day as Duty["weeklyOn"],
                                            )}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />
                        <Controller
                            control={control}
                            name="enabled"
                            defaultValue={duty?.enabled ?? true}
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
                                    defaultChecked={duty?.enabled}
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
