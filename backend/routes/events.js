const express = require('express');
const router = express.Router();
const { 
  getAllEvents, 
  getEventById, 
  getCategories, 
  createEvent 
} = require('../controllers/eventController');
const { authenticateToken } = require('../middleware/auth');

router.get('/', getAllEvents);

router.get('/:id', getEventById);

router.get('/categories', getCategories);

router.post('/', authenticateToken, createEvent);

module.exports = router;