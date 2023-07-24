const db = require('../config/db');
const bcrypt = require('bcryptjs');
const queries = require('../config/queries');

class User {
  static async findByUsername(username) {
    const [rows] = await db.execute(queries.findByUsername, [username]);
    return rows[0] || null;
  }

  static async createUser(username, password, role) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.execute(
      queries.createUser,
      [username, hashedPassword, role]
    );
    return result.insertId;
  }
}

module.exports = User;
