import React, { useState, useContext, useEffect } from "react";
import { loginUser } from "../api/authApi"; // fetch-based
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
      navigate("/dashboard"); 
    }
  }, [token, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(form);
      login(res.token);
      alert("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      alert(err.message || "Login Failed");
    }
  };

  return (
    <main>
      <Container maxWidth="sm">
        
        {/* HEADER */}
        <header>
          <Typography variant="h4" align="center" sx={{ mt: 5 }}>
            Login
          </Typography>
        </header>

        {/* FORM SECTION */}
        <section>
          <Box sx={{ mt: 3 }}>
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
        </section>

      </Container>
    </main>
  );
};

export default Login;
