const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
require('dotenv').config();


// -------------------------------------------
// APP INIT
// -------------------------------------------
const app = express();

// -------------------------------------------
// CORS CONFIGURATION
// -------------------------------------------
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:3000',
  'http://localhost:3001'
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow Postman or server-to-server
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('CORS policy: Origin not allowed'));
    },
    methods: "GET,POST,PUT,PATCH,DELETE",
    credentials: true
  })
);

app.use('/api/dashboard', require('./routes/dashboard'));

// -------------------------------------------
// SECURITY & RATE LIMIT
// -------------------------------------------
app.use(helmet());

const limiter = rateLimit({ windowMs: 1 * 60 * 1000, max: 100 });
app.use(limiter);

// -------------------------------------------
// LOGGING & JSON PARSING
// -------------------------------------------
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// -------------------------------------------
// STATIC FILES & VIEWS
// -------------------------------------------
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// -------------------------------------------
// DATABASE CONNECTION
// -------------------------------------------
const connectDB = require('./config/db');

if (!process.env.MONGO_URI) {
  console.error("Error: MONGO_URI not found in .env");
  process.exit(1);
}

connectDB();

// -------------------------------------------
// API ROUTES
// -------------------------------------------
const authRoutes = require('./routes/auth');
const donorRoutes = require('./routes/donors');
const bloodRequestRoutes = require('./routes/bloodRequests');
const dashboardRoutes = require('./routes/dashboard');

app.use('/api/auth', authRoutes);
app.use('/api/donors', donorRoutes);
app.use('/api/requests', bloodRequestRoutes);
app.use('/api/dashboard', dashboardRoutes);

// -------------------------------------------
// HOME ROUTE (Optional)
app.get('/', (req, res) => {
  res.render('index', {
    title: 'Blood Bank Backend',
    year: new Date().getFullYear()
  });
});

app.get('/dashboard', async (req, res) => {
  const Donor = require('./models/Donor');
  const BloodRequest = require('./models/BloodRequest');

  const totalDonors = await Donor.countDocuments();
  const verifiedDonors = await Donor.countDocuments({ verified: true });
  const pendingRequests = await BloodRequest.countDocuments({ status: 'pending' });
  const fulfilledRequests = await BloodRequest.countDocuments({ status: 'fulfilled' });

  res.render('dashboard', { totalDonors, verifiedDonors, pendingRequests, fulfilledRequests });
});


// -------------------------------------------
// SERVE REACT BUILD (PRODUCTION)
const clientBuildPath = path.join(__dirname, '..', 'client', 'build');

if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

// -------------------------------------------
// START SERVER
// -------------------------------------------
const PORT = process.env.PORT || 8000;

if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
