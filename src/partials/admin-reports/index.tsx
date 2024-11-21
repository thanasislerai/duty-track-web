"use client";
import { useUser } from "@/hooks/use-user";
import { Box, LinearProgress, Tooltip, Typography } from "@mui/material";
import NotFoundPage from "../not-found";
import {
    renderReportStatusIcon,
    Report,
    useReports,
} from "@/hooks/use-reports";
import {
    DataGrid,
    GridActionsCellItem,
    GridColDef,
    GridRowsProp,
} from "@mui/x-data-grid";
import { useCallback, useEffect, useState } from "react";
import { useSideBarContext } from "@/hooks/use-side-bar";
import { format } from "date-fns";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { ReportDialog } from "@/components/report-dialog";

const styleLinearProgress = {
    m: -3,
};

const styleTableContainer = {
    mt: 4,
    maxHeight: 500,
};

export default function AdminReports() {
    const { user } = useUser();
    const { reports, isLoading } = useReports();
    const { isSideBarOpen } = useSideBarContext();
    const [dataGridKey, setDataGridKey] = useState(0);
    const [selectedReport, setSelectedReport] = useState<Report>();

    const handleReportDialogClose = useCallback(
        () => setSelectedReport(undefined),
        [],
    );

    const rows: GridRowsProp<Report> = reports;

    const columns: GridColDef[] = [
        {
            field: "status",
            headerName: "ΚΑΤΑΣΤΑΣΗ",
            flex: 0.1,
            sortable: false,
            display: "flex",
            valueFormatter: (value) => value,
            renderCell: ({ row }: { row: Report }) =>
                renderReportStatusIcon(row),
        },
        {
            field: "createdAt",
            headerName: "ΗΜΕΡΟΜΗΝΙΑ",
            flex: 0.2,
            valueGetter: (value) =>
                !!value ? format(value, "dd/MM/yyyy") : "",
        },
        {
            field: "submittedAt",
            headerName: "ΥΠΟΒΛΗΘΗΚΕ",
            flex: 0.2,
            valueGetter: (value) =>
                !!value ? format(value, "dd/MM/yyyy hh:mm:ss") : "",
        },
        {
            field: "author",
            headerName: "ΌΝΟΜΑ",
            flex: 0.2,
        },
        {
            field: "completedTasks",
            headerName: "ΟΛΟΚΛΗΡΩΜΕΝΑ TASKS",
            disableColumnMenu: true,
            sortable: false,
            flex: 0.2,
            valueGetter: (value: number[], row: Report) =>
                `${value.length}/${row.totalTasks.length}`,
        },
        {
            field: "actions",
            type: "actions",
            headerName: "ΕΝΕΡΓΕΙΕΣ",
            flex: 0.1,
            getActions: ({ id, row }) => [
                <Tooltip key={id} title="Λεπτομέρειες" placement="top" arrow>
                    <GridActionsCellItem
                        icon={<VisibilityIcon />}
                        label="Λεπτομέρειες"
                        onClick={() => setSelectedReport(row)}
                    />
                </Tooltip>,
            ],
        },
    ];

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
            <ReportDialog
                report={selectedReport}
                onClose={handleReportDialogClose}
            />
            <Box>
                <Typography variant="h4">Ημερήσιες Αναφορές</Typography>
                <DataGrid
                    sx={styleTableContainer}
                    key={dataGridKey}
                    rows={rows}
                    columns={columns}
                />
            </Box>
        </>
    );
}
