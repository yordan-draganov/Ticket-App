const { getUserTickets } = require('../controllers/ticketController');
const Ticket = require('../models/Ticket');
const httpMocks = require('node-mocks-http');
jest.mock('../models/Ticket');

describe('Ticket Controller', () => {
  it('should return list of tickets for user', async () => {
    const req = httpMocks.createRequest({ user: { userId: 1 } });
    const res = httpMocks.createResponse();

    Ticket.findByUserId.mockResolvedValue([
      {
        id: 1,
        event_id: 1,
        event_title: 'Event 1',
        event_date: '2025-06-01',
        event_location: 'Online',
        quantity: 2,
        created_at: new Date(),
        total_price: 50.00,
        event_image: 'img.png',
        status: 'confirmed'
      }
    ]);

    await getUserTickets(req, res);

    expect(res.statusCode).toBe(200);
    const data = res._getJSONData();
    expect(data).toHaveLength(1);
    expect(data[0].eventTitle).toBe('Event 1');
  });
});
