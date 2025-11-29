import React, { useEffect, useState } from "react";
import { getDonors, deleteDonor } from "../api/donorApi";
import {
  Button,
  Container,
  Typography,
  Box,
  Card,
  CardContent
} from "@mui/material";
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
    <main>
      <Container sx={{ mt: 5 }}>

        {/* PAGE HEADER */}
        <header>
          <Typography variant="h4" align="center">
            Donors
          </Typography>
        </header>

        {/* ACTIONS SECTION */}
        <section style={{ marginTop: "20px", marginBottom: "20px" }}>
          <nav aria-label="Add Donor">
            <Button
              variant="contained"
              onClick={() => navigate("/add-donor")}
            >
              Add Donor
            </Button>
          </nav>
        </section>

        {/* DONOR LIST SECTION */}
        <section>
          {donors.length === 0 ? (
            <Typography align="center" sx={{ mt: 3 }}>
              No donors found.
            </Typography>
          ) : (
            donors.map((d) => (
              <article key={d._id} style={{ marginBottom: "16px" }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{d.name}</Typography>
                    <Typography>Blood Group: {d.bloodGroup}</Typography>
                    <Typography>City: {d.city}</Typography>
                    <Typography>Phone: {d.phone}</Typography>

                    {/* Donor Actions */}
                    <nav style={{ marginTop: "15px" }}>
                      <Box>
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
                    </nav>
                  </CardContent>
                </Card>
              </article>
            ))
          )}
        </section>

      </Container>
    </main>
  );
};

export default Donors;
