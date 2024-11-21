import {
    Box,
    Button,
    Container,
    LinearProgress,
    TextField,
    Typography,
} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import { useUser } from "@/hooks/use-user";
import { Controller, useForm } from "react-hook-form";
import { useCallback } from "react";
import { LoginFormFields } from "@/providers/user";
import { InfoSnackbar } from "@/components/info-snackbar";

const styleWrapper = {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
};

const styleFieldsWrapper = {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    marginBottom: 4,
};

export const UnauthorizedPage = () => {
    const { login, isLoading, error } = useUser();
    const {
        control,
        formState: { errors },
        handleSubmit,
    } = useForm<LoginFormFields>({ mode: "onSubmit" });

    const onSubmit = useCallback(
        (data: LoginFormFields) => {
            login(data);
        },
        [login],
    );

    if (isLoading) {
        return <LinearProgress />;
    }

    return (
        <>
            {!!error?.response?.data.message && (
                <InfoSnackbar
                    message={error.response.data.message}
                    severity="error"
                />
            )}
            <Box sx={styleWrapper}>
                <Typography textAlign="center" variant="h3">
                    Σύστημα Ημερήσιων Αναφορών ΓΕΠ
                </Typography>
                <Container maxWidth="xs">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Box sx={styleFieldsWrapper}>
                            <Controller
                                control={control}
                                name="userName"
                                rules={{
                                    required:
                                        "Το όνομα χρήστη είναι υποχρεωτικό πεδίο",
                                }}
                                render={({ field }) => (
                                    <TextField
                                        ref={field.ref}
                                        name={field.name}
                                        onChange={field.onChange}
                                        label="Όνομα χρήστη"
                                        error={!!errors.userName}
                                        helperText={errors.userName?.message}
                                    />
                                )}
                            />
                            <Controller
                                control={control}
                                name="password"
                                rules={{
                                    required: "Συμπληρώστε τον κωδικό σας",
                                }}
                                render={({ field }) => (
                                    <TextField
                                        type="password"
                                        ref={field.ref}
                                        name={field.name}
                                        onChange={field.onChange}
                                        label="Κωδικός"
                                        error={!!errors.password}
                                        helperText={errors.password?.message}
                                    />
                                )}
                            />
                        </Box>
                        <Button
                            type="submit"
                            variant="contained"
                            color="success"
                            startIcon={<LoginIcon />}
                            fullWidth
                        >
                            Εισοδος
                        </Button>
                    </form>
                </Container>
            </Box>
        </>
    );
};
