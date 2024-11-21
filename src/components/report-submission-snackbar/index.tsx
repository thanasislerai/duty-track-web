import { Alert, AlertProps, Snackbar } from "@mui/material";
import { useCallback, useState } from "react";

interface ReportSubmissionSnackbarProps {
    message: string;
    severity: AlertProps["severity"];
}

const styleAlert = { width: "100%" };

export const ReportSubmissionSnackbar = ({
    message,
    severity,
}: ReportSubmissionSnackbarProps) => {
    const [isOpen, setIsOpen] = useState(!!message);

    const handleClose = useCallback(() => setIsOpen(false), []);

    return (
        <Snackbar
            open={isOpen}
            autoHideDuration={5000}
            onClose={handleClose}
            anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
        >
            <Alert
                onClose={handleClose}
                severity={severity}
                variant="filled"
                sx={styleAlert}
            >
                {message}
            </Alert>
        </Snackbar>
    );
};
