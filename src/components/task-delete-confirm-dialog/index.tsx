import { useDeleteTask } from "@/hooks/use-delete-task";
import { Task } from "@/hooks/use-tasks";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";
import { useCallback } from "react";
import { InfoSnackbar } from "../info-snackbar";

interface TaskDeleteConfirmDialogProps {
    task: Task | undefined;
    onClose: () => void;
}

export const TaskDeleteConfirmDialog = ({
    task,
    onClose,
}: TaskDeleteConfirmDialogProps) => {
    const {
        mutate: deleteTask,
        isPending: isDeleteLoading,
        isSuccess,
        error,
    } = useDeleteTask({
        onSuccess: onClose,
    });

    const handleTaskDelete = useCallback(() => {
        if (typeof task?.id === "number") {
            deleteTask(task.id);
        }
    }, [deleteTask, task?.id]);

    return (
        <>
            {!!error?.response?.data.message && (
                <InfoSnackbar
                    message={error?.response?.data.message}
                    severity="error"
                />
            )}
            {isSuccess && (
                <InfoSnackbar
                    message="Το task διαγράφτηκε με επιτυχία"
                    severity="success"
                />
            )}
            <Dialog open={!!task} onClose={onClose} maxWidth="sm" fullWidth>
                <DialogTitle>{task?.description}</DialogTitle>
                <DialogContent>
                    Είστε βέβαιοι πως θέλετε να διαγράψετε αυτό το task;
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="error" onClick={onClose}>
                        ΑΚΥΡΩΣΗ
                    </Button>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={handleTaskDelete}
                        disabled={isDeleteLoading}
                    >
                        ΔΙΑΓΡΑΦΗ{isDeleteLoading ? "..." : ""}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
