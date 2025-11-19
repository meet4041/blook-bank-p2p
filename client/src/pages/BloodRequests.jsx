import React, { useEffect, useState } from "react";
import { getRequests, deleteRequest, updateStatus } from "../api/requestApi";
import { Button, Container, Typography, Card, CardContent, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const BloodRequests = () => {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  const fetchRequests = async () => {
    try {
      const res = await getRequests();
      setRequests(res.data);
    } catch (err) {
      alert("Failed to load requests");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this request?")) return;
    try {
      await deleteRequest(id);
      fetchRequests();
    } catch (err) {
      alert("Failed to delete request");
    }
  };

  const handleStatus = async (id, status) => {
    try {
      await updateStatus(id, { status });
      fetchRequests();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" align="center">Blood Requests</Typography>

      <Button
        variant="contained"
        sx={{ my: 3 }}
        onClick={() => navigate("/add-request")}
      >
        Add Request
      </Button>

      {requests.map((req) => (
        <Card key={req._id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">{req.patientName}</Typography>
            <Typography>Blood Group: {req.bloodGroup}</Typography>
            <Typography>Units: {req.unitsRequired}</Typography>
            <Typography>Hospital: {req.hospital}</Typography>
            <Typography>City: {req.city}</Typography>
            <Typography>Status: {req.status}</Typography>

            <Box sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                sx={{ mr: 1 }}
                onClick={() => handleStatus(req._id, "approved")}
              >
                Approve
              </Button>

              <Button
                variant="outlined"
                color="warning"
                sx={{ mr: 1 }}
                onClick={() => handleStatus(req._id, "rejected")}
              >
                Reject
              </Button>

              <Button
                variant="contained"
                color="error"
                onClick={() => handleDelete(req._id)}
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

export default BloodRequests;
