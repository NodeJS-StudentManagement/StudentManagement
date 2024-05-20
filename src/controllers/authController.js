require("dotenv").config();
const { pool } = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  const getUserByUsername = "SELECT * FROM users WHERE username = $1";
  const query =
    "INSERT INTO users (username, password, created_at, updated_at) VALUES ($1, $2, $3, $4) RETURNING *";
  try {
    const { username, password } = req.body;
    const isUserExist = await pool.query(getUserByUsername, [username]);
    if (isUserExist.rowCount !== 0) {
      return res.status(404).json({
        message: `User with username ${username} already exists`,
        isSuccess: false,
      });
    }

    const currentTime = new Date().toISOString();

    const saltRound = 5;
    const hashedPassword = await bcrypt.hash(password, saltRound);

    const result = await pool.query(query, [
      username,
      hashedPassword,
      currentTime,
      currentTime,
    ]);

    res.status(201).json({
      Data: { created_at: result.rows[0].created_at },
      message: "User registered successfully",
      isSuccess: true,
    });
  } catch (err) {
    res.status(500).json({ message: err.message, isSuccess: false });
    console.log(err);
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const query = "SELECT * FROM users WHERE username = $1";
    const userResult = await pool.query(query, [username]);

    if (userResult.rowCount === 0) {
      return res
        .status(404)
        .json({ message: "User not found", isSuccess: false });
    }

    const user = userResult.rows[0];

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res
        .status(401)
        .json({ message: "Invalid password", isSuccess: false });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const expireTime = new Date(Date.now() + 60 * 60 * 1000).toLocaleString(
      "tr-TR",
      {
        timeZone: "Europe/Istanbul",
      }
    );

    res.status(200).json({
      token,
      expireTime,
      message: "Login successful",
      isSuccess: true,
    });
  } catch (err) {
    res.status(500).json({ message: err.message, isSuccess: false });
    console.log(err);
  }
};

module.exports = { registerUser, login };
