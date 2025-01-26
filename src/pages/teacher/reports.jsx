import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from 'sweetalert2';
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

  const [isAddReportOpen, setIsAddReportOpen] = useState(false); // สำหรับเปิด/ปิด Modal Add New Report

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

  const navigate = useNavigate();



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


  // ฟังก์ชันเปิด/ปิด modal แสดงรายละเอียด
  const [dialogDetailOpen, setDialogDetailOpen] = useState(false);
  const handleDialogOpen = (detail) => {
    
    setSelectedDescription(detail);
    setDialogDetailOpen(true);
  };

  // // ฟังก์ชันรีเซ็ต Error และข้อมูล
  // const resetState = () => {
  //   console.log("Resetting form state...");
  //   setErrors({}); // รีเซ็ต Error ให้เป็นค่าว่าง
  //   setNewReport({ report_name: "", report_detail: "", report_date: "" }); // รีเซ็ตข้อมูลใหม่
  //   console.log("Form state reset.");
  // };
  const resetState = (defaultState = { report_name: "", report_detail: "", report_date: "" }) => {
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
    // if (!newReport.report_date) newErrors.report_date = "Report Date is required"; // ตรวจสอบ report_date
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  

  // ฟังก์ชันบันทึกข้อมูล
  // const handleSave = async () => {
  //   console.log("Data to send to API:", newReport);
    // fetchReports(); // ดึงข้อมูลใหม่หลังจากเพิ่ม
    // setIsAddReportOpen(false); // ปิด Modal
    // resetState(); // รีเซ็ตข้อมูล
   

  //   if (validateFields()) {
     
  //     try {
       
  //       const response = await axios.post(`http://localhost:5000/api/addreport`,newReport);
  //       if (response.status == 200) {
  //         Swal.fire({
  //           title: "Added!",
  //           text: `${newReport.report_name} has been added.`,
  //           icon: "success",
  //           confirmButtonText: "OK",
  //           customClass: {
  //             confirmButton: "bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600",
  //           },
  //         });
  //         // fetchReports(); // ดึงข้อมูลใหม่
  //         resetState(); // รีเซ็ตข้อมูลในฟอร์ม
  //       }
  //     } catch (err) {
  //       Swal.fire({
  //         title: "Added!",
  //         text: `Can not add ${newReport.report_name}`,
  //         icon: "error",
  //         confirmButtonText: "OK",
  //         customClass: {
  //           confirmButton: "bg-red-500 text-white rounded px-4 py-2 hover:bg-blue-600",
  //         },
  //       });
  //     }
      
  //   }
  //   setIsAddReportOpen(false); // ปิด Modalv
  // };



  const handleSave = async () => {
    console.log("Data to send to API:", newReport);
  
    // เช็คว่า valid แล้วค่อยดำเนินการ
    if (validateFields()) {
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
            navigate(0); // นำทางไปยังหน้าเดิม (เหมือนรีเฟรช)
            
          });
          // resetState();
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
    }

    setIsAddReportOpen(false); // ปิด Modal
    
  };
  
  
  const handleClose = () => {
    resetState();
    setIsAddReportOpen(false);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="mx-auto my-20 flex flex-col gap-8">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6 flex justify-between items-center">
          <Typography variant="h6" color="white">
            Reports
          </Typography>
          <Button variant="gradient" color="green" onClick={() => setIsAddReportOpen(true)}>
            New Report
          </Button>
        </CardHeader>
        <CardBody className="overflow-x-auto pt-0 pb-2">
          <table className="w-full min-w-max table-auto border-collapse border mx-auto text-center">
            <thead>
              <tr>
                <th className="border px-4 py-2">No.</th>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">User</th>
                <th className="border px-4 py-2">Create Date</th>
                <th className="border px-4 py-2">Detail</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report, index) => (
                <tr key={report.report_id}>
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{report.report_name}</td>
                  <td className="border px-4 py-2">{report.report_uid}</td>
                  <td className="border px-4 py-2">
                    {new Date(report.report_date).toLocaleDateString('en-GB')}
                  </td>
                  <td className="border px-4 py-2">
                    <Button
                      variant="text"
                      color="blue"
                      onClick={() => handleDialogOpen(report.report_detail)}
                    >
                      Detail
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>

      {/* Modal รายละเอียด */}
      <Dialog open={dialogDetailOpen} handler={() => setDialogDetailOpen(false)}>
        <DialogHeader>Detail</DialogHeader>
        <DialogBody>
          <Typography>{selectedDescription}</Typography>
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

            {/* Input for Report Date */}
            {/* <div className="flex flex-col gap-2">
              <label htmlFor="report_date" className="text-sm font-medium text-gray-700">
                Report Date
              </label>
              <input
                type="date"
                id="report_date"
                value={newReport.report_date || ""}
                onChange={(e) => setNewReport({ ...newReport, report_date: e.target.value })}
                className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.report_date && (
                <Typography variant="small" color="red" className="mt-1">
                  {errors.report_date}
                </Typography>
              )}
            </div> */}
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
