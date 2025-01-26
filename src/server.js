import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import e from 'express';

const router = express.Router();
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

// สร้าง API

//function ดึงข้อมูล user
const getUsersByRole = (roleId, res) => {
  const sql = "SELECT * FROM user WHERE role_id = ?";
  db.query(sql, [roleId], (err, result) => {
    if (err) {
      console.error("Database Error for role_id ${roleId}:", err);
      return res.status(500).json({ error: "Database query error" });
    }
    res.status(200).json(result);
  });
};

// 📚 ดึงข้อมูลนักเรียน (role_id = 3)
app.get('/api/student', (req, res) => {
  getUsersByRole(3, res);
});

// 👨‍🏫 ดึงข้อมูลครู (role_id = 1)
app.get('/api/teacher', (req, res) => {
  getUsersByRole(1, res);
});

//เปลี่ยน role
app.put('/api/user/:uid', (req, res) => {
 const { uid } = req.params;
 const { newrole } = req.body;

 const sql = "UPDATE user SET role_id = ? WHERE uid = ?";

 db.query(sql, [newrole, uid], (err, result) => {
  if(err){
    console.error("Error updating role:", err);
    return res.status(500).json({error: "Update failed"});
  }
  
  res.status(200).json({message: "Updated successfully"});
 });
});

//ลบ user
app.delete('/api/user/:uid', (req, res) => {
  const { uid } = req.params;
  
  const sql = "DELETE FROM user WHERE uid = ?";
  db.query(sql, [uid], (err, result) => {
    if(err){
      console.error("Error deleting user:", err);
      return res.status(500).json({error: "Delete failed"});
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  });
});

//นับจำนวน user
app.get('/api/user/count', (req, res) => {
  const sql = "SELECT COUNT(*) AS userCount FROM user WHERE role_id != 2";

  db.query(sql, (err, result) => {
    if(err){
      console.error("Error counting user:", err);
      return res.status(500).json({error: "Count user failed"});
    }
    const userCount = result[0].userCount;
    res.status(200).json({ count: userCount});
  });
});

//นับจำนวน admin
app.get('/api/admin/count', (req, res) => {
  const sql = "SELECT COUNT(*) AS adminCount FROM user WHERE role_id = 2";

  db.query(sql, (err, result) => {
    if(err){
      console.error("Error counting admin: ", err);
      return res.status(500).json({error: "Count admin failed"});
    }
    const adminCount = result[0].adminCount;
    res.status(200).json({ count: adminCount});
  });
});

//ดึงข้อมูล practice
app.get('/api/practice', (req, res) => {
  const sql = "SELECT * FROM practice";
  
  db.query(sql, (err,result) => {
    if(err){
      console.error("Error filtering data: ", err);
      return res.status(500).json({error: "Query data practice failed"});
    }
    res.status(200).json(result);
  });
});

//เปลี่ยน status practice
app.put('/api/practice/update-status', (req, res) => {
  const { practice_id, new_status } = req.body;

  // สร้าง SQL query ที่จะอัพเดตสถานะ
  const sql = "UPDATE practice SET practice_status = ? WHERE practice_id = ?";
  
  db.query(sql, [new_status, practice_id], (err, result) => {
    if (err) {
      console.error("Error updating status:", err);
      return res.status(500).send("Error updating status");
    }

    res.status(200).send({ message: "Status updated successfully" });
  });
});

//ดึงข้อมูล classroom
app.get('/api/classroom/:uid', (req, res) => {
  const { uid } = req.params;

  const sql_teach ="SELECT class_id FROM teach WHERE uid = ?";
  db.query(sql_teach, [uid], (err, result) => {
    if(err){
      console.error("Error filtering data: ", err);
      return res.status(500).json({error: "Query data teach failed"});
    }

    // ตรวจสอบว่ามีข้อมูลใน result หรือไม่
    if (result.length === 0) {
      return res.status(404).json({ message: "No classrooms found for this user" });
    }

    // ดึง class_id ทั้งหมดจาก result
    const class_id = result.map(row => row.class_id);
    const sql_classroom = "SELECT * FROM classroom WHERE class_id IN (?)";
    db.query(sql_classroom, [class_id], (err, result) => {
      if(err){
        console.error("Error filtering data: ", err);
        return res.status(500).json({error: "Query data classroom failed"});
      }
      res.status(200).json(result);
    });
  });
});

//เพิ่มข้อมูล classroom
app.post('/api/classroom', (req, res) => {
  const { class_name, sec, semester, year, uid } = req.body;
  if (!uid) {
    return res.status(400).json({ error: "Missing 'uid' parameter" });
  }

  const sql_select_classroom = "SELECT * FROM classroom WHERE class_name = ? AND sec = ? AND semester = ? AND year = ?";
  db.query(sql_select_classroom, [class_name, sec, semester, year], (err, result) => {
    if(err){
      console.error("Error select data: ", err);
      return res.status(500).json({error: "Query select data classroom failed"});
    }

    //ถ้ามีข้อมูลให้แจ้งเตือน
    if (result.length > 0){
      return res.status(400).json({ message: "Classroom already exists" });
    }

    //ถ้าไม่มีข้อมูลให้เพิ่ม
    const sql_insert_classroom = "INSERT INTO classroom (class_name, sec, semester, year) VALUES (?, ?, ?, ?)";
    db.query(sql_insert_classroom,[class_name, sec, semester, year], (err, result) => {
      if(err){
        console.error("Error add data: ", err);
        return res.status(500).json({error: "Query add data classroom failed"});
      }

      const class_id = result.insertId;
      const sql_teach = "INSERT INTO teach (uid, class_id, role) VALUES (?, ?, 1)";
      db.query(sql_teach, [uid, class_id], (err, result) => {
        if(err){
          console.error("Error add data: ", err);
          return res.status(500).json({error: "Query add data teach failed"});
        }
      });

      res.status(200).send({message: "Added classroom and teach successfully"});
    });
  });
});

//ลบข้อมูล classroom
app.delete('/api/classroom/:class_id', (req, res) => {
  const { class_id } = req.params;
  
  const sql_classroom = "DELETE FROM classroom WHERE class_id = ?";
  db.query(sql_classroom, [class_id], (err, result) => {
    if(err){
      console.error("Error deleting classroom:", err);
      return res.status(500).json({error: "Delete classroom failed"});
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Classroom not found" });
    }
  });

  const sql_teach = "DELETE FROM teach WHERE class_id = ?";
  db.query(sql_teach, [class_id], (err, result) => {
    if(err){
      console.error("Error deleting teach:", err);
      return res.status(500).json({error: "Delete teach failed"});
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Teach not found" });
    }
    res.status(200).json({ message: "Classroom and teach deleted successfully" });
  });

});

//แก้ไข classroom
app.put('/api/classroom/:id', async(req, res) => {
  try{
    const { id } = req.params;
    const { class_name , semester , sec , year } = req.body;

    // check user input
    if(!class_name || !semester || !sec || !year){
      throw { status : 400 , message : "Please enter data all fields"};
    }

    // check class id in database
    const [checkClass] = await db.promise().query("SELECT * FROM classroom WHERE class_id = ?",id);
    if(checkClass.length <= 0){
      throw {status : 404 , message : "Classroom not found!"};
    }

    // declare classroom data schema
    const class_data = { class_name, semester, sec, year }

    // update data -> db
    const updateResult = await db.promise().query("UPDATE classroom SET ? WHERE class_id = ?",[class_data,id]);
    if(!updateResult){
      throw {status : 400 , message : "Classroom failed to update!"};
    }

    return res.status(200).json({message : "Classroom updated successfully"});

    }catch(err){
      const message = err.message || "Internal server error";
      const status = err.status || 500;
      
      return res.status(status).json({message});
    }
});

//ดึงข้อมูลจำนวน student ที่อยู่ใน classroom
app.get('/api/classroom/student/count/:class_id', (req, res) => {
  const { class_id } = req.params;
  const sql_enroll = "SELECT uid FROM enrollment WHERE class_id = ?";
  db.query(sql_enroll, [class_id], (err, result) => {
    if(err){
      console.error("Error select enrollment:", err);
      return res.status(500).json({error: "Select enrollment failed"});
    }
    res.status(200).json(result.length);
  });
});

//ดึงข้อมูล student ที่อยู่ใน classroom
app.get('/api/classroom/student/:class_id', (req, res) => {
  const { class_id } = req.params;
  const sql_enroll = "SELECT uid FROM enrollment WHERE class_id = ?";
  db.query(sql_enroll, [class_id], (err, result) => {
    if(err){
      console.error("Error select enrollment:", err);
      return res.status(500).json({error: "Select enrollment failed"});
    }
    // ตรวจสอบว่ามีข้อมูลใน result หรือไม่
    if (result.length === 0) {
      return res.status(200).json(result);
    }
    // ดึง uid ทั้งหมดจาก result
    const uid = result.map(row => row.uid);
    const sql_user = "SELECT * FROM user WHERE uid IN (?)";
    db.query(sql_user, [uid], (err, result) => {
      if(err){
        console.error("Error select user student:", err);
        return res.status(500).json({error: "Select user student failed"});
      }
      //console.log(result);
      res.status(200).json(result);
    });
  });
});

//เพิ่ม student เข้า classroom
app.post('/api/classroom/student', (req, res) => {
  const { uid, class_id } = req.body;
  if (!uid || !class_id) {
    return res.status(400).json({ error: "Missing parameter" });
  }
  let processedUid = uid;
  // Check if the uid already ends with '@kmitl.ac.th'
  if (!uid.endsWith("@kmitl.ac.th")) {
    processedUid = `${uid}@kmitl.ac.th`;
  }

  const sql_user = "SELECT * FROM user WHERE uid = ?";
  db.query(sql_user, [processedUid], (err, result) => {
    if(err){
      console.error("Error select user:", err);
      return res.status(500).json({error: "Select user failed"});
    }
    //ตรวจสอบ user ว่ามีอยู่ไหมหรือเป็น student ไหม
    if(result.length === 0){
      return res.status(404).json({ message: "User not found" });
    }
    const user = result[0];
    if(user.role_id !== 3){
      return res.status(400).json({ message: "User is not a student" });
    }

    const sql_enroll = "INSERT INTO enrollment (uid, class_id, enroll_date) VALUES (?, ?, ?)";
    const enrollDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    db.query(sql_enroll, [processedUid, class_id, enrollDate], (err, result) => {
      if(err){
        console.error("Error insert student:", err);
        return res.status(500).json({error: "Insert student failed"});
      }
      res.status(200).send({message: "Added student to classroom successfully"});
    });
  });
});

//ลบ student ออกจาก classroom
app.delete('/api/classroom/student/:uid/:class_id', (req, res) => {
  const { uid, class_id } = req.params;
  const sql_classroom = "DELETE FROM enrollment WHERE uid = ? AND class_id = ?";
  db.query(sql_classroom, [uid, class_id], (err, result) => {
    if(err){
      console.error("Error deleting enrollment:", err);
      return res.status(500).json({error: "Delete enrollment failed"});
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Enrollment not found" });
    }
    res.status(200).json({ message: "Enrollment deleted successfully" });
  });
});


// ประกาศ port ที่ทำงานอยู่
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
