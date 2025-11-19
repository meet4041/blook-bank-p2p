import React from "react";
import { Container, Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" align="center">Dashboard</Typography>
      <Typography align="center" sx={{ mt: 2 }}>
        Welcome to the Blood Bank Management System!
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Button
          variant="contained"
          sx={{ mx: 2 }}
          onClick={() => navigate("/donors")}
        >
          Manage Donors
        </Button>

        <Button
          variant="contained"
          sx={{ mx: 2 }}
          onClick={() => navigate("/requests")}
        >
          Manage Requests
        </Button>
      </Box>
    </Container>
  );
};

export default Dashboard;
