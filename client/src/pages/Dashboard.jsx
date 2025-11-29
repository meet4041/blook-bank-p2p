import React from "react";
import { Container, Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import QuoteWidget from "../components/QuoteWidget"; // <--- IMPORT THIS

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <main>
      <Container sx={{ mt: 5 }}>

        <header>
          <Typography variant="h4" align="center">
            Dashboard
          </Typography>
          
          {/* ADD THE WIDGET HERE */}
          <QuoteWidget /> 

          <Typography align="center" sx={{ mt: 2 }}>
            Welcome to the Blood Bank Management System!
          </Typography>
        </header>

        <section style={{ marginTop: "30px" }}>
          <nav aria-label="Dashboard Navigation">
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Button variant="contained" sx={{ mx: 2 }} onClick={() => navigate("/donors")}>
                Manage Donors
              </Button>

              <Button variant="contained" sx={{ mx: 2 }} onClick={() => navigate("/requests")}>
                Manage Requests
              </Button>
            </Box>
          </nav>
        </section>

      </Container>
    </main>
  );
};

export default Dashboard;