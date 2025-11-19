import React, { useState } from "react";
import { createDonor } from "../api/donorApi";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const AddDonor = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    bloodGroup: "",
    city: "",
    phone: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createDonor(form);
      alert("Donor added!");
      navigate("/donors");
    } catch (err) {
      alert("Failed to add donor");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" align="center">Add Donor</Typography>

      <form onSubmit={handleSubmit}>
        <TextField fullWidth label="Name" name="name" margin="normal" onChange={handleChange} />
        <TextField fullWidth label="Blood Group" name="bloodGroup" margin="normal" onChange={handleChange} />
        <TextField fullWidth label="City" name="city" margin="normal" onChange={handleChange} />
        <TextField fullWidth label="Phone" name="phone" margin="normal" onChange={handleChange} />

        <Button variant="contained" fullWidth type="submit" sx={{ mt: 3 }}>
          Add
        </Button>
      </form>
    </Container>
  );
};

export default AddDonor;
