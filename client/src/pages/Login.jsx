import React, { useState, useContext, useEffect } from "react";
import { loginUser } from "../api/authApi"; // now fetch-based
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { token, login } = useContext(AuthContext);

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  useEffect(() => {
    if (token) {
      navigate("/dashboard"); // redirect if already logged in
    }
  }, [token, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // fetch-based loginUser returns JSON directly
      const res = await loginUser(form);

      // Use login function from context
      login(res.token); // fetch API returns token directly

      alert("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      alert(err.message || "Login Failed"); // fetch errors are caught here
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5 }}>
        <Typography variant="h4" align="center">Login</Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            margin="normal"
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            margin="normal"
            onChange={handleChange}
          />

          <Button variant="contained" fullWidth type="submit" sx={{ mt: 3 }}>
            Login
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Login;
