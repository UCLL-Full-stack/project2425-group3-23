import React, { useState } from "react";
import UserService from "@/services/userService"; 
import { useRouter } from "next/router";
import { Button, TextField, Typography, Box } from "@mui/material";

const UserLoginForm: React.FC = () => {
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
              setErrorMessage(data.message || "Failed to log in.");
              return;
          }
          const data = await response.json();
          localStorage.setItem("token", data.token);
          router.push("/");
      } catch (error) {
          console.error("Login error:", error);
          setErrorMessage("An unexpected error occurred. Please try again.");
      }
  };
  

    return (
        <Box display="flex" flexDirection="column" alignItems="center" gap="1em">
            <Typography variant="h4">Login</Typography>
            {errorMessage && <Typography color="error">{errorMessage}</Typography>}
            <TextField
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                variant="outlined"
                fullWidth
            />
            <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="outlined"
                fullWidth
            />
            <Button variant="contained" color="primary" onClick={handleLogin}>
                Login
            </Button>
        </Box>
    );
};

export default UserLoginForm;
