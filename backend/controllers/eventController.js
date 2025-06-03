const Event = require('../models/Event');

const getAllEvents = async (req, res) => {
  try {
    const { search, category } = req.query;
    
    const filters = {};
    if (search) filters.search = search;
    if (category) filters.category = category;

    const events = await Event.findAll(filters);

    const formattedEvents = events.map(event => ({...event, price: `$${parseFloat(event.price).toFixed(2)}`}));

    res.json(formattedEvents);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getEventById = async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    
    if (isNaN(eventId)) {
      return res.status(400).json({ error: 'Invalid event ID' });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const formattedEvent = {...event, price: `$${parseFloat(event.price).toFixed(2)}`};

    res.json(formattedEvent);
  } catch (error) {
    console.error('Get event by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Event.getCategories();
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createEvent = async (req, res) => {
  try {
    const eventData = req.body;
    
    const requiredFields = ['title', 'date', 'location', 'price', 'category'];
    for (const field of requiredFields) {
      if (!eventData[field]) {
        return res.status(400).json({ error: `${field} is required` });
      }
    }

    if (!eventData.available_tickets) {
      eventData.available_tickets = eventData.total_tickets || 100;
    }
    if (!eventData.total_tickets) {
      eventData.total_tickets = eventData.available_tickets;
    }

    const newEvent = await Event.create(eventData);
    
    res.status(201).json({
      message: 'Event created successfully',
      event: newEvent
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {getAllEvents, getEventById, getCategories, createEvent};