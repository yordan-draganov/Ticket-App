const express = require('express');
const router = express.Router();
const { 
  purchaseTicket, 
  getUserTickets, 
  getTicketDetails 
} = require('../controllers/ticketController');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

router.post('/purchase', purchaseTicket);

router.get('/my-tickets', getUserTickets);

router.get('/:ticketId', getTicketDetails);


module.exports = router;