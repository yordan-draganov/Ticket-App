const Ticket = require('../models/Ticket');
const Event = require('../models/Event');
const pool = require('../config/database');

const purchaseTicket = async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { eventId, quantity, paymentDetails } = req.body;
    const userId = req.user.userId;

    if (!eventId || !quantity || quantity <= 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Invalid event ID or quantity' });
    }

    if (!paymentDetails || !paymentDetails.cardNumber || !paymentDetails.name) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Invalid payment details' });
    }

    const eventQuery = 'SELECT * FROM events WHERE id = $1 FOR UPDATE';
    const eventResult = await client.query(eventQuery, [eventId]);
    const event = eventResult.rows[0];

    if (!event) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Event not found' });
    }

    if (event.available_tickets < quantity) {
      await client.query('ROLLBACK');
      return res.status(400).json({ 
        error: `Only ${event.available_tickets} tickets available` 
      });
    }

    const pricePerTicket = parseFloat(event.price);
    const totalPrice = pricePerTicket * quantity;

    const ticketId = Ticket.generateTicketId();
    const ticketQuery = `
      INSERT INTO tickets (
        id, user_id, event_id, quantity, 
        price_per_ticket, total_price, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    
    const ticketValues = [
      ticketId, userId, eventId, quantity,
      pricePerTicket, totalPrice, 'confirmed'
    ];

    const ticketResult = await client.query(ticketQuery, ticketValues);
    const newTicket = ticketResult.rows[0];

    const updateEventQuery = `
      UPDATE events 
      SET available_tickets = available_tickets - $1,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;
    
    await client.query(updateEventQuery, [quantity, eventId]);

    await client.query('COMMIT');

    const response = {
      id: newTicket.id,
      userId: newTicket.user_id,
      eventId: newTicket.event_id,
      eventTitle: event.title,
      eventDate: event.date,
      eventLocation: event.location,
      eventImage: event.image,
      quantity: newTicket.quantity,
      pricePerTicket: newTicket.price_per_ticket,
      totalPrice: newTicket.total_price,
      purchaseDate: newTicket.created_at,
      status: newTicket.status
    };

    res.status(201).json({
      message: 'Tickets purchased successfully',
      ticket: response
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Purchase ticket error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
};

const getUserTickets = async (req, res) => {
  try {
    const userId = req.user.userId;
    const tickets = await Ticket.findByUserId(userId);

    const formattedTickets = tickets.map(ticket => ({
      id: ticket.id,
      eventId: ticket.event_id,
      eventTitle: ticket.event_title,
      date: ticket.event_date,
      location: ticket.event_location,
      quantity: ticket.quantity,
      purchaseDate: new Date(ticket.created_at).toLocaleDateString(),
      price: `$${parseFloat(ticket.total_price).toFixed(2)}`,
      image: ticket.event_image,
      status: ticket.status
    }));

    res.json(formattedTickets);
  } catch (error) {
    console.error('Get user tickets error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getTicketDetails = async (req, res) => {
  try {
    const ticketId = req.params.ticketId;
    const userId = req.user.userId;

    const ticket = await Ticket.findByIdAndUserId(ticketId, userId);
    
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const formattedTicket = {
      id: ticket.id,
      eventId: ticket.event_id,
      eventTitle: ticket.event_title,
      eventDate: ticket.event_date,
      eventLocation: ticket.event_location,
      eventOrganizer: ticket.event_organizer,
      startTime: ticket.start_time,
      endTime: ticket.end_time,
      quantity: ticket.quantity,
      pricePerTicket: `${parseFloat(ticket.price_per_ticket).toFixed(2)}`,
      totalPrice: `${parseFloat(ticket.total_price).toFixed(2)}`,
      purchaseDate: new Date(ticket.created_at).toLocaleDateString(),
      status: ticket.status,
      image: ticket.event_image
    };

    res.json(formattedTicket);
  } catch (error) {
    console.error('Get ticket details error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {purchaseTicket,getUserTickets,getTicketDetails};