"use client";
import {
    Task,
    frequencyTranslator,
    useTasks,
    weekDayTranslator,
} from "@/hooks/use-tasks";
import { Box, Button, LinearProgress, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { useCallback, useEffect, useState } from "react";
import { TaskForm } from "@/components/task-form";
import {
    DataGrid,
    GridActionsCellItem,
    GridColDef,
    GridRowsProp,
} from "@mui/x-data-grid";
import { useSideBarContext } from "@/hooks/use-side-bar";
import { useUser } from "@/hooks/use-user";
import { NotFoundPage } from "../not-found";

const styleHeader = {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
};

const styleTableContainer = {
    mt: 4,
    maxHeight: 500,
    // maxWidth: "100%",
};

const styleLinearProgress = {
    m: -3,
};

export const AdminTasksPage = () => {
    const { user } = useUser();
    const { tasks, isLoading } = useTasks();
    const { isSideBarOpen } = useSideBarContext();
    const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState<Task>();
    const [dataGridKey, setDataGridKey] = useState(0);

    const rows: GridRowsProp<Task> = tasks;
    const columns: GridColDef[] = [
        { field: "description", headerName: "ΠΕΡΙΓΡΑΦΗ", flex: 0.4 },
        {
            field: "enabled",
            headerName: "ΚΑΤΑΣΤΑΣΗ",
            valueGetter: (value) => (!!value ? "Ενεργό" : "Ανενεργό"),
            flex: 0.15,
        },
        {
            field: "frequency",
            headerName: "ΣΥΧΝΟΤΗΤΑ",
            valueGetter: frequencyTranslator,
            flex: 0.15,
        },
        {
            field: "weekDay",
            headerName: "ΚΑΘΕ",
            valueGetter: weekDayTranslator,
            flex: 0.15,
        },
        {
            field: "actions",
            type: "actions",
            flex: 0.15,
            getActions: (params) => [
                <GridActionsCellItem
                    key={params.id}
                    icon={<EditIcon />}
                    label="Delete"
                    onClick={() => handleTaskEdit(params.row)}
                />,
            ],
        },
    ];

    const handleTaskFormOpen = useCallback(() => setIsTaskFormOpen(true), []);
    const handleTaskFormClose = useCallback(() => {
        setIsTaskFormOpen(false);
        setTaskToEdit(undefined);
    }, []);

    const handleTaskAdd = useCallback(() => {
        setTaskToEdit(undefined);
        handleTaskFormOpen();
    }, [handleTaskFormOpen]);

    const handleTaskEdit = useCallback(
        (task: Task) => {
            setTaskToEdit(task);
            handleTaskFormOpen();
        },
        [handleTaskFormOpen],
    );

    useEffect(() => {
        const resizeTimeout = setTimeout(
            () => setDataGridKey((prevKey) => prevKey + 1),
            300,
        );

        return () => {
            clearTimeout(resizeTimeout);
        };
    }, [isSideBarOpen]);

    if (isLoading) {
        return <LinearProgress sx={styleLinearProgress} />;
    }

    if (!user?.isAdmin) {
        return <NotFoundPage />;
    }

    return (
        <>
            <TaskForm
                isOpen={isTaskFormOpen}
                task={taskToEdit}
                onClose={handleTaskFormClose}
            />
            <Box>
                <Box sx={styleHeader}>
                    <Typography variant="h4">Επεξεργασία Tasks</Typography>
                    <Button
                        color="success"
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleTaskAdd}
                    >
                        ΠΡΟΣΘΗΚΗ
                    </Button>
                </Box>
                <DataGrid
                    key={dataGridKey}
                    sx={styleTableContainer}
                    rows={rows}
                    columns={columns}
                />
            </Box>
        </>
    );
};
