import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// เชื่อมต่อกับ MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "boomza532",
  database: "project_circuit",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL");
});

// สร้าง API สำหรับดึงข้อมูล
app.get('/dashboard/Users', (req, res) => {
  const sql = "SELECT * FROM users";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("ERROR:", err);
      res.status(500).send("Database query error");
    } else {
      res.send(result);
    }
  });
});

// ประกาศ port ที่ทำงานอยู่
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
