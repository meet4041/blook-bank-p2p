import React, { useEffect, useState } from "react";
import { getDonors, deleteDonor } from "../api/donorApi";
import { Button, Container, Typography, Box, Card, CardContent } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Donors = () => {
  const [donors, setDonors] = useState([]);
  const navigate = useNavigate();

  const fetchDonors = async () => {
    try {
      const res = await getDonors();
      setDonors(res.data);
    } catch (err) {
      alert("Error fetching donors");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await deleteDonor(id);
      fetchDonors();
    } catch (err) {
      alert("Failed to delete donor");
    }
  };

  useEffect(() => {
    fetchDonors();
  }, []);

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" align="center">Donors</Typography>

      <Button
        variant="contained"
        sx={{ mt: 2, mb: 3 }}
        onClick={() => navigate("/add-donor")}
      >
        Add Donor
      </Button>

      {donors.map((d) => (
        <Card key={d._id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">{d.name}</Typography>
            <Typography>Blood Group: {d.bloodGroup}</Typography>
            <Typography>City: {d.city}</Typography>
            <Typography>Phone: {d.phone}</Typography>

            <Box sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                onClick={() => navigate(`/edit-donor/${d._id}`)}
                sx={{ mr: 1 }}
              >
                Edit
              </Button>

              <Button
                variant="contained"
                color="error"
                onClick={() => handleDelete(d._id)}
              >
                Delete
              </Button>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
};

export default Donors;
