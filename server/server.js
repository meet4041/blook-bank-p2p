const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config(); // Must be first

const app = express();

// -----------------------------
// ✅ FIXED CORS
// -----------------------------
app.use(
  cors({
    origin: "http://localhost:3000", // your frontend URL
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
// Check if MONGO_URI is loaded
// -----------------------------
if (!process.env.MONGO_URI) {
  console.error("Error: MONGO_URI not found in .env");
  process.exit(1); // Stop server
}

// -----------------------------
// MongoDB Connection
// -----------------------------
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("Error Connecting DB:", err.message));

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
