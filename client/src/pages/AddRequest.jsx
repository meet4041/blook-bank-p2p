import React, { useState } from "react";
import { createRequest } from "../api/requestApi";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const AddRequest = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    patientName: "",
    bloodGroup: "",
    unitsRequired: "",
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
      alert("Request added!");
      navigate("/requests");
    } catch (err) {
      alert("Failed to add request");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" align="center">Add Blood Request</Typography>

      <form onSubmit={handleSubmit}>
        <TextField fullWidth label="Patient Name" name="patientName" margin="normal" onChange={handleChange} />
        <TextField fullWidth label="Blood Group" name="bloodGroup" margin="normal" onChange={handleChange} />
        <TextField fullWidth label="Units Required" name="unitsRequired" margin="normal" onChange={handleChange} />
        <TextField fullWidth label="Hospital" name="hospital" margin="normal" onChange={handleChange} />
        <TextField fullWidth label="City" name="city" margin="normal" onChange={handleChange} />

        <Button variant="contained" fullWidth type="submit" sx={{ mt: 3 }}>
          Submit
        </Button>
      </form>
    </Container>
  );
};

export default AddRequest;
