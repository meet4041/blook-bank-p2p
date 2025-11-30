const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Donor = require('../models/Donor');
const BloodRequest = require('../models/BloodRequest');
const jwt = require('jsonwebtoken');

let hospitalToken, adminToken, userToken;
let hospitalId, adminId, userId;

beforeAll(async () => {
  const TEST_DB_URI = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/bloodbank_test';
  
  await mongoose.connect(TEST_DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  await User.deleteMany({});
  await Donor.deleteMany({});
  await BloodRequest.deleteMany({});

  const hospital = await User.create({ 
    name: 'Dashboard Hospital', 
    email: 'dashboard-hospital@test.com', 
    password: 'password', 
    role: 'hospital' 
  });
  
  const admin = await User.create({ 
    name: 'Dashboard Admin', 
    email: 'dashboard-admin@test.com', 
    password: 'password', 
    role: 'admin' 
  });

  const user = await User.create({ 
    name: 'Dashboard User', 
    email: 'dashboard-user@test.com', 
    password: 'password', 
    role: 'user' 
  });

  hospitalId = hospital._id;
  adminId = admin._id;
  userId = user._id;

  hospitalToken = jwt.sign({ id: hospitalId, role: 'hospital' }, process.env.JWT_SECRET);
  adminToken = jwt.sign({ id: adminId, role: 'admin' }, process.env.JWT_SECRET);
  userToken = jwt.sign({ id: userId, role: 'user' }, process.env.JWT_SECRET);

  await createTestData();
});

afterAll(async () => {
  await mongoose.connection.close();
});

const createTestData = async () => {
  await Donor.create([
    {
      name: 'Verified Donor 1',
      bloodGroup: 'A+',
      city: 'City X',
      phone: '1111111111',
      addedBy: hospitalId,
      verified: true,
      verifiedBy: hospitalId,
      verifiedAt: new Date()
    },
    {
      name: 'Verified Donor 2',
      bloodGroup: 'B+',
      city: 'City Y',
      phone: '2222222222',
      addedBy: hospitalId,
      verified: true,
      verifiedBy: hospitalId,
      verifiedAt: new Date()
    },
    {
      name: 'Unverified Donor',
      bloodGroup: 'O+',
      city: 'City Z',
      phone: '3333333333',
      addedBy: hospitalId,
      verified: false
    }
  ]);

  await BloodRequest.create([
    {
      patientName: 'Patient 1',
      bloodGroup: 'A+',
      city: 'City X',
      unitsRequired: 2,
      hospital: 'City Hospital',
      status: 'pending',
      requestedBy: hospitalId
    },
    {
      patientName: 'Patient 2',
      bloodGroup: 'B+',
      city: 'City Y',
      unitsRequired: 1,
      hospital: 'City Hospital',
      status: 'approved',
      requestedBy: hospitalId
    },
    {
      patientName: 'Patient 3',
      bloodGroup: 'O+',
      city: 'City Z',
      unitsRequired: 3,
      hospital: 'City Hospital',
      status: 'pending',
      requestedBy: hospitalId
    }
  ]);
};

describe('Dashboard Integration Tests', () => {
  test('Admin dashboard returns correct global counts', async () => {
    const res = await request(app)
      .get('/api/dashboard')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.verifiedDonorsCount).toBe(2);
    expect(res.body.data.pendingRequestsCount).toBe(2);
    expect(res.body.data.role).toBe('admin');
    expect(res.body.data.totalHospitals).toBe(1);
  });

  test('Hospital dashboard returns hospital-specific counts', async () => {
    const res = await request(app)
      .get('/api/dashboard')
      .set('Authorization', `Bearer ${hospitalToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.verifiedDonorsCount).toBe(2);
    expect(res.body.data.pendingRequestsCount).toBe(2);
    expect(res.body.data.role).toBe('hospital');
    expect(res.body.data.myTotalDonors).toBe(3);
  });

  test('User dashboard returns basic counts', async () => {
    const res = await request(app)
      .get('/api/dashboard')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.verifiedDonorsCount).toBe(2);
    expect(res.body.data.pendingRequestsCount).toBe(2);
    expect(res.body.data.role).toBe('user');
  });

  test('Dashboard access without token should fail', async () => {
    const res = await request(app).get('/api/dashboard');
    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  test('Dashboard with invalid token should fail', async () => {
    const res = await request(app)
      .get('/api/dashboard')
      .set('Authorization', 'Bearer invalidtoken');

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });
});