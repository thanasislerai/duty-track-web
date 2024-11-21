import { useDailyReport } from "@/hooks/use-daily-report";
import {
    Box,
    Button,
    Card,
    Checkbox,
    LinearProgress,
    List,
    ListItem,
    ListItemText,
    Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { format } from "date-fns";
import { useCallback } from "react";
import { ReportSubmissionSnackbar } from "@/components/report-submission-snackbar";
import { ReportFormFields, useReportSubmit } from "@/hooks/use-report-submit";

const styleLinearProgress = {
    m: -3,
};

const styleReportWrapper = {
    mt: 3,
};

const styleFormHeader = {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
};

export const UserReportPage = () => {
    const today = new Date();
    const { report, isLoading } = useDailyReport();
    const {
        submit,
        isPending: isSubmissionPending,
        isSuccess: isSubmissionSuccessful,
        error: submissionError,
    } = useReportSubmit(report?.id);
    const { control, handleSubmit } = useForm<ReportFormFields>();

    const handleReportSubmit = useCallback(
        (data: ReportFormFields) => {
            submit(data);
        },
        [submit],
    );

    if (isLoading || isSubmissionPending) {
        return <LinearProgress sx={styleLinearProgress} />;
    }

    return (
        <>
            <Box>
                {!!report?.duties.length && (
                    <form onSubmit={handleSubmit(handleReportSubmit)}>
                        <Box sx={styleFormHeader}>
                            <Typography variant="h4">
                                Ημερήσια Αναφορά {format(today, "dd/MM/yyyy")}
                            </Typography>
                            <Button
                                type="submit"
                                color="success"
                                variant="contained"
                            >
                                ΥΠΟΒΟΛΗ
                            </Button>
                        </Box>
                        <Card sx={styleReportWrapper}>
                            <List>
                                {report.duties.map(
                                    ({ id, title, isDone }, index) => (
                                        <ListItem
                                            divider={
                                                index !==
                                                report.duties.length - 1
                                            }
                                            key={id}
                                        >
                                            <ListItemText>
                                                {index + 1}. {title}
                                            </ListItemText>
                                            <Controller
                                                control={control}
                                                name={`${id}`}
                                                defaultValue={isDone}
                                                render={({
                                                    field: {
                                                        name,
                                                        onChange,
                                                        value,
                                                        ref,
                                                    },
                                                }) => (
                                                    <Checkbox
                                                        name={name}
                                                        onChange={onChange}
                                                        checked={value}
                                                        inputRef={ref}
                                                    />
                                                )}
                                            />
                                        </ListItem>
                                    ),
                                )}
                            </List>
                        </Card>
                    </form>
                )}
            </Box>
            {isSubmissionSuccessful && (
                <ReportSubmissionSnackbar
                    severity="success"
                    message="Η αναφορά συμπληρώθηκε επιτυχώς"
                />
            )}
            {!!submissionError && (
                <ReportSubmissionSnackbar
                    severity="error"
                    message={submissionError.message}
                />
            )}
        </>
    );
};
