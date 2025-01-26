import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cors());

// เชื่อมต่อกับ MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  // password: "boomza532",
  password: "123456789",
  database: "project_circuit",
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



//ดึงข้อมูล report
app.get('/api/report', (req, res) => {
  const { email } = req.query; // ดึง uid จาก Query Parameters
  const sql = "SELECT * FROM report WHERE report_uid = ?";
  // console.log({ uid } )

  db.query(sql, [email], (err, result) => {
    if(err){
      console.error("Error filtering data: ", err);
      return res.status(500).json({error: "Query data Report failed"});
    }
    res.status(200).json(result);
  });
});

//เพิ่มข้อมูล report
app.post('/api/addreport', (req, res) => {
  const { report_uid,report_name, report_detail, report_date } = req.body;

  // ตรวจสอบว่าค่าที่จำเป็นถูกส่งมาครบหรือไม่
  if (!report_uid ||!report_name || !report_detail || !report_date) {
    return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบทุกฟิลด์" });
  }

  // ตรวจสอบรูปแบบวันที่
  const parsedDate = new Date(report_date);
  if (isNaN(parsedDate.getTime())) {
    return res.status(400).json({ error: "รูปแบบวันที่ไม่ถูกต้อง" });
  }

  console.log("Request body:", req.body);

  // คำสั่ง SQL สำหรับการเพิ่มข้อมูลลงในตาราง
  const sql = `
    INSERT INTO report (report_uid,report_name, report_detail, report_date) 
    VALUES (?, ?, ?, ?)
  `;

  // ทำการ query เพื่อเพิ่มข้อมูล
  db.query(sql, [report_uid, report_name, report_detail, parsedDate], (err, result) => {
    if (err) {
      console.error("Error adding report: ", err.message);
      return res.status(500).json({ 
        error: "ไม่สามารถเพิ่มข้อมูลรายงานได้",
        details: err.message // ส่งข้อความ error ใน dev environment
      });
    }

    res.status(200).json({
      message: "เพิ่มรายงานสำเร็จ",
      report_id: result.insertId // ส่ง ID ที่เพิ่มสำเร็จ
    });
  });
});



// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

//บันทึกข้อมูลล็อกอินล่าสุด เข้า database