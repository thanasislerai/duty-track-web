import { renderReportStatusIcon, Report } from "@/hooks/use-reports";
import {
    Box,
    Button,
    Card,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    List,
    ListItem,
    ListItemText,
    TextField,
} from "@mui/material";
import { format } from "date-fns";

interface ReportDialogProps {
    report?: Report;
    onClose: () => void;
}

const styleDilogTitle = {
    display: "flex",
    alignItems: "center",
    gap: 2,
};

const styleAuthorTextField = {
    mt: 2,
};

const styleTaskList = {
    mt: 4,
};

export const ReportDialog = ({ report, onClose }: ReportDialogProps) => {
    const now = new Date();
    const timeOfReference = report?.createdAt ?? now;
    const completedTaskIds = new Set(report?.completedTasks);

    const date = format(timeOfReference, "dd/MM/yyyy");

    if (!report) {
        return null;
    }

    return (
        <Dialog open={!!report} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle component={Box} sx={styleDilogTitle}>
                {renderReportStatusIcon(report, false)} Ημερήσια Αναφορά {date}
            </DialogTitle>
            <DialogContent dividers>
                <TextField
                    sx={styleAuthorTextField}
                    fullWidth
                    size="small"
                    value={report.author ?? ""}
                    label="Όνομα"
                    slotProps={{ input: { readOnly: true } }}
                />
                <Card sx={styleTaskList}>
                    <List disablePadding>
                        {report.totalTasks.map(({ id, description }, index) => (
                            <ListItem
                                key={id}
                                divider={index !== report.totalTasks.length - 1}
                            >
                                <ListItemText>
                                    {index + 1}. {description}
                                </ListItemText>
                                <Checkbox
                                    checked={completedTaskIds.has(id)}
                                    readOnly
                                    disableRipple
                                    size="small"
                                />
                            </ListItem>
                        ))}
                    </List>
                </Card>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={onClose}>
                    ΚΛΕΙΣΙΜΟ
                </Button>
            </DialogActions>
        </Dialog>
    );
};
