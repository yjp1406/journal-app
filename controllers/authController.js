const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const config = require("../config/config");
const db = require('../config/db');


const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    config.jwtSecret,
    {
      expiresIn: "1h",
    }
  );
};

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findByUsername(username);

    if (!user) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    const token = generateToken(user);
    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ message: "Error during login: " + err.message });
  }
};

const register = async (req, res) => {
  const { username, password, role } = req.body;

  try {
    // Check if the username already exists
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res.status(409).json({ message: "Username already exists" });
    }

    // Create a new user
    const userId = await User.createUser(username, password, role);

    res.status(201).json({ userId, username, role });
  } catch (error) {
    console.error("Error during user registration:", error);
    res.status(500).json({ message: "Failed to register user" });
  }
};

const check = async ( req,res) => {
    const username = req.body.username;
    const query = `SELECT * FROM users`;
    const [rows] = await db.execute(query);
    res.send(rows);
}

module.exports = { login, register, check };
