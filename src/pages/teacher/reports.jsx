import React, { useState, useEffect } from "react";
import SearchAndAddReport from "./functionTables/SearchAndAddReport";
import axios from "axios";
import Swal from "sweetalert2";
import {
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

export function TeacherReports() {
  const navigate = useNavigate();
  
  useEffect(() => {
    try {
      const role = sessionStorage.getItem("role");
      if (role === "admin") navigate("/dashboard/home");
      else if (!role) navigate("/auth/sign-in");
    } catch (error) {
      console.error("Error accessing sessionStorage:", error);
      navigate("/auth/sign-in");
    }
  }, [navigate]);

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAddReportOpen, setIsAddReportOpen] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState("");
  const [dialogDetailOpen, setDialogDetailOpen] = useState(false);
  const email = sessionStorage.getItem("email");
  const API_URL = `http://localhost:5000/api/report?email=${email}`;

  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const [newReport, setNewReport] = useState({
    report_uid: email,
    report_name: "",
    report_detail: "",
    report_date: getCurrentDate(),
  });
  
  const [errors, setErrors] = useState({});

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setReports(response.data);
    } catch (error) {
      setError("Error fetching reports. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const toggleAddModal = () => setIsAddReportOpen((prev) => !prev);

  const validateFields = () => {
    const newErrors = {};
    if (!newReport.report_name) newErrors.report_name = "Report Name is required";
    if (!newReport.report_detail) newErrors.report_detail = "Detail is required";
    if (!newReport.report_date) newErrors.report_date = "Report Date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateFields()) return;
    try {
      const response = await axios.post("http://localhost:5000/api/addreport", newReport);
      if (response.status === 200) {
        Swal.fire({
          title: "Added!",
          text: `${newReport.report_name} has been added.`,
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          fetchReports();
          setIsAddReportOpen(false);
          setNewReport({ report_uid: email, report_name: "", report_detail: "", report_date: getCurrentDate() });
        });
      }
    } catch (err) {
      Swal.fire({
        title: "Error!",
        text: `Cannot add ${newReport.report_name}. Please try again.`,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <SearchAndAddReport toggleAddModal={toggleAddModal} />
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6 flex justify-between items-center">
          <Typography variant="h6" color="white">Reports</Typography>
        </CardHeader>
        <CardBody className="overflow-x-auto pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto border-collapse">
            <thead>
              <tr>{["No.", "Name", "User", "Create Date", "Detail"].map((header) => (
                <th key={header} className="border-b px-5 py-2 text-center">
                  <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">{header}</Typography>
                </th>
              ))}</tr>
            </thead>
            <tbody>
              {reports.map((report, index) => (
                <tr key={report.report_id} className="border-b">
                  <td className="px-5 py-3 text-center">{index + 1}</td>
                  <td className="px-5 py-3 text-left">{report.report_name}</td>
                  <td className="px-5 py-3 text-center">{report.report_uid}</td>
                  <td className="px-5 py-3 text-center">{new Date(report.report_date).toLocaleDateString("en-GB")}</td>
                  <td className="px-5 py-3 text-center">
                    <Button variant="text" color="blue" onClick={() => { setSelectedDescription(report.report_detail); setDialogDetailOpen(true); }}>
                      Detail
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
      <Dialog open={dialogDetailOpen} handler={() => setDialogDetailOpen(false)}>
        <DialogHeader>Detail</DialogHeader>
        <DialogBody><Typography>{selectedDescription}</Typography></DialogBody>
        <DialogFooter>
          <Button variant="gradient" color="blue" onClick={() => setDialogDetailOpen(false)}>Close</Button>
        </DialogFooter>
      </Dialog>
      <Dialog open={isAddReportOpen} handler={toggleAddModal}>
        <DialogHeader>Add New Report</DialogHeader>
        <DialogBody>
          <Input label="Report Name" value={newReport.report_name} onChange={(e) => setNewReport({ ...newReport, report_name: e.target.value })} error={!!errors.report_name} />
          <textarea className="p-2 border rounded w-full" value={newReport.report_detail} onChange={(e) => setNewReport({ ...newReport, report_detail: e.target.value })} />
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" onClick={toggleAddModal}>Cancel</Button>
          <Button variant="gradient" color="green" onClick={handleSave}>Submit</Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default TeacherReports;
