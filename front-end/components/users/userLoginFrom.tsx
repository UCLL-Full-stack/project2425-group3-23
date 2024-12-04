import React, { useState } from "react";
import UserService from "@/services/userService"; 
import { useRouter } from "next/router";
import { Button, TextField, Typography, Box } from "@mui/material";
import { useTranslation } from "next-i18next"; 

const UserLoginForm: React.FC = () => {
    const { t } = useTranslation();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();

    const handleLogin = async () => {
      try {
          const user = { username, password };
          const response = await UserService.loginUser(user);

          if (!response.ok) {
              const data = await response.json();
              setErrorMessage(data.message || t('login.failed'));  
              return;
          }

          const data = await response.json();
          localStorage.setItem("loggedInUser", JSON.stringify(data));

          router.push("/");
      } catch (error) {
          console.error("Login error:", error);
          setErrorMessage(t('login.error')); 
      }
  };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" gap="1em">
            <Typography variant="h4">{t('login.title')}</Typography> 
            {errorMessage && <Typography color="error">{errorMessage}</Typography>}
            <TextField
                label={t('login.label.username')} 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                variant="outlined"
                fullWidth
            />
            <TextField
                label={t('login.label.password')} 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="outlined"
                fullWidth
            />
            <Button variant="contained" color="primary" onClick={handleLogin}>
                {t('login.button')}
            </Button>
        </Box>
    );
};

export default UserLoginForm;
