import React, { useState, useContext } from "react";
import { registerUser } from "../api/authApi";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Register = () => {
  const { login } = useContext(AuthContext); // optional auto-login after register
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await registerUser(form);

      alert("Registration successful!");

      // Optional: auto-login if token returned
      if (res.data.token) {
        login(res.data.token);
        navigate("/dashboard");
      } else {
        navigate("/login"); // fallback
      }
    } catch (err) {
      alert(err.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5 }}>
        <Typography variant="h4" align="center">Register</Typography>

        <form onSubmit={handleSubmit}>
          <TextField fullWidth label="Name" name="name" margin="normal" onChange={handleChange} />
          <TextField fullWidth label="Email" name="email" type="email" margin="normal" onChange={handleChange} />
          <TextField fullWidth label="Password" type="password" name="password" margin="normal" onChange={handleChange} />

          <Button variant="contained" fullWidth type="submit" sx={{ mt: 3 }}>Register</Button>
        </form>
      </Box>
    </Container>
  );
};

export default Register;
