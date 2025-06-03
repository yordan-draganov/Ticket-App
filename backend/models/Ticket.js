const pool = require('../config/database');

class Ticket {
  static generateTicketId() {
    return 'T' + Math.random().toString(36).substr(2, 9).toUpperCase();
  }

  static async create(ticketData) {
    try {
      const {
        userId, eventId, quantity, pricePerTicket, totalPrice
      } = ticketData;

      const ticketId = this.generateTicketId();

      const query = `
        INSERT INTO tickets (
          id, user_id, event_id, quantity, 
          price_per_ticket, total_price, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `;

      const values = [
        ticketId, userId, eventId, quantity,
        pricePerTicket, totalPrice, 'confirmed'
      ];

      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findByUserId(userId) {
    try {
      const query = `
        SELECT 
          t.*,
          e.title as event_title,
          e.date as event_date,
          e.location as event_location,
          e.image as event_image
        FROM tickets t
        JOIN events e ON t.event_id = e.id
        WHERE t.user_id = $1
        ORDER BY t.created_at DESC
      `;

      const result = await pool.query(query, [userId]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async findByIdAndUserId(ticketId, userId) {
    try {
      const query = `
        SELECT 
          t.*,
          e.title as event_title,
          e.date as event_date,
          e.location as event_location,
          e.image as event_image,
          e.organizer as event_organizer,
          e.start_time,
          e.end_time
        FROM tickets t
        JOIN events e ON t.event_id = e.id
        WHERE t.id = $1 AND t.user_id = $2
      `;

      const result = await pool.query(query, [ticketId, userId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async updateStatus(ticketId, status) {
    try {
      const query = `
        UPDATE tickets 
        SET status = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING *
      `;

      const result = await pool.query(query, [status, ticketId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findById(ticketId) {
    try {
      const query = 'SELECT * FROM tickets WHERE id = $1';
      const result = await pool.query(query, [ticketId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Ticket;