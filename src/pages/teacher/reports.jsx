import React, { useState, useEffect } from "react";
import SearchAndAddReport from "./functionTables/SearchAndAddReport";
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
import { TeacherReportData } from "@/data/teacher-report"; // นำเข้าฟังก์ชัน

export function TeacherReports() {
  const [selectedDescription, setSelectedDescription] = useState(""); // เก็บรายละเอียดสำหรับ modal
  const [reports, setReports] = useState([]); // สถานะสำหรับเก็บข้อมูล API
  const [loading, setLoading] = useState(true); // สถานะโหลดข้อมูล
  const [error, setError] = useState(null); // สถานะข้อผิดพลาด
  const [searchTerm, setSearchTerm] = useState(""); // ใช้เก็บค่าการค้นหา
  const [isAddReportOpen, setIsAddReportOpen] = useState(false); // สำหรับเปิด/ปิด Modal Add New Report

// ฟังก์ชันเปิด/ปิด modal สำหรับ Add New Report
const toggleAddModal = () => {
  setIsAddReportOpen((prev) => !prev);
};

/** ฟังก์ชันสำหรับกรอง Reports ตาม `searchTerm` */
const filteredReports = reports.filter((report) => {
  const reportDate = new Date(report.report_create_date).toLocaleDateString("en-GB"); // แปลงวันที่เป็น DD/MM/YYYY
  const lowerSearchTerm = searchTerm.toLowerCase(); // แปลงเป็นตัวพิมพ์เล็กเพื่อให้ค้นหาแบบ case-insensitive

  return (
    report.report_name.toLowerCase().includes(lowerSearchTerm) || // ค้นหาจากชื่อ
    report.uid.toLowerCase().includes(lowerSearchTerm) || // ค้นหาจากผู้ใช้
    reportDate.includes(lowerSearchTerm) // ค้นหาจากวันที่
  );
});


// ฟังก์ชันแปลงวันที่ให้เป็นรูปแบบ YYYY-MM-DD HH:mm:ss
const getCurrentDateTime = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // เติม 0 ข้างหน้าเดือน
  const day = String(today.getDate()).padStart(2, "0"); // เติม 0 ข้างหน้าวัน
  const hours = String(today.getHours()).padStart(2, "0"); // เติม 0 ข้างหน้าชั่วโมง
  const minutes = String(today.getMinutes()).padStart(2, "0"); // เติม 0 ข้างหน้าหลักนาที
  const seconds = String(today.getSeconds()).padStart(2, "0"); // เติม 0 ข้างหน้าหลักวินาที

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const [newReport, setNewReport] = useState({
    uid:sessionStorage.getItem("email"),
    report_name: "",
    report_detail: "",
    report_create_date: getCurrentDateTime(), // เพิ่มฟิลด์สำหรับวันที่
  }); // สำหรับเก็บข้อมูลใหม่ของ report

  const [errors, setErrors] = useState({}); // สำหรับเก็บ errors จากการ validate

// console.log("newReportData---() ---> "+newReport.uid+" "+newReport.report_detail+" "+newReport.report_create_date+" "+newReport.report_name)
// console.log(newReport.report_name)
  // const navigate = useNavigate();



  // ฟังก์ชันดึงข้อมูลจาก TeacherReportData
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const data = await TeacherReportData(); // เรียกฟังก์ชันที่นำเข้ามา
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

const email = sessionStorage.getItem("email"); // ดึงค่า uid จาก sessionStorage
const API_URL = (`http://localhost:3000/api/report?email=${email}`);
// console.log(API_URL)
 // ฟังก์ชันดึงข้อมูลจาก API
 const fetchUsers = async () => {
  try {
    const response = await axios.get(API_URL);
    setReports(response.data); // อัปเดต state
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

// ฟังก์ชันเปิด/ปิด modal แสดงรายละเอียด
const [dialogDetailOpen, setDialogDetailOpen] = useState(false);
const handleDialogOpen = (detail) => {
  setSelectedDescription(detail);
  setDialogDetailOpen(true);
};
// ฟังก์ชันดึงข้อมูลจาก TeacherReportData
// const fetchReports = async () => {
//   try {
//     setLoading(true);
//     const data = await TeacherReportData(); // เรียกฟังก์ชันที่นำเข้ามา
//     setReports(data); // เก็บข้อมูลใน state
//   } catch (err) {
//     setError("Error fetching reports. Please try again.");
//     console.error(err);
//   } finally {
//     setLoading(false);
//   }
// };
useEffect(() => {
  console.log("Reports state:", reports); // ตรวจสอบว่า reports state ถูกอัพเดตหรือไม่
}, [reports]); // ตรวจสอบทุกครั้งที่ state เปลี่ยน




  // // ฟังก์ชันรีเซ็ต Error และข้อมูล
  // const resetState = () => {
  //   console.log("Resetting form state...");
  //   setErrors({}); // รีเซ็ต Error ให้เป็นค่าว่าง
  //   setNewReport({ report_name: "", report_detail: "", report_create_date: "" }); // รีเซ็ตข้อมูลใหม่
  //   console.log("Form state reset.");
  // };
  const resetState = (defaultState = { uid:sessionStorage.getItem("email"),report_name: "", report_detail: "", report_create_date: getCurrentDateTime() }) => {
    console.log("Resetting form state...");
    setErrors({});
    setNewReport(defaultState);
    console.log("Form state reset.");
  };
  

  // ฟังก์ชัน Validate ข้อมูลก่อนบันทึก
  const validateFields = () => {
    const newErrors = {};
    if (!newReport.report_name) newErrors.report_name = "Report Name is required";
    if (!newReport.report_detail) newErrors.report_detail = "Detail is required";
    if (!newReport.report_create_date) newErrors.report_create_date = "Report Date is required"; // ตรวจสอบ report_create_date
    setErrors(newErrors);
    const result = Object.keys(newErrors).length === 0 ? true : false
    return result;
  };
  

  


  // console.log("Data =>>", newReport);

  

  const handleSave = async () => {
    console.log("Data to send to API:", newReport);
    

    // ตรวจสอบว่า uid มีค่าหรือไม่
    if (!newReport.uid) {
      Swal.fire({
        title: "Error!",
        text: "เกิดข้อผิดพลาด: ไม่พบข้อมูลผู้ส่ง (uid)",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }
    
    // ตรวจสอบความถูกต้องของฟิลด์
    if (!validateFields()) {
      // console.log("Validation failed. Fields are missing.");
      setIsAddReportOpen(true); // ให้ Modal ค้างอยู่
      return; // หยุดการทำงานของฟังก์ชัน
    }
  
    try {
      const response = await axios.post(`http://localhost:3000/api/addreport`, newReport);
  
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
  
  
  const handleClose = () => {
    resetState(); // รีเซ็ตสถานะ Error
    setIsAddReportOpen(false);
  };
  

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
       {/* Section การค้นหาและปุ่ม Add */}
       <SearchAndAddReport 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm}
        toggleAddModal={toggleAddModal} 
      />

      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6 flex justify-between items-center">
          <Typography variant="h6" color="white">
            Feedback
          </Typography>
          {/* <Button variant="gradient" color="green" onClick={toggleAddModal}>
            New Report
          </Button> */}
        </CardHeader>
        <CardBody className="overflow-x-auto overflow-y-auto max-h-96 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto border-collapse">
            <thead>
              {/* <tr>
                <th className="border-b border-blue-gray-50 px-5 py-2">No.</th>
                <th className="border-b border-blue-gray-50 px-5 py-2">Name</th>
                <th className="border-b border-blue-gray-50 px-5 py-2">User</th>
                <th className="border-b border-blue-gray-50 px-5 py-2">Create Date</th>
                <th className="border-b border-blue-gray-50 px-5 py-2">Detail</th>
              </tr> */}
              <tr>
            {["No.", "Name", "Detail", "Create Date", "Info."].map((header) => (
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
          {filteredReports.map((report, index) => {
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
                  {report.report_detail.length > 5 
                        ? report.report_detail.slice(0, 5) + "..." 
                        : report.report_detail}
                  </Typography>
                </td>

                 <td className={`${rowClassName} text-center`}>
                  <Typography className="text-s font-normal text-blue-gray-500">
                  {new Date(report.report_create_date).toLocaleString("en-GB", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                              hour12: false,
                            }).replace(",", "")}
                  </Typography>
                </td> 

                <td className={`${rowClassName} text-center`}>
                  <button
                    onClick={() => handleDialogOpen(report.report_detail)}
                    className="text-blue-500 hover:text-blue-900"
                  >
                    {/* <PencilSquareIcon className="h-5 w-5" /> */}
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
            onClick={() => setDialogDetailOpen(false)}
          >
            Close
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

export default TeacherReports;