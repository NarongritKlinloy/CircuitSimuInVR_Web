// import axios from "axios";
// export const NotificationReportData = async () => {
//   // const email = sessionStorage.getItem("email"); // ดึงค่า uid จาก sessionStorage
//   try {
//     const response = await axios.get(`http://backend:5000/api/countnotifications`);
//     // headers: { "x-uid": email } // ส่งค่า uid ไปใน Query Parameters
//     console.log("NotificationReportData" +response)
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching Report', error);
//     return [];
//   }
// };
//   export default NotificationReportData;

import axios from "axios";

/**
 * ฟังก์ชันดึงจำนวนแจ้งเตือนที่ยังไม่ได้อ่าน (is_read = 0)
 */
export const NotificationReportData = async () => {
  try {
    const response = await axios.get(`http://backend:5000/api/countnotifications/0`);

    const unreadCount = response.data.unread_count || 0; // ถ้า API คืนค่า null ให้ใช้ค่า 0 แทน

    // console.log(`จำนวนแจ้งเตือนที่ยังไม่ได้อ่าน: ${unreadCount}`);
    // console.log("TT -->> "+unreadCount);

    return unreadCount; // คืนค่าเป็นตัวเลขโดยตรง
  } catch (error) {
    console.error("Error fetching Notification Report:", error);
    return 0; // คืนค่า 0 ถ้ามีข้อผิดพลาด
  }
};

export default NotificationReportData;
