const { getAllEvents, getEventById, createEvent } = require('../controllers/eventController');
const Event = require('../models/Event');
const httpMocks = require('node-mocks-http');
jest.mock('../models/Event');

describe('Event Controller', () => {
  describe('getAllEvents', () => {
    it('should return a list of events', async () => {
      const req = httpMocks.createRequest({ query: {} });
      const res = httpMocks.createResponse();

      Event.findAll.mockResolvedValue([
        { id: 1, title: 'Event', price: 10 }
      ]);

      await getAllEvents(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toHaveLength(1);
    });
  });

  describe('getEventById', () => {
    it('should return 404 if event not found', async () => {
      const req = httpMocks.createRequest({ params: { id: 999 } });
      const res = httpMocks.createResponse();

      Event.findById.mockResolvedValue(null);

      await getEventById(req, res);

      expect(res.statusCode).toBe(404);
    });

    it('should return event details', async () => {
      const req = httpMocks.createRequest({ params: { id: 1 } });
      const res = httpMocks.createResponse();

      Event.findById.mockResolvedValue({ id: 1, title: 'Concert', price: 20 });

      await getEventById(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData().title).toBe('Concert');
    });
  });

  describe('createEvent', () => {
    it('should return 400 if required field is missing', async () => {
      const req = httpMocks.createRequest({ body: {} });
      const res = httpMocks.createResponse();

      await createEvent(req, res);

      expect(res.statusCode).toBe(400);
    });

    it('should create and return new event', async () => {
      const req = httpMocks.createRequest({
        body: {
          title: 'Conference',
          date: '2025-06-30',
          location: 'NYC',
          price: '25.00',
          category: 'Tech'
        }
      });
      const res = httpMocks.createResponse();

      Event.create.mockResolvedValue({ id: 10, title: 'Conference' });

      await createEvent(req, res);

      expect(res.statusCode).toBe(201);
      expect(res._getJSONData().event.title).toBe('Conference');
    });
  });
});
