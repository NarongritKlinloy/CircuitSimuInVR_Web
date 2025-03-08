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
const PORT = 3000;     //แก้ตรงนี้

// 1) เปิดใช้งาน CORS, JSON Parser
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// สร้าง HTTP Server สำหรับ Express API
const server = createServer(app);

// สร้าง Port WebSocket Server ที่พอร์ต 5050
const WS_PORT_UNITY = 8282;
const wssUnity = new WebSocketServer({ port: WS_PORT_UNITY });

// const WS_PORTWEB = 8282;

// 2) สร้าง Connection Pool
const db = mysql.createPool({
  host: "db",
  user: "node_user",
  password: "Admin123!",
  // password: "123456789",
  database: "Project_circuit",
  timezone: "Asia/Bangkok",
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

//4) สร้าง WebSocket Server แยกพอร์ตเป็น 8080
wssUnity.on("connection", (ws) => {
  console.log("Unity Connected via WebSocket (Port 8181)");
  ws.send("Connected to Unity WebSocket Server");

  ws.on("message", (message) => {
    console.log(`Received from Unity: ${message}`);
    ws.send(`Echo: ${message}`);
  });

  ws.on("close", () => {
    console.log("Unity Disconnected");
  });
});

// ฟังก์ชันแจ้งเตือน Unity ผ่าน WebSocket (ปรับให้ส่ง userId ไปด้วย)
function notifyUnity(token, userId) {
  wssUnity.clients.forEach((client) => {
    if (client.readyState === 1) {
      // ส่งเป็น JSON ที่มีทั้ง accessToken และ userId
      client.send(JSON.stringify({ accessToken: token, userId: userId }));
    }
  });
}


// 5) WebSocket Server สำหรับเว็บ (พอร์ต 8282)
const WS_PORT_WEB = 8181;
const wssWeb = new WebSocketServer({ port: WS_PORT_WEB });

wssWeb.on("connection", (ws) => {
  console.log("Web Page Connected via WebSocket (Port 8282)");
  ws.send("Connected to Web WebSocket Server");

  ws.on("message", (message) => {
    console.log(`Received from Web: ${message}`);
    ws.send(`Echo: ${message}`);
  });

  ws.on("close", () => {
    console.log("Web Disconnected");
  });
});
//+++++++++++++++++++++++++++++++จุดเริ่มต้นของ UNITY +++++++++++++++++++++++++++//
// -----------------------------------------------------------
// Google OAuth Callback & Logout
// -----------------------------------------------------------
app.get("/callback", (req, res) => {
  res.send(`
    <script>
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const token = params.get("access_token");

      if (token) {
          fetch("https://smith11.ce.kmitl.ac.th/register", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ accessToken: token })
          })
          .then(response => response.json())
          .then(data => {
              console.log("Login Success:", data);
              // แจ้ง Unity ผ่าน WebSocket
              fetch("https://smith11.ce.kmitl.ac.th:8181/notify", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ accessToken: token })
              });
              // ส่ง deep link กลับไปให้ Unity
              window.location.href = "unitydl://auth?access_token=" + token;
              setTimeout(() => { window.open('', '_self', ''); window.close(); }, 1000);
          })
          .catch(error => {
              console.error("Error:", error);
              window.location.href = "https://smith11.ce.kmitl.ac.th/error";
          });
      } else {
          window.location.href = "https://smith11.ce.kmitl.ac.th/error";
      }
    </script>
  `);
});

app.get("/error", (req, res) => {
  res.send("<h1>Error</h1><p>Authentication failed. Please try again.</p>");
});

app.post("/register", async (req, res) => {
  const { accessToken } = req.body;
  if (!accessToken) {
    console.error("No accessToken received!");
    return res.status(400).json({ error: "No accessToken provided" });
  }
  try {
    console.log("Verifying Google Token...");
    const googleResponse = await axios.get(
      `https://www.googleapis.com/oauth2/v3/userinfo`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    console.log("Google Response:", googleResponse.data);
    const { email, name } = googleResponse.data;

    // ตรวจสอบว่าอีเมลลงท้ายด้วย @kmitl.ac.th หรือไม่
    if (!email.endsWith("@kmitl.ac.th")) {
      console.log(`Unauthorized email attempt: ${email}`);
      notifyUnityError(accessToken, email); // เรียกให้ Unity แสดง Error ทันที
      return res.status(403).json({ error: "Unauthorized email domain" });
    }

    // const now = new Date();
    // now.setHours(now.getHours() + 7); // ปรับเวลาตามไทย
    // const last_active = now.toISOString().slice(0, 19).replace("T", " ");
    const role_id = 3;

    const [existingUser] = await db.query("SELECT * FROM user WHERE uid = ?", [
      email,
    ]);
    if (existingUser.length > 0) {
      await db.query(
        "UPDATE user SET last_active = CURRENT_TIMESTAMP, role_id = ? WHERE uid = ?",
        [role_id, email]
      );
      console.log(`User ${email} updated successfully`);
      notifyUnity(accessToken, email);
      return res.json({ message: "User updated successfully", userId: email });
    } else {
      await db.query(
        "INSERT INTO user (uid, name, role_id, last_active) VALUES (?, ?, ?, CURRENT_TIMESTAMP)",
        [email, name, role_id]
      );
      console.log(`User ${email} registered successfully`);
      notifyUnity(accessToken, email);
      return res.json({
        message: "User registered successfully",
        userId: email,
      });
    }
  } catch (error) {
    console.error("Google Token Verification Failed:", error);
    return res.status(400).json({ error: "Invalid Google Token" });
  }
});


// ฟังก์ชันแจ้งเตือน Unity ให้แสดง Error
function notifyUnityError(accessToken, email) {
  const payload = JSON.stringify({ error: "Unauthorized email domain", email });

  console.log("Sending error notification to WebSocket:", payload);

  // ส่ง error ไปยัง **ทุก Unity client** ที่เชื่อมต่อ
  wssUnity.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
      console.log(" Sent error message to Unity:", payload);
    }
  });
}




// ======== [ ใหม่ ] สร้าง Endpoint เพื่อดึงข้อมูล practice ========
// GET /api/practice/:practiceId
app.get("/api/practice/:practiceId", async (req, res) => {
  const { practiceId } = req.params;
  try {
    // SELECT จากตาราง practice
    const sql = "SELECT * FROM practice WHERE practice_id = ?";
    const [rows] = await db.query(sql, [practiceId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Practice not found" });
    }
    // ส่งกลับแถวแรก (เพราะ practice_id เป็น unique)
    return res.json(rows[0]);
  } catch (error) {
    console.error("Error selecting practice:", error);
    return res.status(500).json({ error: error.message });
  }
});


// ------------------ Endpoint สำหรับ Practice socre------------------
app.post("/api/saveScore", async (req, res) => {
  try {
    // รับข้อมูล JSON ที่ส่งมาจาก Unity
    const { userId, practiceId, quizData } = req.body;

    // เช็คว่ามีค่าไหม
    if (!userId || !practiceId || !quizData) {
      return res.status(400).json({ error: "Invalid request body" });
    }

    // ดึงค่า score
    const score = quizData.score || 0;

    // ตัวอย่าง: ถ้าคุณต้องการเก็บ JSON อื่น ๆ เพิ่ม เช่น digitalDataJson ก็สามารถดึงมาได้เหมือนกัน
    // const digitalJson = req.body.digitalDataJson || "{}";

    // INSERT ลงตาราง practicesave
    const sql = `
      INSERT INTO practicesave (uid, practice_id, submit_date, score)
      VALUES (?, ?, CURRENT_TIMESTAMP, ?)
    `;
    const [result] = await db.query(sql, [userId, practiceId, score]);

    console.log(`Score saved for user=${userId} practice=${practiceId} score=${score}`);

    // ส่ง response กลับ
    return res.json({
      message: "Score saved successfully",
      insertId: result.insertId,
    });
  } catch (error) {
    console.error("Error saving score:", error);
    return res.status(500).json({ error: error.message });
  }
});



// Endpoint สำหรับเซฟข้อมูล Simulator (INSERT)
app.post("/api/simulator/save", async (req, res) => {
  try {
    const { userId, saveJson } = req.body;
    if (!userId || !saveJson) {
      return res.status(400).json({ error: "userId or saveJson is missing" });
    }
   
    // นับจำนวน row เฉพาะ userId นี้ เพื่อจะตั้งชื่อ "Save X"
    const getCountSql =
      "SELECT COUNT(*) AS userSaves FROM savecircuit WHERE uid = ?";
    const [countRows] = await db.query(getCountSql, [userId]);
    const newIndex = countRows[0].userSaves + 1;

    // ตั้งชื่อเป็น Save <ลำดับของ userId นี้>
    const simulateName = `Save ${newIndex}`;

    // INSERT ลงตาราง
    const sql = `
      INSERT INTO savecircuit (uid, circuit_json, circuit_date, circuit_name )
      VALUES (?, ?, CURRENT_TIMESTAMP, ? )
    `;
    const [result] = await db.query(sql, [
      userId,
      saveJson,
      simulateName,
      
    ]);

    return res.json({
      message: "Data saved successfully",
      simulateName: simulateName,
      insertId: result.insertId,
    });
  } catch (error) {
    console.error("Error saving simulator data:", error);
    return res.status(500).json({ error: error.message });
  }
});

// -----------------------------------------------------------
// Endpoint สำหรับโหลดข้อมูล Simulator "ล่าสุด" (GET /api/simulator/load)
app.get("/api/simulator/load", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: "No userId provided" });
    }

    // ดึงอันล่าสุด
    const sql = `
      SELECT * FROM savecircuit
      WHERE uid = ?
      ORDER BY circuit_date DESC
      LIMIT 1
    `;
    const [rows] = await db.query(sql, [userId]);

    if (!rows.length) {
      return res
        .status(404)
        .json({ error: "No save data found for this user" });
    }

    return res.json({
      message: "Load success",
      saveJson: rows[0].circuit_json,
      simulateName: rows[0].circuit_name, // เช่น "Save 1"
      simulateDate: rows[0].circuit_date,
    });
  } catch (error) {
    console.error("Error loading simulator data:", error);
    return res.status(500).json({ error: error.message });
  }
});

// -----------------------------------------------------------
// (ใหม่) Endpoint สำหรับ SaveDigital
app.get("/api/simulator/listSavesDigital", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: "No userId provided" });
    }
    const sql = `
      SELECT circuit_id, circuit_name, circuit_date
      FROM savecircuit
      WHERE uid = ? 
      ORDER BY circuit_date DESC
    `;
    const [rows] = await db.query(sql, [userId]);
    return res.json(rows);
  } catch (error) {
    console.error("Error listing simulator data:", error);
    return res.status(500).json({ error: error.message });
  }
});


// -----------------------------------------------------------
// (ใหม่) Endpoint สำหรับ "โหลดตาม ID เฉพาะเจาะจง"
app.get("/api/simulator/loadById", async (req, res) => {
  try {
    const { userId, saveId } = req.query;
    if (!userId || !saveId) {
      return res.status(400).json({ error: "userId or saveId missing" });
    }

    const sql = `
      SELECT * FROM savecircuit
      WHERE uid = ? AND circuit_id = ?
      LIMIT 1
    `;
    const [rows] = await db.query(sql, [userId, saveId]);
    if (!rows.length) {
      return res.status(404).json({ error: "No save data found" });
    }

    return res.json({
      message: "Load success",
      saveJson: rows[0].circuit_json,
      simulateName: rows[0].circuit_name,
      simulateDate: rows[0].circuit_date,
    });
  } catch (error) {
    console.error("Error loading simulator data by id:", error);
    return res.status(500).json({ error: error.message });
  }
});
// ลบเซฟตาม userId + saveId
app.delete("/api/simulator/deleteById", async (req, res) => {
  try {
    const { userId, saveId } = req.query;
    if (!userId || !saveId) {
      return res.status(400).json({ error: "userId or saveId missing" });
    }

    // ลบ row ในตาราง savecircuit
    const sql = "DELETE FROM savecircuit WHERE uid = ? AND circuit_id = ?";
    const [result] = await db.query(sql, [userId, saveId]);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({
          error: "No save data found or it doesn't belong to this user",
        });
    }

    return res.json({ message: "Delete success" });
  } catch (error) {
    console.error("Error deleting simulator data:", error);
    return res.status(500).json({ error: error.message });
  }
});

// เพิ่ม Endpoint สำหรับ Update Save (ใช้ HTTP PUT)
app.put("/api/simulator/update", async (req, res) => {
  try {
    const { userId, saveJson } = req.body;
    const { saveId } = req.query; // รับ saveId จาก query string
    if (!userId || !saveJson || !saveId) {
      return res.status(400).json({ error: "Missing parameters" });
    }
    // ใช้ SQL UPDATE แทน INSERT
    const sql = `
      UPDATE savecircuit 
      SET circuit_json = ?, circuit_date = CURRENT_TIMESTAMP 
      WHERE circuit_id = ? AND uid = ?
    `;
    const [result] = await db.query(sql, [saveJson, saveId, userId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "No save data found or it doesn't belong to this user" });
    }
    return res.json({
      message: "Update successful",
      saveId: saveId
    });
  } catch (error) {
    console.error("Error updating simulator data:", error);
    return res.status(500).json({ error: error.message });
  }
});

 
app.get("/api/practice/find/:uid", async (req, res) => {
  const { uid } = req.params;
  try {
    const sql_find_classroom = `
      SELECT p.practice_id, p.practice_name, p.practice_detail, cp.practice_status 
      FROM enrollment AS enroll 
      JOIN classroompractice AS cp 
      JOIN practice AS p 
        ON enroll.class_id = cp.class_id 
        AND cp.practice_id = p.practice_id 
      WHERE enroll.uid = ?
    `;
    
    const [rows] = await db.query(sql_find_classroom, [uid]);
    return res.status(200).json(rows);
  } catch (error) {
    console.error("Error selecting classroom practice data: ", error);
    return res.status(500).json({ error: error.message });
  }
});

//++++++++++++++++++สิ้นสุดของ UNITY++++++++++++++++++++++++++++++++++++++++++++//

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

// นับจำนวน student
app.get("/api/student/count", async (req, res) => {
  const sql = "SELECT COUNT(*) AS userCount FROM user WHERE role_id = 3";
  try {
    const [rows] = await db.query(sql);
    const userCount = rows[0].userCount;
    res.status(200).json({ count: userCount });
  } catch (err) {
    console.error("Error counting user:", err);
    res.status(500).json({ error: "Count user failed" });
  }
});

// นับจำนวน teacher
app.get("/api/teacher/count", async (req, res) => {
  const sql = "SELECT COUNT(*) AS userCount FROM user WHERE role_id = 1";
  try {
    const [rows] = await db.query(sql);
    const userCount = rows[0].userCount;
    res.status(200).json({ count: userCount });
  } catch (err) {
    console.error("Error counting user:", err);
    res.status(500).json({ error: "Count user failed" });
  }
});

// นับจำนวน report
app.get("/api/report/count", async (req, res) => {
  try {
    const sql = "SELECT COUNT(*) AS reportCount FROM report WHERE report_isread = 0";
    const [rows] = await db.query(sql);
    const reportCount = rows[0].reportCount;
    res.status(200).json({ count: reportCount });
  } catch (err) {
    console.error("Error counting report:", err);
    res.status(500).json({ error: "Count report failed" });
  }
});

// นับจำนวน classroom
app.get("/api/classroom/count", async (req, res) => {
  try {
    const sql = "SELECT COUNT(*) AS classroomCount FROM classroom";
    const [rows] = await db.query(sql);
    const classroomCount = rows[0].classroomCount;
    res.status(200).json({ count: classroomCount });
  } catch (err) {
    console.error("Error counting classroom:", err);
    res.status(500).json({ error: "Count classroom failed" });
  }
});

// นับจำนวน practice
app.get("/api/practices/count", async (req, res) => {
  try {
    const sql = "SELECT COUNT(*) AS practiceCount FROM practice";
    const [rows] = await db.query(sql);
    const practiceCount = rows[0].practiceCount;
    res.status(200).json({ count: practiceCount });
  } catch (err) {
    console.error("Error counting practice:", err);
    res.status(500).json({ error: "Count practice failed" });
  }
});

// นับจำนวน student ทั้งหมดที่อยู่ใน classroom ของ teacher
app.get("/api/student_teacher/:uid", async (req, res) => {
  const { uid } = req.params;
  try {
    const sql = `SELECT count(*) AS studentCount 
                FROM teach t 
                JOIN enrollment en ON en.class_id = t.class_id
                WHERE t.uid = ?`;
    const [rows] = await db.query(sql, [uid]);
    const studentCount = rows[0].studentCount;
    res.status(200).json({ count: studentCount });
  } catch (err) {
    console.error("Error counting user:", err);
    res.status(500).json({ error: "Count user failed" });
  }
});

// นับจำนวน classroom ทั้งหมดที่ teacher มี
app.get("/api/classroom_teacher/:uid", async (req, res) => {
  const { uid } = req.params;
  try {
    const sql = `SELECT count(*) AS classroomCount
                FROM teach
                WHERE uid = ?`;
    const [rows] = await db.query(sql, [uid]);
    const classroomCount = rows[0].classroomCount;
    res.status(200).json({ count: classroomCount });
  } catch (err) {
    console.error("Error counting classroom:", err);
    res.status(500).json({ error: "Count classroom failed" });
  }
});

// นับจำนวน practice ทั้งหมดที่ teacher เปิด
app.get("/api/practice_teacher/:uid", async (req, res) => {
  const { uid } = req.params;
  try {
    const sql = `SELECT
                SUM(CASE WHEN cp.practice_status = 1 THEN 1 ELSE 0 END) AS practiceOpen,
                COUNT(*) AS practiceCount
                FROM
                teach t
                JOIN
                classroompractice cp ON cp.class_id = t.class_id
                WHERE
                t.uid = ?`;
    const [rows] = await db.query(sql, [uid]);
    const practiceOpen = rows[0].practiceOpen || 0;
    const practiceCount = rows[0].practiceCount || 0;
    res.status(200).json({ open: practiceOpen, count: practiceCount });
  } catch (err) {
    console.error("Error counting classroom:", err);
    res.status(500).json({ error: "Count classroom failed" });
  }
});

// นับจำนวน report ที่ admin ยังไม่อ่าน
app.get("/api/report_teacher/:uid", async (req, res) => {
  const { uid } = req.params;
  try {
    const sql = `SELECT COUNT(*) AS reportCount,
    SUM(CASE WHEN report_isread = 1 THEN 1 ELSE 0 END) AS reportOpen
    FROM report WHERE uid = ?`;
    const [rows] = await db.query(sql, [uid]);
    const reportOpen = rows[0].reportOpen || 0;
    const reportCount = rows[0].reportCount || 0;
    res.status(200).json({ open: reportOpen, count: reportCount });
  } catch (err) {
    console.error("Error counting report:", err);
    res.status(500).json({ error: "Count report failed" });
  }
});

// -------------------------- ส่วน Log unity  -------------------------- //
app.post("/api/log/visitunity", async (req, res) => {
  try {
    const { uid, log_type, practice_id } = req.body;

    if (!uid || log_type === undefined || practice_id === undefined) {
      return res.status(400).json({ error: "Missing log data" });
    }

    const sql = `INSERT INTO log (uid, log_time, log_type, practice_id) VALUES (?, CURRENT_TIMESTAMP, ?, ?)`;
    await db.query(sql, [uid, log_type, practice_id]); // ✅ ใช้ await db.query() ได้เลย

    return res.status(200).json({ message: "Added log successfully" });
  } catch (err) {
    console.error("❌ Error adding log:", err);
    return res.status(500).json({ error: "Add log failed" });
  }
});

// -------------------------- ส่วน Log -------------------------- //
// เพิ่ม log
app.post("/api/log/visit", async (req, res) => {
  const { uid, log_type, practice_id } = req.body;
  const sql = "INSERT INTO log (uid, log_time, log_type, practice_id) VALUES (?, CURRENT_TIMESTAMP, ?, ?)";
  try {
    // const now = new Date();
    // now.setHours(now.getHours() + 7); // เพิ่ม 7 ชั่วโมงให้ตรงกับเวลาประเทศไทย
    // const date = now.toISOString().slice(0, 19).replace("T", " ");
    await db.query(sql, [uid, log_type, practice_id]);
    return res.status(200).json({message: "Added log successfully"});
  } catch (err) {
    console.error("Error adding log:", err);
    res.status(500).json({ error: "Add log failed" });
  }
});

// ดึงข้อมูลการเข้าใช้งานย้อนหลัง 7 วัน
app.get("/api/log/visits/7days", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT DATE(log_time) AS date, COUNT(*) AS count
      FROM log
      WHERE DATE(log_time) >= DATE_SUB(CURDATE(), INTERVAL 6 DAY) AND DATE(log_time) <= CURDATE() AND log_type = 0
      GROUP BY DATE(log_time)
      ORDER BY date ASC;
    `);

    // สร้าง array ของวันที่ย้อนหลัง 7 วัน (เรียงจากอดีตไปอนาคต)
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      dates.push(date.toISOString().split('T')[0]);
    }

    // สร้าง object โดยมีวันที่เป็น key และจำนวนเป็น value (เติม 0 สำหรับวันที่ไม่มีข้อมูล)
    const formattedData = {};
    dates.forEach((date) => {
      let foundRow = null;
      for (const row of rows) {
        const rowDate = new Date(row.date);
        // แปลง UTC เป็น +07:00 (โดยประมาณ)
        rowDate.setHours(rowDate.getHours() + 0);
        if (rowDate.toISOString().split('T')[0] === date) {
          foundRow = row;
          break;
        }
      }
      formattedData[date] = foundRow ? foundRow.count : 0;
    });

    return res.status(200).json(formattedData);
  } catch (error) {
    console.error('Error fetching log data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ดึงข้อมูลการเข้าใช้แบบทดสอบย้อนหลัง 7 วัน
app.get("/api/log/practice/7days", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT DATE(log_time) AS date, p.practice_name, COUNT(*) AS count
      FROM log l JOIN practice p ON p.practice_id = l.practice_id
      WHERE DATE(log_time) >= DATE_SUB(CURDATE(), INTERVAL 6 DAY) AND DATE(log_time) <= CURDATE() AND log_type = 1
      GROUP BY DATE(log_time), p.practice_name
      ORDER BY date ASC, p.practice_name ASC;
    `);

    // สร้าง array ของวันที่ย้อนหลัง 7 วัน (เรียงจากอดีตไปอนาคต)
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      dates.push(date.toISOString().split('T')[0]);
    }

    // สร้าง object โดยมีวันที่เป็น key และ array ของ practice_id และจำนวนเป็น value
    const formattedData = {};
    dates.forEach((date) => {
      formattedData[date] = [];
      const filteredRows = rows.filter(row => {
        const rowDate = new Date(row.date);
        // แปลง UTC เป็น +07:00 (โดยประมาณ)
        rowDate.setHours(rowDate.getHours() + 7);
        return rowDate.toISOString().split('T')[0] === date;
      });
      filteredRows.forEach(row => {
        formattedData[date].push({
          practice_name: row.practice_name,
          count: row.count
        });
      });
    });
    return res.status(200).json(formattedData);
  } catch (error) {
    console.error('Error fetching log data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// -------------------------- Begin จัดการข้อมูล Practice (Admin) -------------------------- //
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

// ดึงข้อมูล practice จาก classroom_table แบบแยกว่าคลาสที่เรียกมาได้ใช้มั้ย
app.get("/api/practice/classroom/:class_id", async (req, res) => {
  const { class_id } = req.params;
  const sql = `SELECT p.*, 
               CASE 
                WHEN cp.practice_id IS NOT NULL THEN 1 
                ELSE 0 
                END AS is_assigned
              FROM practice p
              LEFT JOIN classroompractice cp 
                  ON p.practice_id = cp.practice_id 
                  AND cp.class_id = ?`;
  try {
    const [rows] = await db.query(sql, [class_id]);
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error filtering data (practice):", err);
    res.status(500).json({ error: "Query data practice failed" });
  }
});



// เพิ่ม practice
app.post("/api/practice", async (req, res) => {
  const { practice_name, practice_detail, practice_score } = req.body;

  if (!practice_name || !practice_detail || !practice_score) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // const now = new Date();
  // now.setHours(now.getHours() + 7);
  // const createDate = now.toISOString().slice(0, 19).replace("T", " ");

  const sql_insert_practice = `INSERT INTO practice (practice_name, practice_detail, practice_score, create_date)
    VALUES (?, ?, ?, CURRENT_TIMESTAMP)`;

  try {
    const [insertResult] = await db.query(sql_insert_practice, [
      practice_name,
      practice_detail,
      practice_score,
    ]);
    res.status(200).json({
      message: "Added practice successfully",
      practice_id: insertResult.insertId
    });
  } catch (err) {
    console.error("Error adding practice:", err);
    res.status(500).json({ error: "Query practice failed" });
  }
});

// ลบ practice
app.delete("/api/practice/:practice_id", async (req, res) => {
  const { practice_id } = req.params;
  const sql = `
    DELETE FROM practice 
    WHERE practice_id = ? 
      AND practice_id NOT IN (SELECT practice_id FROM classroompractice)
  `;
  try {
    const [result] = await db.query(sql, [practice_id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Practice not found or is assigned in classroompractice" });
    }
    res.status(200).json({ message: "Practice deleted successfully" });
  } catch (err) {
    console.error("Error deleting practice:", err);
    res.status(500).json({ error: "Delete practice failed" });
  }
});


// edit practice
app.put("/api/practice/:practice_id", async (req, res) => {
  try {
    const { practice_id } = req.params;
    const { practice_name, practice_detail, practice_score } = req.body;

    const updateSql = `
      UPDATE practice 
      SET practice_name = ?, practice_detail = ?, practice_score = ? 
      WHERE practice_id = ?
    `;

    const [updateResult] = await db.query(updateSql, [practice_name, practice_detail, practice_score, practice_id]);

    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ error: "Practice not found or failed to update!" });
    }

    return res.status(200).json({ message: "Practice updated successfully" });
  } catch (err) {
    console.error("Error updating practice:", err);
    return res.status(500).json({ error: "Update practice failed" });
  }
});

// API ดึงข้อมูลทั้งหมดในระบบ (classroom-table-data)
app.get("/api/classroom", async (req, res) => {
  const sql = "SELECT * FROM classroom";
  try {
    const [rows] = await db.query(sql);
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error filtering data (classroom):", err);
    res.status(500).json({ error: "Query data classroom failed" });
  }
});

// API เพิ่มและลบ classroom practice (add-classroom-practice) 

app.post("/api/classroom/practice", async (req, res) => {
  const { class_id, practice_ids } = req.body;
  try {
    for (const pid of practice_ids) {
      const sql_insert = `INSERT INTO classroompractice (class_id, practice_id, practice_status) VALUES (?, ?, '0')`;
      await db.query(sql_insert, [class_id, pid]);
    }
    res.status(200).json({ message: "Insert classroom practices successfully" });
  } catch (err) {
    console.error("Error inserting classroom practice:", err);
    res.status(500).json({ error: "Insert classroom practices failed" });
  }
});

app.delete("/api/classroom/practice", async (req, res) => {
  const { class_id, practice_ids } = req.body;
  if (!class_id || !practice_ids || !practice_ids.length) {
    return res.status(400).json({ error: "Missing class_id or practice_ids" });
  }
  try {
    for (const pid of practice_ids) {
      const sql_delete = "DELETE FROM classroompractice WHERE class_id = ? AND practice_id = ?";
      await db.query(sql_delete, [class_id, pid]);
    }
    res.status(200).json({ message: "Classroom practices removed successfully" });
  } catch (err) {
    console.error("Error removing classroom practices:", err);
    res.status(500).json({ error: "Remove classroom practices failed" });
  }
});

// -------------------------- END จัดการข้อมูล Practice (Admin) -------------------------- //

// เปลี่ยน status practice 
app.put("/api/update-status-practice", async (req, res) => {
  const { class_id, practice_id, new_status } = req.body;
  const sql_toggle = `update classroompractice set practice_status = ? 
                      where class_id = ? and practice_id = ?`;
  try {
    await db.query(sql_toggle, [new_status, class_id, practice_id]);
    res.status(200).send({ message: "Status updated successfully" });
  } catch (err) {
    console.error("Error updating status:", err);
    res.status(500).send("Error updating status");
  }
});

// -------------------------- Begin จัดการ practice สำหรับอาจารย์ -------------------------- // 
// ดึงข้อมูล Classroom ของอาจารย์ และจำนวนแบบฝึกหัดในคลาสนั้น ๆ 
app.get("/api/classroom/:uid", async (req, res) => {
  const { uid } = req.params;
  const sql = `SELECT c.*, COUNT(cp.practice_id) AS total_practice,
                SUM(CASE WHEN cp.practice_status = 0 THEN 1 ELSE 0 END) AS deactive_practice,
                SUM(CASE WHEN cp.practice_status = 1 THEN 1 ELSE 0 END) AS active_practice
                FROM classroom c
                JOIN teach t ON c.class_id = t.class_id
                LEFT JOIN classroompractice cp ON c.class_id = cp.class_id
                WHERE t.uid = ?
                GROUP BY c.class_id`;
  try {
    const [rows] = await db.query(sql, [uid]);
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error filtering data (classroom):", err);
    res.status(500).json({ error: "Query data classroom failed" });
  }
});

// ดึงข้อมูล practice ทั้งหมดของ classroom นั้น ๆ
app.get("/api/classroom/practice/:class_id", async (req, res) => {
  const { class_id } = req.params;
  const sql_practice = `SELECT 
                            p.practice_id, 
                            p.practice_name, 
                            p.practice_detail, 
                            cp.practice_status, 
                            c.class_id, 
                            c.class_name, 
                            c.sec,
                            COUNT(DISTINCT e.uid) AS enrolled_count,
                            COUNT(DISTINCT CASE WHEN ps.score IS NOT NULL THEN e.uid END) AS submit_total
                        FROM classroompractice cp
                        JOIN practice p 
                            ON p.practice_id = cp.practice_id
                        JOIN classroom c 
                            ON c.class_id = cp.class_id
                        LEFT JOIN enrollment e 
                            ON e.class_id = cp.class_id
                        LEFT JOIN practicesave ps
                            ON ps.practice_id = cp.practice_id 
                            AND ps.uid = e.uid
                        WHERE cp.class_id = ?
                        GROUP BY p.practice_id, 
                                p.practice_name, 
                                p.practice_detail, 
                                cp.practice_status, 
                                c.class_id, 
                                c.class_name, 
                                c.sec`;
  try {
    const [rows] = await db.query(sql_practice, [class_id]);
    if (rows.length === 0) {
      return res.status(200).json([]);
    }
    return res.status(200).json(rows);
  } catch (err) {
    console.error("Error select practice data :", err);
    return res.status(500).json({ error: "Select practice failed" });
  }
});

// ดึงข้อมูล practice save และ score
app.get("/api/classroom/practice/:class_id/:practice_id", async (req, res) => {
  const { class_id, practice_id } = req.params;
  const sql_practice_score = `SELECT 
                                  u.uid,
                                  u.name,
                                  ps.score AS max_score,
                                  ps.submit_date,
                                  p.practice_score
                              FROM classroompractice cp
                              JOIN classroom c 
                                  ON cp.class_id = c.class_id
                              JOIN practicesave ps 
                                  ON cp.practice_id = ps.practice_id
                              JOIN user u
                                  ON ps.uid = u.uid
                              JOIN practice p  
                                  ON cp.practice_id = p.practice_id
                              JOIN (
                                  SELECT uid, MAX(score) AS max_score
                                  FROM practicesave
                                  GROUP BY uid
                              ) AS max_scores
                                  ON ps.uid = max_scores.uid AND ps.score = max_scores.max_score
                              WHERE cp.class_id = ? 
                                AND cp.practice_id = ?`;
  try {
    const [rows] = await db.query(sql_practice_score, [class_id, practice_id]);
    if (rows.length === 0) {
      return res.status(200).json([]);
    }
    return res.status(200).json(rows);
  } catch (err) {
    console.error("Error select practice score :", err);
    return res.status(500).json({ error: "Select practice failed" });
  }
});
// -------------------------- END จัดการ practice สำหรับอาจารย์ -------------------------- // 


// ดึงข้อมูล classroom ทั้งหมดของครู
app.get("/api/classroom/teach/:uid", async (req, res) => {
  const { uid } = req.params;
  const sql_teach = "SELECT class_id FROM teach WHERE uid = ?";
  try {
    const [teachRows] = await db.query(sql_teach, [uid]);
    if (teachRows.length === 0) {
      return res.status(404).json({ message: "No classrooms found for this user" });
    }
    const classIds = teachRows.map((row) => row.class_id);
    const sql_classroom = "SELECT classroom.*, teach.role FROM classroom JOIN teach ON classroom.class_id = teach.class_id WHERE classroom.class_id IN (?) AND teach.uid = ?";
    const [classRows] = await db.query(sql_classroom, [classIds, uid]);
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
    await db.query(sql_enroll, [class_id]);
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
    if (checkAnotherClass.length > 0) {
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
    return res.status(200).json(rows);
  } catch (err) {
    console.error("Error select user student:", err);
    return res.status(500).json({ error: "Select user student failed" });
  }
});

// เพิ่ม student เข้า classroom
app.post("/api/classroom/student", async (req, res) => {
  const { uid, class_id, data } = req.body;
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
    // const now = new Date();
    // now.setHours(now.getHours() + 7); // เพิ่ม 7 ชั่วโมงให้ตรงกับเวลาประเทศไทย
    // const enrollDate = now.toISOString().slice(0, 19).replace("T", " ");

    const sql_enroll = "INSERT INTO enrollment (uid, class_id, enroll_date) VALUES (?, ?, CURRENT_TIMESTAMP)";
    await db.query(sql_enroll, [processedUid, class_id]);
    res.status(200).send({ message: "Added student to classroom successfully" });
  } catch (err) {
    console.error("Error insert student:", err);
    return res.status(500).json({ error: "Insert student failed" });
  }
});

// เพิ่ม student เข้า classroom แบบข้อมูล Excel
app.post("/api/classroom/student/multidata", async (req, res) => {
  const { uid, class_id } = req.body.data;
  const data = req.body.data.data;
  const user_failed = [];
  if (data.length === 0) {
    return res.status(404).json({ error: "No data user" });
  }
  try {
    const sql_check_user = "SELECT * FROM user WHERE uid = ?";
    const sql_insert_user = "INSERT INTO user (uid, name, role_id, last_active) VALUES(?, ?, 3, CURRENT_TIMESTAMP)";
    const sql_enroll_select = "SELECT * FROM enrollment WHERE uid = ?";
    const sql_enroll = "INSERT INTO enrollment (uid, class_id, enroll_date) VALUES (?, ?, CURRENT_TIMESTAMP)";

    // const now = new Date();
    // now.setHours(now.getHours() + 7); // เพิ่ม 7 ชั่วโมงให้ตรงกับเวลาประเทศไทย
    // const last_active = now.toISOString().slice(0, 19).replace("T", " ");

    const promises = data.map(async students => {
      const uid = String(students?.id || "");
      const name = students.name;
      let processedUid = uid.endsWith("@kmitl.ac.th") ? uid : `${uid}@kmitl.ac.th`;
      const [checkStudent] = await db.query(sql_check_user, [processedUid]);
      // ตรวจสอบ user
      if (checkStudent.length === 0) {
        await db.query(sql_insert_user, [processedUid, name])
      }
      else if (checkStudent[0].role_id !== 3) {
        user_failed.push({ uid: uid, name: name });
      }
        // ตรวจสอบ enrollment
        const [enrollRows] = await db.query(sql_enroll_select, [processedUid]);
        if (enrollRows.length === 0) {
          await db.query(sql_enroll, [processedUid, class_id]);
        } else {
          user_failed.push({ uid: uid, name: name });
      }
    });
    await Promise.all(promises);
    return res.status(200).json(user_failed);

  } catch (err) {
    console.error("Error insert student:", err);
    return res.status(500).json({ message: "Insert student failed" });
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
    if (rows.length > 0) {
      const sql_teach_assistant = "INSERT INTO teach (uid, class_id, role) VALUES (?, ?, 2)";
      await db.query(sql_teach_assistant, [uid, class_id]);
      return res.status(200).json({ message: "Add assistant successfully" });
    } else {
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
    // const now = new Date();
    // now.setHours(now.getHours() + 7); // เพิ่ม 7 ชั่วโมงให้ตรงกับเวลาประเทศไทย
    // const enrollDate = now.toISOString().slice(0, 19).replace("T", " ");
    const sql_enroll = ("UPDATE enrollment SET class_id = ?, enroll_date = CURRENT_TIMESTAMP WHERE uid = ?");
    const [updateResult] = await db.query(sql_enroll, [class_id, uid])
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


// API: ดึงข้อมูล report

app.get("/api/report", async (req, res) => {
  const { email } = req.query; // รับค่าผ่าน Query Parameters
  if (!email) {
    return res.status(400).json({ error: "Missing 'email' query parameter" });
  }
  // only user
  const sql = "SELECT * FROM report WHERE uid = ? ORDER BY report_create_date DESC";
  try {
    const [rows] = await db.query(sql, [email]);
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error filtering data (report):", err);
    res.status(500).json({ error: "Query data Report failed" });
  }
});
/******************************************************************************* */
/******* ดึงข้อมูล Report ฝั่ง Admin (ใช้ Promise)***********/
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

/********************************************************************************* */
//  API: เพิ่ม Report 
app.post("/api/addreport", async (req, res) => {
  const { uid, report_name, report_detail, report_create_date } = req.body;

  
  if (!uid || !report_name || !report_detail || !report_create_date) {
    return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบทุกฟิลด์" });
  }

  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {

    // เพิ่ม Report

    const [reportResult] = await connection.execute(
      `INSERT INTO report (uid, report_name, report_detail, report_create_date, report_isread) 
      VALUES (?, ?, ?, ?, ?)`,
      [uid, report_name, report_detail, report_create_date, 0]
    );


    await connection.commit();
    connection.release();

    res.status(200).json({

      message: "เพิ่มรายงานและแจ้งเตือนสำเร็จ"
      // report_id: reportId,
    });

    // แจ้งเตือน WebSocket Clients
    broadcastData();


  } catch (error) {
    await connection.rollback();
    connection.release();

    console.error("Error:", error);

    res.status(500).json({ error: "เกิดข้อผิดพลาดในการเพิ่มข้อมูล" });
  }
});


/**** */


/************************** ดึงข้อมูล Report ฝั่ง Admin   WebSocket ******************************/

const fetchUnreadNotifications = async () => {
  try {
    const sql = "SELECT COUNT(*) AS unread_count FROM report WHERE report_isread = 0";
    const [result] = await db.query(sql);
    return result[0]?.unread_count ?? 0;
  } catch (error) {
    console.error("Database error:", error);
    return 0;
  }
};


//  ฟังก์ชันดึงรายการแจ้งเตือนทั้งหมด
const fetchNotifications = async () => {
  try {
    //ต้องการ ให้ is_read == 0 แสดงก่อน และเรียงวันที่จากน้อยไปมาก
    const sql = "SELECT * FROM report  ORDER BY report_isread ASC, report_create_date DESC;";
    // const sql = "SELECT * FROM report as re, notifications as noti WHERE re.report_id = noti.report_id ORDER BY created_at DESC";
    const [result] = await db.query(sql);
    return result;
  } catch (error) {
    console.error(" Database error fetching notifications:", error);
    return [];
  }
};

// ฟังก์ชันดึงข้อมูล `Reports`
const fetchReports = async () => {
  try {
    // ต้องการ ให้ is_read == 0 แสดงก่อน และเรียงวันที่จากน้อยไปมาก
    const sql = `SELECT * FROM report ORDER BY report_create_date DESC`;
    const [result] = await db.query(sql);
    return result;
  } catch (error) {
    console.error("Database error fetching reports:", error);

    return [];
  }
};


// ฟังก์ชัน Broadcast ข้อมูลไปยัง WebSocket Clients

const broadcastData = async () => {
  const unreadCount = await fetchUnreadNotifications();
  const notifications = await fetchNotifications(); // ดึงรายการแจ้งเตือนทั้งหมด
  const reports = await fetchReports();

  const data = JSON.stringify({
    unread_count: unreadCount,
    notifications: notifications,
    reports: reports,
  });

  wssWeb.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(data);
    }
  });


  // console.log(" Broadcast: ", { unread_count: unreadCount, notifications: notifications.length, reports: reports.length });
};

//  API ดึงจำนวนแจ้งเตือนใหม่

app.get("/api/countnotifications", async (req, res) => {
  try {
    const unreadCount = await fetchUnreadNotifications();
    res.status(200).json({ unread_count: unreadCount });
    broadcastData();
  } catch (error) {

    console.error("Error fetching notifications count:", error);

    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลแจ้งเตือน" });
  }
});


//  API ดึงรายการแจ้งเตือนทั้งหมด
app.get("/api/all_notifications", async (req, res) => {
  try {
    const notifications = await fetchNotifications();
    res.status(200).json(notifications);
    broadcastData();
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลแจ้งเตือน" });
  }
});

//  API ดึง `Reports` ทั้งหมด

app.get("/api/adminreport", async (req, res) => {
  try {
    const reports = await fetchReports();
    res.status(200).json(reports);
    broadcastData();
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ error: "Query data Report failed" });
  }
});


//  WebSocket Connection
wssWeb.on("connection", (ws) => {
  // console.log(" Client connected to WebSocket 5050");

  //  ส่งจำนวนแจ้งเตือนให้ Client ที่เพิ่งเชื่อมต่อ
  const sendInitialData = async () => {
    const unreadCount = await fetchUnreadNotifications();
    const reports = await fetchReports();
    const notifications = await fetchNotifications(); //  เพิ่มข้อมูลแจ้งเตือน
    ws.send(JSON.stringify({ unread_count: unreadCount, reports: reports, notifications: notifications }));
  };

  sendInitialData();

  ws.on("close", () => {
    // console.log("Client disconnected");
  });
});

// -----------------------------------------------------------


// เปลี่ยน update-notification
// app.put("/api/update-notification", async (req, res) => {
//   const { recipient_uid, report_id } = req.body;
//   const sql = "UPDATE notifications SET is_read = 1, recipient_uid = ? WHERE report_id = ?";
//   try {
//     await db.query(sql, [recipient_uid, report_id]);
//     res.status(200).send({ message: "notification updated successfully" });

//     // แจ้งเตือน WebSocket Clients
//     broadcastData();

//   } catch (err) {
//     console.error("Error updating notification:", err);
//     res.status(500).send("Error updating notification");
//   }
// });
app.put("/api/update-notification", async (req, res) => {
  const {  report_id } = req.body;
  // const sql = "UPDATE notifications SET is_read = 1, recipient_uid = ? WHERE report_id = ?";
  const sql = `
    UPDATE report
    SET report_isread = 1, report_dateread = CURRENT_TIMESTAMP 
    WHERE report_id = ?
  `;

  try {
    // await db.query(sql, [recipient_uid, report_id]);
    // res.status(200).send({ message: "notification updated successfully" });

    const [result] = await db.query(sql, [report_id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Report not found or already updated" });
    }
    res.status(200).send({ message: "Report read status updated successfully" });
    // แจ้งเตือน WebSocket Clients
    broadcastData();

  } catch (err) {
    console.error("Error updating notification:", err);
    res.status(500).send("Error updating notification");
  }
});

//อ่านค่า read = 1 ในการเปลี่ยนสีปุ่ม
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
//     console.error("Error fetching read notifications:", error);
//     res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลแจ้งเตือนที่อ่านแล้ว" });
//   }
// });

// -----------------------------------------------------------

/************************** END ดึงข้อมูล Report ฝั่ง Admin (ใช้ Promise)   WebSocket ******************************/

// -----------------------------------------------------------

// 9) เริ่มต้น Server
// // -----------------------------------------------------------
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });


server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});