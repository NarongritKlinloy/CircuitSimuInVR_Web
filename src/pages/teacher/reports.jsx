import React, { useState, useEffect } from "react";
import {
  // textarea, // ถ้าไม่ได้ใช้จริงสามารถลบออกได้
  Input,
  Typography,
  Card,
  CardHeader,
  CardBody,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { TeacherReportData } from "@/data/teacher-report";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

export function TeacherReports() {
  const navigate = useNavigate();

  // ตรวจสอบ role
  useEffect(() => {
    try {
      const role = sessionStorage.getItem("role");
      if (role === "admin") {
        navigate("/dashboard/home");
      } else if (role === null) {
        navigate("/auth/sign-in");
      }
    } catch (error) {
      console.error("Error accessing sessionStorage:", error);
      navigate("/auth/sign-in");
    }
  }, [navigate]);

  // ===== ประกาศ State หลักที่เกี่ยวข้อง =====
  const [reports, setReports] = useState([]);   // แก้จาก [report, setReport]
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedDescription, setSelectedDescription] = useState("");
  const [dialogDetailOpen, setDialogDetailOpen] = useState(false);

  // Modal สำหรับเพิ่มรายงานใหม่
  const [isAddReportOpen, setIsAddReportOpen] = useState(false);

  // ฟังก์ชันดึงวันที่ปัจจุบัน (YYYY-MM-DD)
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // State เก็บข้อมูลฟอร์มการเพิ่มรายงาน
  const [newReport, setNewReport] = useState({
    report_uid: sessionStorage.getItem("email"),
    report_name: "",
    report_detail: "",
    report_date: getCurrentDate(), // ค่าเริ่มต้นเป็นวันที่ปัจจุบัน
  });

  // State สำหรับเก็บ Error ของฟอร์ม
  const [errors, setErrors] = useState({});

  // ดึงข้อมูลรายงานจากฟังก์ชัน TeacherReportData
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const data = await TeacherReportData(); // ฟังก์ชันดึงข้อมูล (return เป็น array)
        setReports(data); // เก็บข้อมูลใน state
      } catch (err) {
        setError("Error fetching reports. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  // ตรวจสอบค่าใน console เมื่อ reports มีการเปลี่ยนแปลง
  useEffect(() => {
    console.log("Reports state:", reports);
  }, [reports]);

  // ฟังก์ชันเปิด/ปิด Dialog รายละเอียด
  const handleDialogOpen = (detail) => {
    setSelectedDescription(detail);
    setDialogDetailOpen(true);
  };

  // ฟังก์ชัน Validate ข้อมูลฟอร์มก่อนบันทึก
  const validateFields = () => {
    const newErrors = {};
    if (!newReport.report_name) {
      newErrors.report_name = "Report Name is required";
    }
    if (!newReport.report_detail) {
      newErrors.report_detail = "Detail is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ฟังก์ชันบันทึกข้อมูล (ส่งไป API)
  const handleSave = async () => {
    console.log("Data to send to API:", newReport);

    if (validateFields()) {
      try {
        const response = await axios.post("http://localhost:5000/api/addreport", newReport);
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
            // หลังจากกด OK ใน sweetalert ให้รีเฟรชหน้า
            navigate(0);
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
    }
    setIsAddReportOpen(false);
  };

  // ฟังก์ชันปิด Dialog Add Report และรีเซ็ตฟอร์ม
  const resetState = (defaultState = { report_name: "", report_detail: "", report_date: "" }) => {
    setErrors({});
    setNewReport(defaultState);
  };
  const handleClose = () => {
    resetState();
    setIsAddReportOpen(false);
  };

  // ส่วนแสดง Loading หรือ Error
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
              {reports.map((item, index) => (
                <tr key={item.report_id}>
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{item.report_name}</td>
                  <td className="border px-4 py-2">{item.report_uid}</td>
                  <td className="border px-4 py-2">
                    {new Date(item.report_date).toLocaleDateString("en-GB")}
                  </td>
                  <td className="border px-4 py-2">
                    <Button variant="text" color="blue" onClick={() => handleDialogOpen(item.report_detail)}>
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
          <Button variant="gradient" color="blue" onClick={() => setDialogDetailOpen(false)}>
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
              <label htmlFor="report_detail" className="text-sm font-medium text-gray-700">
                Detail
              </label>
              <textarea
                id="report_detail"
                rows="4"
                className={`p-2 border ${
                  errors.report_detail ? "border-red-500" : "border-gray-300"
                } rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
