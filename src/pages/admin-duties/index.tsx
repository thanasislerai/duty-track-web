import {
    Duty,
    frequencyTranslator,
    useDuties,
    weekDayTranslator,
} from "@/hooks/use-duties";
import { Box, Button, LinearProgress, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { useCallback, useEffect, useState } from "react";
import { DutyForm } from "@/components/duty-form";
import {
    DataGrid,
    GridActionsCellItem,
    GridColDef,
    GridRowsProp,
} from "@mui/x-data-grid";
import { usePageContentContext } from "@/hooks/use-page-content";

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

export const AdminDutiesPage = () => {
    const { duties, isLoading } = useDuties();
    const { isSideBarOpen } = usePageContentContext();
    const [isDutyFormOpen, setIsFormDutyOpen] = useState(false);
    const [dutyToEdit, setDutyToEdit] = useState<Duty>();
    const [dataGridKey, setDataGridKey] = useState(0);

    const rows: GridRowsProp<Duty> = duties;
    const columns: GridColDef[] = [
        { field: "title", headerName: "ΤΙΤΛΟΣ", flex: 0.4 },
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
            field: "weeklyOn",
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
                    onClick={() => handleDutyEdit(params.row)}
                />,
            ],
        },
    ];

    const handleDutyFormOpen = useCallback(() => setIsFormDutyOpen(true), []);
    const handleDutyFormClose = useCallback(() => {
        setIsFormDutyOpen(false);
        setDutyToEdit(undefined);
    }, []);

    const handleDutyAdd = useCallback(() => {
        setDutyToEdit(undefined);
        handleDutyFormOpen();
    }, [handleDutyFormOpen]);

    const handleDutyEdit = useCallback(
        (duty: Duty) => {
            setDutyToEdit(duty);
            handleDutyFormOpen();
        },
        [handleDutyFormOpen],
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

    return (
        <>
            <DutyForm
                isOpen={isDutyFormOpen}
                duty={dutyToEdit}
                onClose={handleDutyFormClose}
            />
            <Box>
                <Box sx={styleHeader}>
                    <Typography variant="h4">Επεξεργασία Καθηκόντων</Typography>
                    <Button
                        color="success"
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleDutyAdd}
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
