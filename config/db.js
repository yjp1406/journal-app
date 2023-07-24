require('dotenv').config();
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  connectionLimit: 10,
  waitForConnections: true,
});

const checkDatabaseConnection = () => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to the database:', err.message);
      return;
    }

    console.log('Connected to the database!');

    // Release the connection back to the pool
    connection.release();
  });
};

checkDatabaseConnection(); // Check database connection at startup

module.exports = pool.promise();