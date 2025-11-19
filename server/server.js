const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();

const app = express();

// -----------------------------
// ✅ FIXED CORS (MOST IMPORTANT)
// -----------------------------
app.use(
  cors({
    origin: "http://localhost:3000", // your frontend
    methods: "GET,POST,PUT,PATCH,DELETE",
    credentials: true
  })
);

// -----------------------------
// Middleware
// -----------------------------
app.use(morgan('dev'));
app.use(express.json());

// -----------------------------
// Routes
// -----------------------------
const authRoutes = require('./routes/auth');
const donorRoutes = require('./routes/donors');
const bloodRequestRoutes = require('./routes/bloodRequests');

app.use('/api/auth', authRoutes);
app.use('/api/donors', donorRoutes);
app.use('/api/requests', bloodRequestRoutes);

// -----------------------------
// MongoDB Connection
// -----------------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("Error Connecting DB:", err.message));

// -----------------------------
// Basic Test Route
// -----------------------------
app.get('/', (req, res) => {
  res.send("Blood Bank Backend Running");
});

// -----------------------------
// Start Server
// -----------------------------
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
