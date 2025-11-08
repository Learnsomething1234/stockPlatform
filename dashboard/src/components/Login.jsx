import React, { useState } from "react";
import axios from "axios";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { message } from "antd"; 
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("https://stockplatform.onrender.com/login", {
        username,
        password,
      });

      if (res.status === 200 && res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data.userId);
        message.success("Login successful!"); 
        navigate("/");
      } else {
        message.error(res.data.error || "Login failed"); 
      }
    } catch (err) {
      if (err.response?.status === 401) {
        message.warning("Invalid username or password"); 
      } else {
        message.error("Server error. Try again later."); 
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f5f7fa"
    >
      <Paper elevation={3} sx={{ p: 4, width: 350, borderRadius: 2 }}>
        <Typography variant="h5" textAlign="center" gutterBottom>
          Sign In
        </Typography>

        <form onSubmit={handleLogin}>
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2, py: 1 }}
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </Button>
        </form>

        <Typography textAlign="center" mt={2}>
          Don't have an account?{" "}
          <a href="https://stock-platform-jet.vercel.app/signup">Sign up here</a>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;
