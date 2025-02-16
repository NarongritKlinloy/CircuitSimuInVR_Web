import React, { useState, useEffect } from "react";
import SearchAdmin from "../teacher/functionTables/SearchAdmin";
import axios from "axios";
import Swal from 'sweetalert2';
import {
  PencilSquareIcon,
  TrashIcon,
  UserPlusIcon,
} from "@heroicons/react/24/solid";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
} from "@material-tailwind/react";
import { updateNotificationAPI } from "@/data/updateNotification";
import { fetchReadNotifications } from "@/data/fetchReadNoti";
import ReportTableData from "@/data/report-data";

export function Notifications() {
  const [selectedDescription, setSelectedDescription] = useState(""); // เก็บรายละเอียดสำหรับ modal
  const [reports, setReports] = useState([]); // สถานะสำหรับเก็บข้อมูล API
  const [loading, setLoading] = useState(true); // สถานะโหลดข้อมูล
  const [error, setError] = useState(null); // สถานะข้อผิดพลาด

  const [isAddReportOpen, setIsAddReportOpen] = useState(false); // สำหรับเปิด/ปิด Modal Add New Report

// ฟังก์ชันเปิด/ปิด modal สำหรับ Add New Report
const toggleAddModal = () => {
  setIsAddReportOpen((prev) => !prev);
};

  // ฟังก์ชันแปลงวันที่ให้เป็นรูปแบบ YYYY-MM-DD
const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // เติม 0 ข้างหน้าเดือน
  const day = String(today.getDate()).padStart(2, "0"); // เติม 0 ข้างหน้าวัน
  return `${year}-${month}-${day}`;
};

const [newReport, setNewReport] = useState({
    report_uid:sessionStorage.getItem("email"),
    report_name: "",
    report_detail: "",
    report_date: getCurrentDate(), // เพิ่มฟิลด์สำหรับวันที่
  }); // สำหรับเก็บข้อมูลใหม่ของ report

  const [errors, setErrors] = useState({}); // สำหรับเก็บ errors จากการ validate

// console.log("selectedReportId---() ---> "+selectedReportId)

  // const navigate = useNavigate();



  // ฟังก์ชันดึงข้อมูลจาก TeacherReportData
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const data = await ReportTableData(); // เรียกฟังก์ชันที่นำเข้ามา
        setReports(data); // เก็บข้อมูลใน state
      } catch (err) {
        setError("Error fetching reports. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports(); // เรียกฟังก์ชันดึงข้อมูล
  }, []); // ทำงานครั้งเดียวตอน component ถูก mount

//useEffect เพื่อโหลดข้อมูล is_read = 1
  useEffect(() => {
    const loadReadNotifications = async () => {
      const email = sessionStorage.getItem("email"); // ✅ ดึง email ของผู้ใช้
      const readReports = await fetchReadNotifications(email); // ✅ ดึง `report_id` ที่อ่านแล้วจาก API
  
      if (readReports && Array.isArray(readReports)) {
        const reportIds = readReports.map(item => item.report_id); // ✅ แปลงเป็นอาร์เรย์ของ `report_id`
        setUpdatedReports(reportIds); // ✅ บันทึกค่าเพื่อเปลี่ยนสีปุ่ม
        fetchUsers(); 
      }
    };
  
    loadReadNotifications(); // ✅ โหลดข้อมูลเมื่อหน้าโหลด
  }, []);
  




const email = sessionStorage.getItem("email"); // ดึงค่า uid จาก sessionStorage
const API_URL = (`http://localhost:5000/api/report?email=${email}`);
 // ฟังก์ชันดึงข้อมูลจาก API
 const fetchUsers = async () => {
  try {
    const response = await axios.get(API_URL);
    setReports(response.data); // อัปเดต state
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

const recipient_uid = sessionStorage.getItem("email"); // ✅ ดึง email ของผู้ใช้
// ✅ เพิ่ม useState เก็บ report_id ที่เลือก
const [selectedReportId, setSelectedReportId] = useState(null);

console.log("data-->> "+selectedReportId)
console.log("recipient_uid", recipient_uid,"selectedReportId",selectedReportId);
// ฟังก์ชันเปิด/ปิด modal แสดงรายละเอียด
const [dialogDetailOpen, setDialogDetailOpen] = useState(false);

const handleDialogOpen = (detail,reportId) => {
  setSelectedDescription(detail);
  setSelectedReportId(reportId); // เก็บ report_id เพื่อใช้ใน handleCloseDialog
  setDialogDetailOpen(true);
  console.log("recipient_uid", recipient_uid,"selectedReportId",selectedReportId);
};

//useState เพื่อเก็บ updatedReports ที่จะบันทึกว่า report_id ไหนอัปเดตสำเร็จแล้ว
const [updatedReports, setUpdatedReports] = useState([]);



// const handleClose = () => {
  //   resetState(); // รีเซ็ตสถานะ Error
  //   setIsAddReportOpen(false);
  // };


  const handleClose = async () => {
    setDialogDetailOpen(false); // ✅ ปิด Modal
  
    const recipient_uid = sessionStorage.getItem("email");
    console.log("📥 Sending request to update notification...");
  
    try {
      const response = await updateNotificationAPI(recipient_uid, selectedReportId);
      console.log("✅ API Response:", response);
  
      if (response && response.message) {
        // ✅ เพิ่ม report_id ลงใน updatedReports เพื่อเปลี่ยนสีปุ่มทันที
        setUpdatedReports((prev) => [...prev, selectedReportId]);
      }
  
      // ✅ รีเฟรชข้อมูลแจ้งเตือนจาก API เพื่อให้แน่ใจว่าปุ่มเปลี่ยนสีหลัง Refresh
      const readReports = await fetchReadNotifications(recipient_uid);
      if (readReports && Array.isArray(readReports)) {
        const reportIds = readReports.map(item => item.report_id);
        setUpdatedReports(reportIds); // ✅ อัปเดต State
      }
    } catch (error) {
      console.error("❌ Error updating notification:", error);
    }
  };
  

  


useEffect(() => {
  console.log("Reports state:", reports); // ตรวจสอบว่า reports state ถูกอัพเดตหรือไม่
}, [reports]); // ตรวจสอบทุกครั้งที่ state เปลี่ยน


  console.log("Data =>>", newReport);

  

  const handleSave = async () => {
    console.log("Data to send to API:", newReport);
  
    // ตรวจสอบความถูกต้องของฟิลด์
    if (!validateFields()) {
      // console.log("Validation failed. Fields are missing.");
      setIsAddReportOpen(true); // ให้ Modal ค้างอยู่
      return; // หยุดการทำงานของฟังก์ชัน
    }
  
    try {
      const response = await axios.post(`http://localhost:5000/api/addreport`, newReport);
  
      if (response.status === 200) {
        Swal.fire({
          title: "Added!",
          text: `${newReport.report_name} has been added.`,
          icon: "success",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600",
          },
        }).then(() => {
          fetchUsers(); // ดึงข้อมูลใหม่
          resetState(); // รีเซ็ตฟอร์ม
        });
      }
    } catch (err) {
      Swal.fire({
        title: "Error!",
        text: `Cannot add ${newReport.report_name}. Please try again.`,
        icon: "error",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "bg-red-500 text-white rounded px-4 py-2 hover:bg-blue-600",
        },
      });
    }
    setIsAddReportOpen(false); // ปิด Modal
  };
  
  
  

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
       {/* Section การค้นหาและปุ่ม Add */}
       <SearchAdmin 
        toggleAddModal={toggleAddModal} 
      />

      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6 flex justify-between items-center">
          <Typography variant="h6" color="white">
            Reports
          </Typography>
          {/* <Button variant="gradient" color="green" onClick={toggleAddModal}>
            New Report
          </Button> */}
        </CardHeader>
        <CardBody className="overflow-x-auto pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto border-collapse">
            <thead>
              <tr>
            {["No.", "Name", "User", "Create Date", "Detail"].map((header) => (
              <th
                key={header}
                className={`border-b border-blue-gray-50 px-5 py-2 ${header === "Name" ? "text-left" : "text-center"}`}
              >
                <Typography
                  variant="small"
                  className="text-[11px] font-bold uppercase text-blue-gray-400"
                >
                  {header}
                </Typography>
              </th>
            ))}
          </tr>
            </thead>
            <tbody>
          {reports.map((report, index) => {
            const isLast = index === reports.length - 1;
            const rowClassName = `py-3 px-5 align-middle ${isLast ? "" : "border-b border-blue-gray-50"}`;

            return (
              <tr key={report.report_id}>
                <td className={`${rowClassName} text-center`}>
                  <Typography variant="small" color="blue-gray" className="font-semibold">
                    {index + 1}
                  </Typography>
                </td>

                <td className={`${rowClassName} text-left`}>
                  <Typography className="text-s font-normal text-blue-gray-500">
                    {report.report_name}
                  </Typography>
                </td>

                <td className={`${rowClassName} text-center`}>
                  <Typography className="text-s font-normal text-blue-gray-500">
                    {report.report_uid}
                  </Typography>
                </td>

                 <td className={`${rowClassName} text-center`}>
                  <Typography className="text-s font-normal text-blue-gray-500">
                    {new Date(report.report_date).toLocaleDateString("en-GB")}
                  </Typography>
                </td> 

                <td className={`${rowClassName} text-center`}>
                  <button
                    onClick={() => handleDialogOpen(report.report_detail, report.report_id)}
                    className={`${
                      updatedReports.includes(report.report_id)
                        ? "text-green-500 hover:text-green-700" // ✅ ถ้า `is_read = 1` เป็นสีเขียว
                        : "text-red-500 hover:text-green-700"   // ✅ ปกติเป็นสีแดง
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-5 w-5"
                    >
                      <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625Z" />
                      <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
                    </svg>
                  </button>
                </td>

			        
              </tr>
            );
          })}
        </tbody>
          </table>
        </CardBody>
      </Card>

      {/* Modal รายละเอียด */}
      <Dialog open={dialogDetailOpen} handler={() => setDialogDetailOpen(false)}>
        <DialogHeader>Detail</DialogHeader>
        <DialogBody>
          <Typography >{selectedDescription}</Typography>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="gradient"
            color="blue"
            // onClick={() => setDialogDetailOpen(false)}
            onClick={handleClose}
          >
            READ
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Modal Add new report */}
      <Dialog open={isAddReportOpen} handler={handleClose}>
        <DialogHeader>Add New Report</DialogHeader>
        <DialogBody>
          <div className="flex flex-col gap-4">
            {/* Input for Report Name */}
            <Input
              label="Report Name"
              value={newReport.report_name || ""}
              onChange={(e) => setNewReport({ ...newReport, report_name: e.target.value })}
              error={!!errors.report_name}
            />
            {errors.report_name && (
              <Typography variant="small" color="red" className="mt-1">
                {errors.report_name}
              </Typography>
            )}

            {/* Textarea for Detail */}
            <div className="flex flex-col gap-2">
              <label htmlFor="detail" className="text-sm font-medium text-gray-700">
                Detail
              </label>
              <textarea
                id="detail"
                rows="4"
                className={`p-2 border ${errors.report_detail ? "border-red-500" : "border-gray-300"} rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
                value={newReport.report_detail || ""}
                onChange={(e) => setNewReport({ ...newReport, report_detail: e.target.value })}
              />
              {errors.report_detail && (
                <Typography variant="small" color="red" className="mt-1">
                  {errors.report_detail}
                </Typography>
              )}
            </div>

          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="gradient" color="green" onClick={handleSave}>
            Submit
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default Notifications;
