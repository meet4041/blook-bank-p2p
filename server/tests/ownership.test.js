// server/tests/ownership.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const server = require('../server'); // Express app exported from server.js

let tokenA, tokenB, tokenAdmin;
let requestIdOfA;

beforeAll(async () => {
  jest.setTimeout(30000);

  // REGISTER USER A
  const resA = await request(server)
    .post('/api/auth/register')
    .send({
      name: 'User A',
      email: 'userA@test.com',
      password: '123456',
      role: 'user'
    });
  
  // FIX: Extract token from data object
  tokenA = resA.body.data.token;
  console.log('User A token extracted:', !!tokenA);

  // REGISTER USER B
  const resB = await request(server)
    .post('/api/auth/register')
    .send({
      name: 'User B',
      email: 'userB@test.com',
      password: '123456',
      role: 'user'
    });
  
  // FIX: Extract token from data object
  tokenB = resB.body.data.token;
  console.log('User B token extracted:', !!tokenB);

  // REGISTER ADMIN
  const resAdmin = await request(server)
    .post('/api/auth/register')
    .send({
      name: 'Admin',
      email: 'admin@test.com',
      password: 'admin123',
      role: 'admin'
    });
  
  // FIX: Extract token from data object
  tokenAdmin = resAdmin.body.data.token;
  console.log('Admin token extracted:', !!tokenAdmin);

  // USER A CREATES A VALID BLOOD REQUEST
  const reqA = await request(server)
    .post('/api/requests')
    .set('Authorization', `Bearer ${tokenA}`)
    .send({
      patientName: 'Test Patient',
      bloodGroup: 'A+',
      unitsRequired: 2,
      hospital: 'Test Hospital',
      city: 'Test City'
    });

  // DEBUG: Log the response for troubleshooting
  console.log('Blood request creation response:', {
    status: reqA.statusCode,
    body: reqA.body
  });

  // VERIFY SUCCESS
  expect(reqA.statusCode).toBe(201);
  expect(reqA.body.data).toBeDefined();

  requestIdOfA = reqA.body.data._id;
  console.log('Request ID created:', requestIdOfA);
});

afterAll(async () => {
  await mongoose.connection.close();
});

// ---------------------------------------------------------------------

describe('Ownership enforcement', () => {
  test("User B cannot delete User A's request", async () => {
    const res = await request(server)
      .delete(`/api/requests/${requestIdOfA}`)
      .set('Authorization', `Bearer ${tokenB}`);

    expect(res.status).toBe(403);
  });

  test('Admin CAN delete User A’s request', async () => {
    const res = await request(server)
      .delete(`/api/requests/${requestIdOfA}`)
      .set('Authorization', `Bearer ${tokenAdmin}`);

    expect([200, 204]).toContain(res.status);
  });
});