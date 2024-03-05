import React from 'react'

function Profile() {
  return (
    <div>
    import React from 'react'
function Login() {
  return (
    <div>Login</div>
  )
}
export default Login
const crypto = require('crypto');
// Generate a random string of 64 characters (512 bits) for secret key
const generateSecretKey = () => {
  return crypto.randomBytes(32).toString('hex');
};
// Generate secret key
const secretKey = generateSecretKey();
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const PORT = 3000;
const pool = new Pool({
  user: 'your_username',
  host: 'localhost',
  database: 'your_database_name',
  password: 'your_database_password',
  port: 5432,
});
app.use(bodyParser.json());
// Endpoint for user registration
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  //  to Check if username or password is missing
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }
  try {
    // have it, Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Store user in the database
    await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashedPassword]);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// Endpoint for user login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  // Find the user in the database
  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    const token = jwt.sign({ username: user.username }, secretKey, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
    </div>
  )
}

export default Profile

//Show the detail of the user such username, email, location, event created, event 
//RSVP'd, their current connection, connection request,etc
