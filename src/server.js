import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// เชื่อมต่อกับ MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "circuit_project",
});

db.connect((err) => {
  if (err) {
    console.err("Error connecting", err);
    return;
  }
  console.log("Connected to MySQL");
});

// สร้าง API สำหรับดึงข้อมูล
app.get('/dashboard/Users', (req,res) => {
  const sql = "SELECT * FROM user";
  db.query(sql, (err, result) => {
    if(err){
      console.log("ERROR : ",err);
    }else{
      res.send(result);
    }
  });
});

//ประกาศ port ที่ทำงานอยู่
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  const sql = "SELECT * FROM user";
  db.query(sql, (err, result) => {
    if(err){
      console.log(err);
    }else{
      console.log(result);
    }
  });
});