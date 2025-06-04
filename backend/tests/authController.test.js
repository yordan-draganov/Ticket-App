const { signup, login, verifyToken } = require('../controllers/authController');
const User = require('../models/User');
const httpMocks = require('node-mocks-http');
jest.mock('../models/User');

describe('Auth Controller', () => {
  describe('signup', () => {
    it('should return 400 if email or password is missing', async () => {
      const req = httpMocks.createRequest({ body: {} });
      const res = httpMocks.createResponse();

      await signup(req, res);

      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toHaveProperty('error');
    });

    it('should create user and return token', async () => {
      const req = httpMocks.createRequest({
        body: { email: 'test@example.com', password: '123456' }
      });
      const res = httpMocks.createResponse();

      User.findByEmail.mockResolvedValue(null);
      User.create.mockResolvedValue({ id: 1, email: 'test@example.com', name: 'test' });

      await signup(req, res);

      expect(res.statusCode).toBe(201);
      expect(res._getJSONData()).toHaveProperty('token');
    });
  });

  describe('login', () => {
    it('should return 401 for invalid credentials', async () => {
      const req = httpMocks.createRequest({
        body: { email: 'wrong@example.com', password: 'wrongpass' }
      });
      const res = httpMocks.createResponse();

      User.findByEmail.mockResolvedValue(null);

      await login(req, res);

      expect(res.statusCode).toBe(401);
    });

    it('should login and return token', async () => {
      const req = httpMocks.createRequest({
        body: { email: 'user@example.com', password: 'password' }
      });
      const res = httpMocks.createResponse();

      User.findByEmail.mockResolvedValue({ id: 1, email: 'user@example.com', name: 'User', password: 'hashed' });
      User.verifyPassword = jest.fn().mockResolvedValue(true);
      User.updateLastLogin = jest.fn();

      await login(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toHaveProperty('token');
    });
  });
});
