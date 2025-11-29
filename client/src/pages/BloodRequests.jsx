import React, { useEffect, useState } from "react";
import { getRequests, deleteRequest } from "../api/requestApi";
import { Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const BloodRequest = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const data = await getRequests();
      setRequests(data);
    } catch (err) {
      console.error("Error fetching requests:", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this request?")) return;

    try {
      await deleteRequest(id);
      fetchRequests();
    } catch (err) {
      alert("Failed to delete");
    }
  };

  return (
    <main>
      <Container maxWidth="md" sx={{ mt: 5 }}>
        
        {/* HEADER */}
        <header>
          <Typography variant="h4" align="center">
            Blood Requests
          </Typography>
        </header>

        {/* ACTION SECTION */}
        <section style={{ marginTop: "20px", textAlign: "center" }}>
          <Button
            variant="contained"
            onClick={() => navigate("/add-request")}
            sx={{ mb: 3 }}
          >
            Add New Request
          </Button>
        </section>

        {/* LIST SECTION */}
        <section>
          {requests.length === 0 ? (
            <Typography align="center" sx={{ mt: 3 }}>
              No blood requests found.
            </Typography>
          ) : (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {requests.map((req) => (
                <li
                  key={req._id}
                  style={{
                    background: "#fff",
                    padding: "16px",
                    marginBottom: "12px",
                    borderRadius: "8px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  {/* Request Details Section */}
                  <section>
                    <Typography variant="h6">{req.patientName}</Typography>
                    <Typography>
                      Blood Group: <strong>{req.bloodGroup}</strong>
                    </Typography>
                    <Typography>
                      Units Needed: <strong>{req.units}</strong>
                    </Typography>
                    <Typography>
                      Hospital: <strong>{req.hospital}</strong>
                    </Typography>
                    <Typography>
                      City: <strong>{req.city}</strong>
                    </Typography>
                  </section>

                  {/* ACTION BUTTONS */}
                  <nav style={{ display: "flex", gap: "8px" }}>
                    <Button
                      variant="outlined"
                      onClick={() => navigate(`/edit-request/${req._id}`)}
                    >
                      Edit
                    </Button>

                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(req._id)}
                    >
                      Delete
                    </Button>
                  </nav>
                </li>
              ))}
            </ul>
          )}
        </section>

      </Container>
    </main>
  );
};

export default BloodRequest;
