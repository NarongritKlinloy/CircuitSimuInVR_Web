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

// API สำหรับ Google Login - บันทึกผู้ใช้และตรวจสอบ Role
app.post('/api/google-login', (req, res) => {
  const { email, name, picture } = req.body;

  // ตรวจสอบ Role โดยเช็คว่าหน้า @ เป็นตัวเลข 8 หลัก (Student) หรือไม่
  const isStudent = /^\d{8}@kmitl.ac.th$/.test(email);
  const role = isStudent ? 'Student' : 'Teacher';

  // Query: บันทึกหรืออัปเดตข้อมูลผู้ใช้
  const sql = `
    INSERT INTO user (name, role_id, picture)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE role_id = VALUES(role_id), picture = VALUES(picture)
  `;

  db.query(sql, [email, role, picture], (err, result) => {
    if (err) {
      console.error('Error inserting/updating user:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(200).json({ role });
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

//บันทึกข้อมูลล็อกอินล่าสุด เข้า database