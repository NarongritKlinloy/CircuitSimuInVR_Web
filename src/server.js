// server.js (ES Module)
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import axios from "axios";
import { WebSocketServer } from "ws";
import { createServer } from "http";

const app = express();
const PORT = 5000;

// 1) เปิดใช้งาน CORS, JSON Parser
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ สร้าง HTTP Server สำหรับ Express API
const server = createServer(app);

// ✅ สร้าง Port WebSocket Server ที่พอร์ต 5050
const WS_PORT = 5050;

// 2) สร้าง Connection Pool
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  // password: "root",
  password: "123456789",
  // database: "circuit_project",
  database: "project_circuit",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// 3) ทดสอบเชื่อมต่อ DB (Optional)
(async function testDB() {
  try {
    const conn = await db.getConnection();
    console.log("Connected to MySQL (Connection Pool)");
    conn.release();
  } catch (error) {
    console.error("Cannot connect to MySQL:", error);
  }
})();

// 4) สร้าง WebSocket Server แยกพอร์ตเป็น 8080
const wss = new WebSocketServer({ port: 8080 });
wss.on("connection", (ws) => {
  console.log("Unity Connected via WebSocket");
  ws.send("Connected to WebSocket Server");
});

// ฟังก์ชันแจ้งเตือน Unity
function notifyUnity(token) {
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify({ accessToken: token }));
    }
  });
}

// -----------------------------------------------------------
// 5) Google OAuth Callback & Logout
// -----------------------------------------------------------
app.get("/callback", (req, res) => {
  res.send(`
    <script>
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const token = params.get("access_token");

      if (token) {
          fetch("http://localhost:5000/register", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ accessToken: token })
          })
          .then(response => response.json())
          .then(data => {
              console.log("Login Success:", data);

              // แจ้งเตือน Unity ผ่าน WebSocket (หากต้องการให้ไปเรียกผ่าน REST อีกที อาจต้องทำ endpoint ให้ตรง)
              fetch("http://localhost:8080/notify", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ accessToken: token })
              });

              // ใช้ Custom URL Scheme เพื่อส่ง Token กลับ Unity
              window.location.href = "unitydl://auth?access_token=" + token;

              // ปิด Browser
              setTimeout(() => { window.open('', '_self', ''); window.close(); }, 1000);
          })
          .catch(error => {
              console.error("Error:", error);
              window.location.href = "http://localhost:5000/error";
          });
      } else {
          window.location.href = "http://localhost:5000/error";
      }
    </script>
  `);
});

app.get("/logout", (req, res) => {
  res.send(`
    <script>
      document.cookie = "G_AUTHUSER_H=; path=/; domain=google.com; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      document.cookie = "G_AUTHUSER_H=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      window.location.href = "/";
    </script>
  `);
});

// -----------------------------------------------------------
// 6) Endpoint ลงทะเบียนผู้ใช้ (POST /register)
// -----------------------------------------------------------
app.post("/register", async (req, res) => {
  const { accessToken } = req.body;

  if (!accessToken) {
    console.error("No accessToken received!");
    return res.status(400).json({ error: "No accessToken provided" });
  }

  try {
    console.log("Verifying Google Token...");
    const googleResponse = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    console.log("Google Response:", googleResponse.data);
    const { email, name } = googleResponse.data;
    const now = new Date();
    now.setHours(now.getHours() + 7); // เพิ่ม 7 ชั่วโมงให้ตรงกับเวลาประเทศไทย
    const last_active = now.toISOString().slice(0, 19).replace("T", " ");
    const role_id = 3;

    // เช็คว่ามี user นี้ในระบบหรือไม่
    const [existingUser] = await db.query("SELECT * FROM user WHERE uid = ?", [email]);

    if (existingUser.length > 0) {
      // มีอยู่แล้ว -> อัปเดต
      await db.query("UPDATE user SET last_active = ?, role_id = ? WHERE uid = ?", [
        last_active,
        role_id,
        email,
      ]);
      console.log(`User ${email} updated successfully`);
      notifyUnity(accessToken);
      return res.json({ message: "User updated successfully" });
    } else {
      // ยังไม่มี -> สร้างใหม่
      await db.query(
        "INSERT INTO user (uid, name, role_id, last_active) VALUES (?, ?, ?, ?)",
        [email, name, role_id, last_active]
      );
      console.log(`User ${email} registered successfully`);
      notifyUnity(accessToken);
      return res.json({ message: "User registered successfully" });
    }
  } catch (error) {
    console.error("Google Token Verification Failed:", error);
    return res.status(400).json({ error: "Invalid Google Token" });
  }
});

// -----------------------------------------------------------
// 7) Endpoint /api/practice/:id (อ่าน practice_status)
// -----------------------------------------------------------
app.get("/api/practice/:id", async (req, res) => {
  const { id } = req.params;
  const sql = "SELECT practice_id, practice_status FROM practice WHERE practice_id = ?";

  try {
    const [results] = await db.query(sql, [id]);
    if (!results.length) {
      return res.status(404).json({ error: "practice_id not found" });
    }
    return res.json({
      practice_id: results[0].practice_id,
      practice_status: results[0].practice_status,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// -----------------------------------------------------------
// 8) ส่วนโค้ด API ต่าง ๆ (CRUD user, classroom, etc.)
// -----------------------------------------------------------

// ฟังก์ชันดึงข้อมูล user ตาม role
async function getUsersByRole(roleId) {
  const sql = "SELECT * FROM user WHERE role_id = ?";
  const [rows] = await db.query(sql, [roleId]);
  return rows;
}

// ดึงข้อมูลนักเรียน (role_id = 3)
app.get("/api/student", async (req, res) => {
  try {
    const students = await getUsersByRole(3);
    res.status(200).json(students);
  } catch (error) {
    console.error("Database Error for role_id 3:", error);
    res.status(500).json({ error: "Database query error" });
  }
});

// ดึงข้อมูลครู (role_id = 1)
app.get("/api/teacher", async (req, res) => {
  try {
    const teachers = await getUsersByRole(1);
    res.status(200).json(teachers);
  } catch (error) {
    console.error("Database Error for role_id 1:", error);
    res.status(500).json({ error: "Database query error" });
  }
});

// เปลี่ยน role (อัปเดต role_id ของ user)
app.put("/api/user/:uid", async (req, res) => {
  const { uid } = req.params;
  const { newrole } = req.body;

  const sql = "UPDATE user SET role_id = ? WHERE uid = ?";
  try {
    const [result] = await db.query(sql, [newrole, uid]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "Updated successfully" });
  } catch (err) {
    console.error("Error updating role:", err);
    return res.status(500).json({ error: "Update failed" });
  }
});

// ลบ user
app.delete("/api/user/:uid", async (req, res) => {
  const { uid } = req.params;
  const sql = "DELETE FROM user WHERE uid = ?";
  try {
    const [result] = await db.query(sql, [uid]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    return res.status(500).json({ error: "Delete failed" });
  }
});

// นับจำนวน user (ยกเว้น role_id = 2)
app.get("/api/user/count", async (req, res) => {
  const sql = "SELECT COUNT(*) AS userCount FROM user WHERE role_id != 2";
  try {
    const [rows] = await db.query(sql);
    const userCount = rows[0].userCount;
    res.status(200).json({ count: userCount });
  } catch (err) {
    console.error("Error counting user:", err);
    res.status(500).json({ error: "Count user failed" });
  }
});

// นับจำนวน admin (role_id = 2)
app.get("/api/admin/count", async (req, res) => {
  const sql = "SELECT COUNT(*) AS adminCount FROM user WHERE role_id = 2";
  try {
    const [rows] = await db.query(sql);
    const adminCount = rows[0].adminCount;
    res.status(200).json({ count: adminCount });
  } catch (err) {
    console.error("Error counting admin:", err);
    res.status(500).json({ error: "Count admin failed" });
  }
});

// นับจำนวน report
app.get("/api/report/count", async(req, res) => {
  try {
    const sql = "SELECT COUNT(*) AS reportCount FROM report";
    const [rows] = await db.query(sql);
    const reportCount = rows[0].reportCount;
    res.status(200).json({ count: reportCount });
  } catch (err) {
    console.error("Error counting report:", err);
    res.status(500).json({ error: "Count report failed" });
  }
});

// ดึงข้อมูล practice (ทั้งหมด)
app.get("/api/practice", async (req, res) => {
  const sql = "SELECT * FROM practice";
  try {
    const [rows] = await db.query(sql);
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error filtering data (practice):", err);
    res.status(500).json({ error: "Query data practice failed" });
  }
});

// เปลี่ยน status practice
app.put("/api/practice/update-status", async (req, res) => {
  const { practice_id, new_status } = req.body;
  const sql = "UPDATE practice SET practice_status = ? WHERE practice_id = ?";
  try {
    await db.query(sql, [new_status, practice_id]);
    res.status(200).send({ message: "Status updated successfully" });
  } catch (err) {
    console.error("Error updating status:", err);
    res.status(500).send("Error updating status");
  }
});

// ดึงข้อมูล classroom ทั้งหมดของครู
app.get("/api/classroom/:uid", async (req, res) => {
  const { uid } = req.params;
  const sql_teach = "SELECT class_id FROM teach WHERE uid = ?";
  try {
    const [teachRows] = await db.query(sql_teach, [uid]);
    if (teachRows.length === 0) {
      return res.status(404).json({ message: "No classrooms found for this user" });
    }
    const classIds = teachRows.map((row) => row.class_id);
    const sql_classroom = "SELECT * FROM classroom WHERE class_id IN (?)";
    const [classRows] = await db.query(sql_classroom, [classIds]);
    res.status(200).json(classRows);
  } catch (err) {
    console.error("Error filtering data (classroom):", err);
    res.status(500).json({ error: "Query data teach/classroom failed" });
  }
});

// เพิ่มข้อมูล classroom
app.post("/api/classroom", async (req, res) => {
  const { class_name, sec, semester, year, uid } = req.body;
  if (!uid) {
    return res.status(400).json({ error: "Missing 'uid' parameter" });
  }

  const sql_select_classroom =
    "SELECT * FROM classroom WHERE class_name = ? AND sec = ? AND semester = ? AND year = ?";

  try {
    const [rows] = await db.query(sql_select_classroom, [class_name, sec, semester, year]);
    if (rows.length > 0) {
      return res.status(400).json({ message: "Classroom already exists" });
    }
    // ถ้าไม่มีข้อมูลให้เพิ่ม
    const sql_insert_classroom =
      "INSERT INTO classroom (class_name, sec, semester, year) VALUES (?, ?, ?, ?)";
    const [insertResult] = await db.query(sql_insert_classroom, [
      class_name,
      sec,
      semester,
      year,
    ]);
    const class_id = insertResult.insertId;

    const sql_teach = "INSERT INTO teach (uid, class_id, role) VALUES (?, ?, 1)";
    await db.query(sql_teach, [uid, class_id]);
    res.status(200).send({ message: "Added classroom and teach successfully" });
  } catch (err) {
    console.error("Error adding classroom:", err);
    res.status(500).json({ error: "Query classroom/teach failed" });
  }
});

// ลบข้อมูล classroom
app.delete("/api/classroom/:class_id", async (req, res) => {
  const { class_id } = req.params;
  const sql_classroom = "DELETE FROM classroom WHERE class_id = ?";
  const sql_teach = "DELETE FROM teach WHERE class_id = ?";
  const sql_enroll = "DELETE FROM enrollment WHERE class_id = ?";

  try {
    const [delClass] = await db.query(sql_classroom, [class_id]);
    if (delClass.affectedRows === 0) {
      return res.status(404).json({ error: "Classroom not found" });
    }
    const [delTeach] = await db.query(sql_teach, [class_id]);
    if (delTeach.affectedRows === 0) {
      return res.status(404).json({ error: "Teach not found" });
    }
    const [delEnroll] = await db.query(sql_enroll, [class_id]);
    if (delEnroll.affectedRows === 0) {
      return res.status(404).json({ error: "Enrollment not found" });
    }
    res.status(200).json({ message: "Classroom and teach deleted successfully" });
  } catch (err) {
    console.error("Error deleting classroom/teach:", err);
    res.status(500).json({ error: "Delete failed" });
  }
});

// แก้ไข classroom
app.put("/api/classroom/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { class_name, semester, sec, year } = req.body;

    if (!class_name || !semester || !sec || !year) {
      throw { status: 400, message: "Please enter data in all fields" };
    }

    // check class id
    const [checkClass] = await db.query("SELECT * FROM classroom WHERE class_id = ?", [id]);
    if (checkClass.length === 0) {
      throw { status: 404, message: "Classroom not found!" };
    }

    const sql_check_classroom = "SELECT * FROM classroom WHERE class_name = ? AND sec = ? AND semester = ? AND year = ?";
    const [checkAnotherClass] = await db.query(sql_check_classroom, [class_name, sec, semester, year]);
    if (checkAnotherClass.length > 0){
      throw { status: 400, message: "Classroom failed to update!" };
    }

    const sql = "UPDATE classroom SET ? WHERE class_id = ?";
    const class_data = { class_name, semester, sec, year };
    const [updateResult] = await db.query(sql, [class_data, id]);
    if (!updateResult) {
      throw { status: 400, message: "Classroom failed to update!" };
    }

    return res.status(200).json({ message: "Classroom updated successfully" });
  } catch (err) {
    const message = err.message || "Internal server error";
    const status = err.status || 500;
    return res.status(status).json({ message });
  }
});

// ดึงข้อมูลจำนวน student ที่อยู่ใน classroom
app.get("/api/classroom/student/count/:class_id", async (req, res) => {
  const { class_id } = req.params;
  const sql_enroll = "SELECT uid FROM enrollment WHERE class_id = ?";
  
  try {
    const [rows] = await db.query(sql_enroll, [class_id]);
    return res.status(200).json(rows.length);
  } catch (err) {
    console.error("Error select enrollment:", err);
    return res.status(500).json({ error: "Select enrollment failed" });
  }
});

// ดึงข้อมูล student ที่อยู่ใน classroom
app.get("/api/classroom/student/:class_id", async (req, res) => {
  const { class_id } = req.params;
  // const sql_enroll = "SELECT uid FROM enrollment WHERE class_id = ?";
  const sql_enroll = `select enrollment.uid, user.name, enrollment.class_id, user.last_active, classroom.sec from enrollment
                      left join classroom on enrollment.class_id = classroom.class_id
                      left join user on enrollment.uid = user.uid
                      where enrollment.class_id = ?`

  try {
    const [rows] = await db.query(sql_enroll, [class_id]);
    if (rows.length === 0) {
      // ยังไม่มี student
      return res.status(200).json([]);
    }
    // const uids = rows.map((r) => r.uid);
    // const sql_user = "SELECT * FROM user WHERE uid IN (?)";
    // const [userRows] = await db.query(sql_user, [uids]);
    // return res.status(200).json(userRows);
    return res.status(200).json(rows);
  } catch (err) {
    console.error("Error select user student:", err);
    return res.status(500).json({ error: "Select user student failed" });
  }
});

// เพิ่ม student เข้า classroom
app.post("/api/classroom/student", async (req, res) => {
  const { uid, class_id } = req.body;
  if (!uid || !class_id) {
    return res.status(400).json({ error: "Missing parameter" });
  }

  // ถ้า uid ไม่ลงท้ายด้วย @kmitl.ac.th ให้เติม
  let processedUid = uid.endsWith("@kmitl.ac.th") ? uid : `${uid}@kmitl.ac.th`;

  try {
    // เช็ค user ว่ามีไหม
    const sql_user = "SELECT * FROM user WHERE uid = ?";
    const [userRows] = await db.query(sql_user, [processedUid]);
    if (userRows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    if (userRows[0].role_id !== 3) {
      return res.status(400).json({ message: "User is not a student" });
    }

    // เช็คว่าลงทะเบียน classroom ไปแล้วหรือยัง
    const sql_enroll_select = "SELECT * FROM enrollment WHERE uid = ?";
    const [enrollRows] = await db.query(sql_enroll_select, [processedUid]);
    if (enrollRows.length > 0) {
      return res.status(400).json({ message: "Student already has a classroom" });
    }
    const now = new Date();
    now.setHours(now.getHours() + 7); // เพิ่ม 7 ชั่วโมงให้ตรงกับเวลาประเทศไทย
    const enrollDate = now.toISOString().slice(0, 19).replace("T", " ");

    const sql_enroll = "INSERT INTO enrollment (uid, class_id, enroll_date) VALUES (?, ?, ?)";
    await db.query(sql_enroll, [processedUid, class_id, enrollDate]);
    res.status(200).send({ message: "Added student to classroom successfully" });
  } catch (err) {
    console.error("Error insert student:", err);
    return res.status(500).json({ error: "Insert student failed" });
  }
});

// ลบ student ออกจาก classroom
app.delete("/api/classroom/student/:uid/:class_id", async (req, res) => {
  const { uid, class_id } = req.params;
  const sql_classroom = "DELETE FROM enrollment WHERE uid = ? AND class_id = ?";
  try {
    const [result] = await db.query(sql_classroom, [uid, class_id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Enrollment not found" });
    }
    res.status(200).json({ message: "Enrollment deleted successfully" });
  } catch (err) {
    console.error("Error deleting enrollment:", err);
    res.status(500).json({ error: "Delete enrollment failed" });
  }
});


// ------------ Teacher Assistant (TA) ------------ // 

// เพิ่ม teacher assistant ใน classroom
app.post("/api/classroom/assistant", async (req, res) => {
  const { uid, class_id } = req.body;
  const sql_user = "SELECT uid FROM user WHERE uid = ?";
  try {
    const [rows] = await db.query(sql_user, [uid]);
    if(rows.length > 0){
      const sql_teach_assistant = "INSERT INTO teach (uid, class_id, role) VALUES (?, ?, 2)";
      await db.query(sql_teach_assistant, [uid, class_id]);
      return res.status(200).json({ message: "Add assistant successfully" });
    }else{
      return res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error("Error inserting assistant:", err);
    return res.status(500).json({ error: "Insert assistant failed" });
  }
});

// ดึงข้อมูล teacher assistant ใน classroom
app.get("/api/classroom/assistant/:class_id", async (req, res) => {
  const { class_id } = req.params;
  const sql_teach = "SELECT uid FROM teach WHERE class_id = ? AND role = 2";
  try {
    const [rows] = await db.query(sql_teach, [class_id]);
    if (rows.length === 0) {
      // ยังไม่มี assistant
      return res.status(200).json([]);
    }
    const uids = rows.map((r) => r.uid);
    const sql_user = "SELECT * FROM user WHERE uid IN (?)";
    const [userRows] = await db.query(sql_user, [uids]);
    return res.status(200).json(userRows);
  } catch (err) {
    console.error("Error select assistant:", err);
    return res.status(500).json({ error: "Select assistant failed" });
  }
});

// ลบ teacher assistant ใน classroom
app.delete("/api/classroom/assistant/:uid/:class_id", async (req, res) => {
  const { uid, class_id } = req.params;
  const sql_teach_assistant = "DELETE FROM teach WHERE uid = ? AND class_id = ?";
  try {
    const [result] = await db.query(sql_teach_assistant, [uid, class_id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Teach not found" });
    }
    res.status(200).json({ message: "Assistant deleted successfully" });
  } catch (err) {
    console.error("Error deleting assistant:", err);
    res.status(500).json({ error: "Delete assistant failed" });
  }
});

// ------------ End Teacher Assistant ------------ // 

//ดึง sec ของ classroom ที่ name, year, semester ตรงกัน
app.get("/api/classroom/sec/:class_id", async (req, res) => {
  try {
    const { class_id } = req.params;
    const sql_classroom = "SELECT * FROM classroom WHERE class_id = ?";
    const [rows] = await db.query(sql_classroom, [class_id]);
    if (rows.length === 0) {
      // ยังไม่มี student
      return res.status(200).json([]);
    }
    const name = rows[0].class_name;
    const semester = rows[0].semester;
    const year = rows[0].year;

    const sql_sec_classroom = "SELECT class_id, sec FROM classroom WHERE class_name = ? AND semester = ? AND year = ?";
    const [rows_sec] = await db.query(sql_sec_classroom, [name, semester, year]);

    const secArray = rows_sec.map(row => ({ class_id: row.class_id, sec: row.sec }));
    return res.status(200).json(secArray);

  } catch (err) {
    console.error("Error select sec:", err);
    return res.status(500).json({ error: "Select sec failed" });
  }
});

//เปลี่ยน sec
app.put("/api/classroom/sec/:uid", async (req, res) => {
  try {
    const { uid } = req.params;
    const { class_id } = req.body;
    const now = new Date();
    now.setHours(now.getHours() + 7); // เพิ่ม 7 ชั่วโมงให้ตรงกับเวลาประเทศไทย
    const enrollDate = now.toISOString().slice(0, 19).replace("T", " ");
    const sql_enroll = ("UPDATE enrollment SET class_id = ?, enroll_date = ? WHERE uid = ?");
    const [updateResult] = await db.query(sql_enroll, [class_id, enrollDate, uid])
    console.log(enrollDate);
    if (!updateResult) {
      return res.status(400).json({ error: "Sec failed to update!" });
    }
    return res.status(200).json({ message: "Sec updated successfully" });
  } catch (err) {
    console.error("Error update sec:", err);
    return res.status(500).json({ error: "Update sec failed" });
  }
});

// เพิ่ม user เข้าระบบ
app.post("/api/user/:uid/:name/:role_id/:last_active", async (req, res) => {
  const { uid, name, role_id, last_active } = req.params;
  const sql_select_user = "SELECT * FROM user WHERE uid = ?";
  try {
    const [rows] = await db.query(sql_select_user, [uid]);
    if (rows.length > 0) {
      // อัปเดต
      const sql_update = "UPDATE user SET name = ?, role_id = ?, last_active = ? WHERE uid = ?";
      await db.query(sql_update, [name, role_id, last_active, uid]);
    } else {
      // เพิ่มใหม่
      const sql_insert_user =
        "INSERT INTO user (uid, name, role_id, last_active) VALUES (?, ?, ?, ?)";
      await db.query(sql_insert_user, [uid, name, role_id, last_active]);
    }
    res.status(200).json({ message: "sign in successfully" });
  } catch (err) {
    console.error("Error insert/update user:", err);
    res.status(500).json({ error: "Insert/Update user failed" });
  }
});

// --------------------------- Report (Champ) ---------------------------

// ✅ API: ดึงข้อมูล report
app.get("/api/report", async (req, res) => {
  const { email } = req.query; // รับค่าผ่าน Query Parameters
  if (!email) {
    return res.status(400).json({ error: "Missing 'email' query parameter" });
  }
  const sql = "SELECT * FROM report WHERE report_uid = ?";
  try {
    const [rows] = await db.query(sql, [email]);
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error filtering data (report):", err);
    res.status(500).json({ error: "Query data Report failed" });
  }
});
/******************************************************************************* */

// ✅ API: เพิ่ม Report + Notification
app.post("/api/addreport", async (req, res) => {
  const { report_uid, report_name, report_detail, report_date } = req.body;

  if (!report_uid || !report_name || !report_detail || !report_date) {
    return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบทุกฟิลด์" });
  }

  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    // ✅ เพิ่ม Report
    const [reportResult] = await connection.execute(
      `INSERT INTO report (report_uid, report_name, report_detail, report_date) 
      VALUES (?, ?, ?, ?)`,
      [report_uid, report_name, report_detail, report_date]
    );

    const reportId = reportResult.insertId;

     // ✅ เพิ่ม Notification (แก้ไขค่าที่ผิด)
  const message = `มีรายงานใหม่: ${report_name}`;
  await connection.execute(
    `INSERT INTO notifications (report_id, recipient_uid, message, type, is_read) 
    VALUES (?, ?, ?, ?, ?)`, 
    [reportId, "admin", message, "report", 0]  // ✅ "admin" เป็นผู้รับแจ้งเตือน
  );

    await connection.commit();
    connection.release();

    res.status(200).json({
      message: "✅ เพิ่มรายงานและแจ้งเตือนสำเร็จ",
      report_id: reportId,
    });

     // ✅ แจ้งเตือน WebSocket Clients
     broadcastData();

  } catch (error) {
    await connection.rollback();
    connection.release();
    console.error("❌ Error:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการเพิ่มข้อมูล" });
  }
});

/**** */
/*******✅ ดึงข้อมูล Report ฝั่ง Admin (ใช้ Promise)***********/
app.get('/api/adminreport', async (req, res) => {
  try {
      const sql = "SELECT * FROM report";
      const [result] = await db.query(sql); // ใช้ await รอให้ Query เสร็จ

      res.status(200).json(result);
  } catch (error) {
      console.error("Error fetching admin reports:", error);
      res.status(500).json({ error: "Query data Report failed" });
  }
});

/**************************✅ ดึงข้อมูล Report ฝั่ง Admin   WebSocket ******************************/
const wssReact = new WebSocketServer({ port: WS_PORT });
// ✅ ฟังก์ชันดึงจำนวนแจ้งเตือนใหม่ (is_read = 0)
const fetchUnreadNotifications = async () => {
  try {
    const sql = "SELECT COUNT(*) AS unread_count FROM notifications WHERE is_read = 0";
    const [result] = await db.query(sql);
    return result[0]?.unread_count ?? 0;
  } catch (error) {
    console.error("❌ Database error:", error);
    return 0;
  }
};

// ✅ ฟังก์ชันดึงข้อมูล `Reports`
const fetchReports = async () => {
  try {
    const sql = "SELECT * FROM report";
    const [result] = await db.query(sql);
    return result;
  } catch (error) {
    console.error("❌ Database error fetching reports:", error);
    return [];
  }
};

// ✅ ฟังก์ชัน Broadcast ข้อมูลไปยัง WebSocket Clients
const broadcastData = async () => {
  const unreadCount = await fetchUnreadNotifications();
  const reports = await fetchReports();

  const data = JSON.stringify({
    unread_count: unreadCount,
    reports: reports,
  });

  wssReact.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(data);
    }
  });

  // console.log("📩 Broadcast: ", { unread_count: unreadCount, reports: reports.length });
};

// ✅ API ดึงจำนวนแจ้งเตือนใหม่
app.get("/api/countnotifications", async (req, res) => {
  try {
    const unreadCount = await fetchUnreadNotifications();
    res.status(200).json({ unread_count: unreadCount });
    broadcastData();
  } catch (error) {
    // console.error("❌ Error fetching notifications count:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลแจ้งเตือน" });
  }
});

// ✅ API ดึง `Reports` ทั้งหมด
app.get("/api/adminreport", async (req, res) => {
  try {
    const reports = await fetchReports();
    res.status(200).json(reports);
    broadcastData();
  } catch (error) {
    // console.error("❌ Error fetching reports:", error);
    res.status(500).json({ error: "Query data Report failed" });
  }
});

// ✅ WebSocket Connection
wssReact.on("connection", (ws) => {
  // console.log("✅ Client connected to WebSocket 5050");

  // ✅ ส่งจำนวนแจ้งเตือนให้ Client ที่เพิ่งเชื่อมต่อ
  const sendInitialData = async () => {
    const unreadCount = await fetchUnreadNotifications();
    const reports = await fetchReports();
    ws.send(JSON.stringify({ unread_count: unreadCount, reports: reports }));
  };

  sendInitialData();

  ws.on("close", () => {
    // console.log("❌ Client disconnected");
  });
});

// -----------------------------------------------------------


// เปลี่ยน update-notification
app.put("/api/update-notification", async (req, res) => {
  const { recipient_uid, report_id } = req.body;
  const sql = "UPDATE notifications SET is_read = 1, recipient_uid = ? WHERE report_id = ?";
  try {
    await db.query(sql, [recipient_uid, report_id]);
    res.status(200).send({ message: "notification updated successfully" });

    // ✅ แจ้งเตือน WebSocket Clients
    broadcastData();
    
  } catch (err) {
    console.error("Error updating notification:", err);
    res.status(500).send("Error updating notification");
  }
});

//อ่านค่า read = 1 ในการเปลี่ยนสีปุ่ม
app.get("/api/get-read-notifications", async (req, res) => {
  const { recipient_uid } = req.query;

  if (!recipient_uid) {
    return res.status(400).json({ error: "recipient_uid is required" });
  }

  try {
    const sql = "SELECT report_id FROM notifications WHERE recipient_uid = ? AND is_read = 1";
    const [result] = await db.query(sql, [recipient_uid]);

    res.status(200).json(result);
  } catch (error) {
    console.error("❌ Error fetching read notifications:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลแจ้งเตือนที่อ่านแล้ว" });
  }
});

// -----------------------------------------------------------

/**************************✅ END ดึงข้อมูล Report ฝั่ง Admin (ใช้ Promise)   WebSocket ******************************/

// ✅ API: เพิ่ม Report + Notification
// app.post("/api/addreport", async (req, res) => {
//   const { report_uid, report_name, report_detail, report_date } = req.body;

//   if (!report_uid || !report_name || !report_detail || !report_date) {
//     return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบทุกฟิลด์" });
//   }

//   const connection = await db.getConnection();
//   await connection.beginTransaction();

//   try {
//     // ✅ เพิ่ม Report
//     const [reportResult] = await connection.execute(
//       `INSERT INTO report (report_uid, report_name, report_detail, report_date) 
//       VALUES (?, ?, ?, ?)`,
//       [report_uid, report_name, report_detail, report_date]
//     );

//     const reportId = reportResult.insertId;

//       // ✅ เพิ่ม Notification (แก้ไขค่าที่ผิด)
//   const message = `มีรายงานใหม่: ${report_name}`;
//   await connection.execute(
//     `INSERT INTO notifications (report_id, recipient_uid, message, type, is_read) 
//     VALUES (?, ?, ?, ?, ?)`, 
//     [reportId, "admin", message, "report", 0]  // ✅ "admin" เป็นผู้รับแจ้งเตือน
//   );

//     await connection.commit();
//     connection.release();

//     res.status(200).json({
//       message: "✅ เพิ่มรายงานและแจ้งเตือนสำเร็จ",
//       report_id: reportId,
//     });

//   } catch (error) {
//     await connection.rollback();
//     connection.release();
//     console.error("❌ Error:", error);
//     res.status(500).json({ error: "เกิดข้อผิดพลาดในการเพิ่มข้อมูล" });
//   }
// });


// /*******✅ ดึงข้อมูล Report ฝั่ง Admin (ใช้ Promise)***********/

// app.get('/api/adminreport', async (req, res) => {
//   try {
//       const sql = "SELECT * FROM report";
//       const [result] = await db.query(sql); // ใช้ await รอให้ Query เสร็จ

//       res.status(200).json(result);
//   } catch (error) {
//       console.error("Error fetching admin reports:", error);
//       res.status(500).json({ error: "Query data Report failed" });
//   }
// });

// /****** ✅ API: ดึงจำนวนแจ้งเตือนที่ยังไม่ได้อ่านหรืออ่านแล้ว********* */

// app.get('/api/countnotifications/:is_read', async (req, res) => {
//   try {
//       let { is_read } = req.params;

//       // ✅ ตรวจสอบค่าของ is_read ต้องเป็น 0 หรือ 1
//       if (is_read !== "0" && is_read !== "1") {
//           return res.status(400).json({ error: "ค่าพารามิเตอร์ is_read ต้องเป็น 0 หรือ 1 เท่านั้น" });
//       }

//       // ✅ Query ดึงจำนวนแจ้งเตือน
//       const sql = "SELECT COUNT(*) AS unread_count FROM `notifications` WHERE is_read = ?";
//       const [result] = await db.query(sql, [is_read]);

//       res.status(200).json({ unread_count: result[0].unread_count });
//       // console.log("noti--->>"+result)

//   } catch (error) {
//       console.error("❌ Error fetching notifications count:", error);
//       res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลแจ้งเตือน" });
//   }
// });

// // เปลี่ยน update-notification
// app.put("/api/update-notification", async (req, res) => {
//   const { recipient_uid, report_id } = req.body;
//   const sql = "UPDATE notifications SET is_read = 1, recipient_uid = ? WHERE report_id = ?";
//   try {
//     await db.query(sql, [recipient_uid, report_id]);
//     res.status(200).send({ message: "notification updated successfully" });
//   } catch (err) {
//     console.error("Error updating notification:", err);
//     res.status(500).send("Error updating notification");
//   }
// });

// //อ่านค่า read = 1 ในการเปลี่ยนสีปุ่ม
// app.get("/api/get-read-notifications", async (req, res) => {
//   const { recipient_uid } = req.query;

//   if (!recipient_uid) {
//     return res.status(400).json({ error: "recipient_uid is required" });
//   }

//   try {
//     const sql = "SELECT report_id FROM notifications WHERE recipient_uid = ? AND is_read = 1";
//     const [result] = await db.query(sql, [recipient_uid]);

//     res.status(200).json(result);
//   } catch (error) {
//     console.error("❌ Error fetching read notifications:", error);
//     res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลแจ้งเตือนที่อ่านแล้ว" });
//   }
// });

// -----------------------------------------------------------


// 9) เริ่มต้น Server
// // -----------------------------------------------------------
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});