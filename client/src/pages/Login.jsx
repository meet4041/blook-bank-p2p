import React, { useState, useContext, useEffect, useRef } from "react"; // Added useRef
import { loginUser } from "../api/authApi";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { token, login } = useContext(AuthContext);
  
  // 1. Requirement: Use useRef to access the DOM element directly
  const emailInputRef = useRef(null);

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
    // Auto-focus the email input field when component mounts
    if (emailInputRef.current) {
      emailInputRef.current.focus();
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
    // 2. Requirement: Semantic Element (<section> instead of just Generic Box/Divs)
    <section>
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
              inputRef={emailInputRef} // Attach the ref here
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
    </section>
  );
};

export default Login;