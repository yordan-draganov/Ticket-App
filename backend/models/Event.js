const pool = require('../config/database');

class Event {
  static async findAll(filters = {}) {
    try {
      let query = 'SELECT * FROM events WHERE 1=1';
      const values = [];
      let paramCount = 0;

      if (filters.search) {
        paramCount++;
        query += ` AND (
          LOWER(title) LIKE $${paramCount} OR 
          LOWER(location) LIKE $${paramCount} OR 
          LOWER(date) LIKE $${paramCount} OR 
          LOWER(category) LIKE $${paramCount} OR 
          LOWER(description) LIKE $${paramCount}
        )`;
        values.push(`%${filters.search.toLowerCase()}%`);
      }

      if (filters.category && filters.category !== 'all') {
        paramCount++;
        query += ` AND LOWER(category) = $${paramCount}`;
        values.push(filters.category.toLowerCase());
      }

      query += ' ORDER BY created_at DESC';

      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const query = 'SELECT * FROM events WHERE id = $1';
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async updateAvailableTickets(eventId, quantity) {
    try {
      const query = `
        UPDATE events 
        SET available_tickets = available_tickets - $1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $2 AND available_tickets >= $1
        RETURNING *
      `;
      
      const result = await pool.query(query, [quantity, eventId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async getCategories() {
    try {
      const query = 'SELECT DISTINCT category FROM events ORDER BY category';
      const result = await pool.query(query);
      return result.rows.map(row => row.category);
    } catch (error) {
      throw error;
    }
  }

  static async create(eventData) {
    try {
      const {
        title, date, location, description, long_description,
        price, category, image, organizer, start_time, end_time,
        available_tickets, total_tickets
      } = eventData;

      const query = `
        INSERT INTO events (
          title, date, location, description, long_description,
          price, category, image, organizer, start_time, end_time,
          available_tickets, total_tickets
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING *
      `;

      const values = [
        title, date, location, description, long_description,
        price, category, image, organizer, start_time, end_time,
        available_tickets, total_tickets
      ];

      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Event;