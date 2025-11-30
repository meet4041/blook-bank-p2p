const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Donor = require('../models/Donor');
const jwt = require('jsonwebtoken');

let userToken, hospitalToken, adminToken;
let userId, hospitalId, adminId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI_TEST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  await User.deleteMany({});
  await Donor.deleteMany({});

  const user = await User.create({ 
    name: 'Donor User', 
    email: 'donor-user@test.com',
    password: 'password', 
    role: 'user' 
  });
  const hospital = await User.create({ 
    name: 'Donor Hospital', 
    email: 'donor-hospital@test.com',
    password: 'password', 
    role: 'hospital' 
  });
  const admin = await User.create({ 
    name: 'Donor Admin', 
    email: 'donor-admin@test.com',
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
  await Donor.deleteMany({});
  await mongoose.connection.close();
});

describe('Donor API', () => {
  let userDonorId, hospitalDonorId;

  beforeEach(async () => {
    const hospitalDonorRes = await request(app)
      .post('/api/donors')
      .set('Authorization', `Bearer ${hospitalToken}`)
      .send({
        name: 'Hospital Donor',
        bloodGroup: 'B+',
        phone: '9876543210',
        city: 'City X',
      });
    hospitalDonorId = hospitalDonorRes.body.data._id;

    const userDonorRes = await request(app)
      .post('/api/donors')
      .set('Authorization', `Bearer ${hospitalToken}`)
      .send({
        name: 'User Donor',
        bloodGroup: 'A+',
        phone: '1234567890',
        city: 'Test City',
        addedBy: userId
      });
    userDonorId = userDonorRes.body.data._id;
  });

  test('Hospital creates donor → should be auto-verified', async () => {
    const res = await request(app)
      .post('/api/donors')
      .set('Authorization', `Bearer ${hospitalToken}`)
      .send({
        name: 'Another Hospital Donor',
        bloodGroup: 'O+',
        phone: '5555555555',
        city: 'City Y',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.verified).toBe(true);
  });

  test('Hospital verifies a donor', async () => {
    const res = await request(app)
      .patch(`/api/donors/${userDonorId}/verify`)
      .set('Authorization', `Bearer ${hospitalToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.verified).toBe(true);
  });

  test('User cannot verify donor', async () => {
    const res = await request(app)
      .patch(`/api/donors/${hospitalDonorId}/verify`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(403);
  });

  test('User updates own donor → cannot change verified field', async () => {
    await request(app)
      .patch(`/api/donors/${userDonorId}/verify`)
      .set('Authorization', `Bearer ${hospitalToken}`);

    const res = await request(app)
      .put(`/api/donors/${userDonorId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ city: 'New City', verified: false });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.city).toBe('New City');
    expect(res.body.data.verified).toBe(true); 
  });

  test('User patch own donor → partial update', async () => {
    await request(app)
      .patch(`/api/donors/${userDonorId}/verify`)
      .set('Authorization', `Bearer ${hospitalToken}`);

    const res = await request(app)
      .patch(`/api/donors/${userDonorId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ phone: '9999999999', verified: false });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.phone).toBe('9999999999');
    expect(res.body.data.verified).toBe(true); 
  });

  test('Another user cannot update donor', async () => {
    const anotherUser = await User.create({ 
      name: 'Other Donor User', 
      email: 'donor-other@test.com',
      password: 'password', 
      role: 'user' 
    });
    const token = jwt.sign({ id: anotherUser._id, role: 'user' }, process.env.JWT_SECRET);

    const res = await request(app)
      .put(`/api/donors/${userDonorId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ city: 'City X' });

    expect(res.statusCode).toBe(403);
  });

  test('Admin can delete donor', async () => {
    const res = await request(app)
      .delete(`/api/donors/${userDonorId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(204);
  });
});