jest.mock('../config/db', () => jest.fn());
const request = require('supertest');
const app = require('../server');

describe('Server root route', () => {
  test('GET / should return 200 and contain title', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toMatch(/Blood Bank Backend/);
  }, 10000);
});
