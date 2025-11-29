import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const { login } = useContext(AuthContext); // auto-login after register
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
      const response = await fetch("http://localhost:8000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration Failed");
      }

      const data = await response.json();
      alert("Registration successful!");

      // Auto-login if token returned
      if (data.token) {
        login(data.token);
        navigate("/dashboard");
      } else {
        navigate("/login"); // fallback
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <header>
        <Typography variant="h4" align="center" component="h1" sx={{ mt: 5 }}>
          Register
        </Typography>
      </header>

      <main>
        <section>
          <Box sx={{ mt: 3 }}>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                margin="normal"
                onChange={handleChange}
              />
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
                type="password"
                name="password"
                margin="normal"
                onChange={handleChange}
              />

              <Button
                variant="contained"
                fullWidth
                type="submit"
                sx={{ mt: 3 }}
              >
                Register
              </Button>
            </form>
          </Box>
        </section>
      </main>

      <footer>
        <Typography variant="body2" align="center" sx={{ mt: 5, mb: 2 }}>
          &copy; {new Date().getFullYear()} YourAppName. All rights reserved.
        </Typography>
      </footer>
    </Container>
  );
};

export default Register;
