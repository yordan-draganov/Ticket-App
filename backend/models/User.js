const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async create({ email, password, name }) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const query = `
        INSERT INTO users (email, password, name)
        VALUES ($1, $2, $3)
        RETURNING id, email, name, created_at
      `;
      
      const values = [email, hashedPassword, name];
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      const query = 'SELECT * FROM users WHERE email = $1';
      const result = await pool.query(query, [email]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const query = 'SELECT id, email, name, created_at FROM users WHERE id = $1';
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static async updateLastLogin(userId) {
    try {
      const query = 'UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = $1';
      await pool.query(query, [userId]);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;