const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(cors());

// เชื่อมต่อกับ MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "your_database_name",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL");
});

// สร้าง API สำหรับดึงข้อมูล
app.get("/users", (req, res) => {
  const sql = "SELECT id, img, name, email, online, date FROM users";
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
