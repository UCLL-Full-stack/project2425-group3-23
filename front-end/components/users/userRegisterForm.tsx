import React, { useState } from "react";
import AccountService from "@services/accountService";
import { Button, TextField, Typography, Box } from "@mui/material";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

const UserRegisterForm: React.FC = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setErrorMessage(t("register.error.passwordMismatch"));
      return;
    }

    try {
      const user = { username, password };
      const response = await AccountService.registerUser(user);

      if (!response.ok) {
        const data = await response.json();
        setErrorMessage(data.message || t("register.error.failed"));
        return;
      }

      // Remove stored user
      localStorage.removeItem("loggedInUser"); // In case guest was logged in

      setSuccessMessage(t("register.success"));
      setTimeout(() => router.push("/login"), 2000); // Redirect to login after success
    } catch (error) {
      console.error("Register error:", error);
      setErrorMessage(t("register.error.failed"));
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap="1em"
      sx={{
        width: "100%",
        maxWidth: "400px",
        margin: "0 auto",
        padding: "1em",
        border: "1px solid #ccc",
        borderRadius: "5px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <Typography variant="h4">{t("register.title")}</Typography>
      {errorMessage && <Typography color="error">{errorMessage}</Typography>}
      {successMessage && (
        <Typography color="success">{successMessage}</Typography>
      )}
      <TextField
        label={t("register.label.username")}
        value={username}
        onChange={(e) => setUsername(e.target.value.slice(0, 20))}
        variant="outlined"
        fullWidth
      />
      <TextField
        label={t("register.label.password")}
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value.slice(0, 100))}
        variant="outlined"
        fullWidth
      />
      <TextField
        label={t("register.label.confirmPassword")}
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value.slice(0, 100))}
        variant="outlined"
        fullWidth
      />
      <Box display="flex" justifyContent="flex-end" width="100%">
        <Button variant="contained" color="primary" onClick={handleRegister}>
          {t("register.button")}
        </Button>
      </Box>
    </Box>
  );
};

export default UserRegisterForm;
