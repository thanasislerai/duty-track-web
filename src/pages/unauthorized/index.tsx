import { Box, Button, Typography } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";

const styleWrapper = {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
};

export const UnauthorizedPage = () => {
    return (
        <Box sx={styleWrapper}>
            <Typography textAlign="center" variant="h3">
                Σύστημα Διαχείρησης Διαδικασιών ΓΕΠ
            </Typography>
            <Button
                variant="contained"
                color="success"
                startIcon={<LoginIcon />}
            >
                Εισοδος
            </Button>
        </Box>
    );
};
