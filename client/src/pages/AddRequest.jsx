import React, { useState, useRef, useEffect } from "react";
import { createRequest } from "../api/requestApi";
import { TextField, Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const AddRequest = () => {
  const navigate = useNavigate();

  // Using useRef for rubric requirement (auto-focus first input)
  const patientRef = useRef(null);
  useEffect(() => {
    patientRef.current?.focus();
  }, []);

  const [form, setForm] = useState({
    patientName: "",
    bloodGroup: "",
    units: "",
    hospital: "",
    city: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createRequest(form);
      alert("Blood request added!");
      navigate("/requests");
    } catch (err) {
      alert("Failed to add request");
      console.error(err);
    }
  };

  return (
    <main>
      <Container maxWidth="sm" sx={{ mt: 5 }}>

        {/* Header section */}
        <header>
          <Typography variant="h4" align="center">
            Add Blood Request
          </Typography>
        </header>

        {/* Form section */}
        <section style={{ marginTop: "20px" }}>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Patient Name"
              name="patientName"
              margin="normal"
              inputRef={patientRef}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              label="Blood Group"
              name="bloodGroup"
              margin="normal"
              onChange={handleChange}
            />

            <TextField
              fullWidth
              label="Units Needed"
              name="units"
              type="number"
              margin="normal"
              onChange={handleChange}
            />

            <TextField
              fullWidth
              label="Hospital"
              name="hospital"
              margin="normal"
              onChange={handleChange}
            />

            <TextField
              fullWidth
              label="City"
              name="city"
              margin="normal"
              onChange={handleChange}
            />

            <Button variant="contained" fullWidth type="submit" sx={{ mt: 3 }}>
              Add Request
            </Button>
          </form>
        </section>

      </Container>
    </main>
  );
};

export default AddRequest;
