const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const BloodRequest = require('../models/BloodRequest');
const jwt = require('jsonwebtoken');

let userToken, hospitalToken, adminToken;
let userId, hospitalId, adminId;

beforeAll(async () => {
  if (!process.env.MONGO_URI_TEST) {
    throw new Error('MONGO_URI_TEST is not defined in your environment');
  }

  await mongoose.connect(process.env.MONGO_URI_TEST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  await User.deleteMany({});
  await BloodRequest.deleteMany({});

  const user = await User.create({ 
    name: 'BloodRequest User', 
    email: 'bloodrequest-user@test.com',
    password: 'password', 
    role: 'user' 
  });
  const hospital = await User.create({ 
    name: 'BloodRequest Hospital', 
    email: 'bloodrequest-hospital@test.com',
    password: 'password', 
    role: 'hospital' 
  });
  const admin = await User.create({ 
    name: 'BloodRequest Admin', 
    email: 'bloodrequest-admin@test.com',
    password: 'password', 
    role: 'admin' 
  });

  userId = user._id;
  hospitalId = hospital._id;
  adminId = admin._id;

  userToken = jwt.sign({ id: user._id, role: 'user' }, process.env.JWT_SECRET);
  hospitalToken = jwt.sign({ id: hospital._id, role: 'hospital' }, process.env.JWT_SECRET);
  adminToken = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET);
});

afterAll(async () => {
  await User.deleteMany({});
  await BloodRequest.deleteMany({});
  await mongoose.connection.close();
});

describe('BloodRequest API', () => {
  let requestId;

  beforeEach(async () => {
    // Create a fresh blood request before each test
    const bloodRequest = await BloodRequest.create({
      patientName: 'John Doe',
      bloodGroup: 'A+',
      unitsRequired: 2,
      hospital: 'City Hospital',
      city: 'Test City',
      status: 'pending',
      requestedBy: userId
    });
    requestId = bloodRequest._id.toString();
  });

  test('User creates a blood request', async () => {
    const res = await request(app)
      .post('/api/requests')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        patientName: 'New Patient',
        bloodGroup: 'B+',
        unitsRequired: 1,
        hospital: 'City Hospital',
        city: 'Test City'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.status).toBe('pending');
  });

  test('User cannot update status', async () => {
    const res = await request(app)
      .patch(`/api/requests/${requestId}/status`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ status: 'approved' });

    expect(res.statusCode).toBe(403);
  });

  test('Hospital can update status', async () => {
    const res = await request(app)
      .patch(`/api/requests/${requestId}/status`)
      .set('Authorization', `Bearer ${hospitalToken}`)
      .send({ status: 'approved' });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.status).toBe('approved');
  });

  test('Admin can update status', async () => {
    const res = await request(app)
      .patch(`/api/requests/${requestId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'fulfilled' });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.status).toBe('fulfilled');
  });

  test('Another user cannot update blood request', async () => {
    const otherUser = await User.create({ 
      name: 'Other User', 
      email: 'bloodrequest-other@test.com',
      password: 'password', 
      role: 'user' 
    });
    const token = jwt.sign({ id: otherUser._id, role: 'user' }, process.env.JWT_SECRET);

    const res = await request(app)
      .put(`/api/requests/${requestId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ patientName: 'Changed Name' });

    expect(res.statusCode).toBe(403);
  });

  test('Owner can update own blood request', async () => {
    const res = await request(app)
      .put(`/api/requests/${requestId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ unitsRequired: 3 });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.unitsRequired).toBe(3);
  });

  test('Admin can delete blood request', async () => {
    const res = await request(app)
      .delete(`/api/requests/${requestId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(204);
  });
});