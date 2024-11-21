import { useDailyReport } from "@/hooks/use-daily-report";
import {
    Alert,
    Box,
    Button,
    Card,
    Checkbox,
    Container,
    LinearProgress,
    List,
    ListItem,
    ListItemText,
    TextField,
    Typography,
} from "@mui/material";
import { format } from "date-fns";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import { Controller, useForm } from "react-hook-form";
import { useCallback, useMemo, useRef, useState } from "react";
import { ReportFormFields, useReportSubmit } from "@/hooks/use-report-submit";
import { getReporSubmissionLimits } from "@/helpers";
import Countdown, { CountdownRendererFn } from "react-countdown";
import { InfoSnackbar } from "@/components/info-snackbar";

const styleLinearProgress = {
    m: -3,
};

const styleSubmissionHeaderWrapper = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
};

const styleReportWrapper = {
    mt: 3,
};

const styleTasksWrapper = {
    my: 3,
};

const styleActionsWrapper = {
    display: "flex",
    justifyContent: "flex-end",
};

const styleWarningAlert = {
    mt: 2,
};

export const UserReportPage = () => {
    const now = new Date();
    const { dailyReport, isLoading } = useDailyReport();
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<ReportFormFields>();
    const completedTasks = new Set(dailyReport?.completedTasks);
    const { end } = getReporSubmissionLimits(now);
    const [isOverdue, setIsOverDue] = useState(false);
    const countDownRef = useRef<Countdown>(null);
    const {
        mutate: submit,
        isPending: isSubmitLoading,
        isSuccess: isSubmitSuccessful,
        error: submitError,
    } = useReportSubmit();

    const isSubmitted = useMemo(
        () => !!dailyReport?.submittedAt,
        [dailyReport?.submittedAt],
    );

    const onSubmit = useCallback(
        (data: ReportFormFields) => {
            if (typeof dailyReport?.id === "number") {
                countDownRef.current?.stop();
                submit({ reportId: dailyReport.id, fields: data });
            }
        },
        [dailyReport?.id, submit],
    );

    const countdownRenderer: CountdownRendererFn = useCallback(
        ({ hours, minutes, seconds }) => {
            if (isOverdue) {
                return (
                    <Box sx={styleSubmissionHeaderWrapper}>
                        <BlockOutlinedIcon color="error" />
                        <Typography variant="h5" align="center">
                            Η προθεσμία υποβολής έληξε
                        </Typography>
                    </Box>
                );
            }

            return (
                <Box sx={styleSubmissionHeaderWrapper}>
                    <WatchLaterIcon color="info" />
                    <Typography variant="h5" align="center">
                        Η προθεσμία υποβολής λήγει σε{" "}
                        {String(hours).padStart(2, "0")}:
                        {String(minutes).padStart(2, "0")}:
                        {String(seconds).padStart(2, "0")}
                    </Typography>
                </Box>
            );
        },
        [isOverdue],
    );

    if (isLoading) {
        return <LinearProgress sx={styleLinearProgress} />;
    }

    return (
        <>
            {isSubmitSuccessful && (
                <InfoSnackbar
                    severity="success"
                    message="Η υποβολή της αναφοράς έγινε με επιτυχία"
                />
            )}
            {!!submitError?.response?.data.message && (
                <InfoSnackbar
                    severity="error"
                    message={submitError?.response?.data.message}
                />
            )}
            <Container maxWidth="md">
                <Typography variant="h3" align="center" gutterBottom>
                    Ημερήσια Αναφορά {format(now, "dd/MM/yyyy")}
                </Typography>
                {isSubmitted && (
                    <Box sx={styleSubmissionHeaderWrapper}>
                        <CheckCircleIcon color="success" />
                        <Typography variant="h5" align="center">
                            Υποβλήθηκε στις{" "}
                            {format(dailyReport!.submittedAt!, "HH:mm:ss")}
                        </Typography>
                    </Box>
                )}
                {!isSubmitted && (
                    <Countdown
                        ref={countDownRef}
                        date={end}
                        renderer={countdownRenderer}
                        onComplete={() => setIsOverDue(true)}
                    />
                )}
                {!isSubmitted && !isOverdue && (
                    <Alert
                        variant="outlined"
                        severity="warning"
                        sx={styleWarningAlert}
                    >
                        Η υποβολή της αναφοράς είναι οριστική. Μετά την υποβολή,
                        δεν θα υπάρχει δυνατότητα επεξεργασίας.
                    </Alert>
                )}
                <Box sx={styleReportWrapper}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Controller
                            control={control}
                            name="author"
                            defaultValue={dailyReport?.author ?? ""}
                            disabled={
                                isSubmitted || isOverdue || isSubmitLoading
                            }
                            rules={{
                                required: "Παρακαλώ εισάγετε το όνομά σας",
                            }}
                            render={({ field }) => (
                                <TextField
                                    variant="outlined"
                                    inputRef={field.ref}
                                    name={field.name}
                                    onChange={field.onChange}
                                    value={field.value}
                                    disabled={field.disabled}
                                    label="Όνομα"
                                    fullWidth
                                    error={!!errors.author}
                                    helperText={errors.author?.message}
                                />
                            )}
                        />
                        <Card sx={styleTasksWrapper}>
                            <List>
                                {dailyReport?.totalTasks.map(
                                    ({ id, description }, index) => (
                                        <ListItem
                                            divider={
                                                index !==
                                                dailyReport.totalTasks.length -
                                                    1
                                            }
                                            key={id}
                                        >
                                            <ListItemText>
                                                {index + 1}. {description}
                                            </ListItemText>
                                            <Controller
                                                control={control}
                                                name={`${id}`}
                                                defaultValue={completedTasks.has(
                                                    id,
                                                )}
                                                disabled={
                                                    isSubmitted ||
                                                    isOverdue ||
                                                    isSubmitLoading
                                                }
                                                render={({
                                                    field: {
                                                        name,
                                                        onChange,
                                                        value,
                                                        ref,
                                                        disabled,
                                                    },
                                                }) => (
                                                    <Checkbox
                                                        name={name}
                                                        onChange={onChange}
                                                        checked={value}
                                                        inputRef={ref}
                                                        disabled={disabled}
                                                    />
                                                )}
                                            />
                                        </ListItem>
                                    ),
                                )}
                            </List>
                        </Card>
                        {!isSubmitted && (
                            <Box sx={styleActionsWrapper}>
                                <Button
                                    variant="contained"
                                    color="success"
                                    type="submit"
                                    disabled={isOverdue || isSubmitLoading}
                                >
                                    ΥΠΟΒΟΛΗ{isSubmitLoading ? "..." : ""}
                                </Button>
                            </Box>
                        )}
                    </form>
                </Box>
            </Container>
        </>
    );
};
