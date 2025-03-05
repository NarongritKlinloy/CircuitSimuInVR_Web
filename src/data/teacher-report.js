
import axios from "axios";
export const TeacherReportData = async () => {
  const email = sessionStorage.getItem("email"); // ดึงค่า uid จาก sessionStorage
  try {
    const response = await axios.get(`http://backend:5000/api/report?email=${email}`);
    // headers: { "x-uid": email } // ส่งค่า uid ไปใน Query Parameters
    return response.data;
  } catch (error) {
    console.error('Error fetching Report', error);
    return [];
  }
};
  export default TeacherReportData;

// export const TeacherReportData = [
//   {
//     title: "ปิดแบบฝึกหัดไม่ได้",
//     detail: "ไม่สามารถปิดแบบฝึกหัดได้ กดแล้วไม่มีอะไรเปลี่ยนแปลง",
//     date: "14/09/20",
//     status: "Pending",
//   },
//   {
//     title: "ย้ายชื่อนักศึกษาไม่ได้",
//     detail: "สามารถเลือกนักศึกกษาได้ แต่พอกดยืนยันกลับไม่มีอะไรเกิดขึ้น",
//     date: "14/09/20",
//     status: "Success",
//   },
//   {
//     title: "เพิ่มห้องเรียน",
//     detail: "สามารถเพิ่มห้องเรียนได้ แต่ไม่รายละเอียดไปไม่ครบ ขาดเรื่องของปีการศึกษา บนหน้าเว็บก็เหมือนมีการดึงข้อมูลมาผิด เนื่องจากตรวจสอบในหลาย ๆ อย่างแล้วพบว่าข้อมูลไม่ตรง",
//     date: "14/09/20",
//     status: "Success",
//   },
// ];

// export default TeacherReportData;

