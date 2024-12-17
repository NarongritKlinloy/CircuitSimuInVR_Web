import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cors());

// MySQL Database Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'boomza532', // รหัสผ่านของคุณ
  database: 'circuit_simulator_db'
});

db.connect(err => {
  if (err) throw err;
  console.log('MySQL Connected...');
});

// Root Endpoint
app.get('/', (req, res) => {
  res.send('Backend Server is running...');
});

// API สำหรับ Sign Up
app.post('/api/signup', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and Password are required' });
  }

  const sql = 'INSERT INTO user (name, role_id) VALUES (?, 3)';
  db.query(sql, [email, password], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      return res.status(500).json({ message: 'Failed to save user' });
    }
    res.status(200).json({ message: 'User registered successfully' });
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
