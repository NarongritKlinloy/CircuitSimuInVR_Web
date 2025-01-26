import React, { useState, useEffect } from "react";
import { textarea, Input, Typography, Card, CardHeader, CardBody, Button, Dialog, DialogHeader, DialogBody, DialogFooter } from "@material-tailwind/react";
import { TeacherReportData } from "@/data/teacher-report";

export function TeacherReports() {
  const [selectedDescription, setSelectedDescription] = useState("");
  const [report, setReport] = useState([]);

  useEffect(() => {
    const getReport = async () => {
      const data = TeacherReportData();
      setReport(data);
    };
    getReport();
  }, [report]);

  // Modal Report Detail
  const [dialogDetailOpen, setDialogDetailOpen] = useState(false);
  const handleDialogOpen = (detail) => {
    setSelectedDescription(detail);
    setDialogDetailOpen(true);
  };

  // Add new report Modal State
  const [isAddReportOpen, setIsAddReportOpen] = useState(false);
  const [newReport, setNewReport] = useState({
    title: "",
    detail: "",
  });

  const today = new Date();

  // Modal Add new report 
  const handleAddReport = () => {
    setReport([...report, newReport]);
    setNewReport({ title: "", detail: "" });
    setIsAddReportOpen(false);
  };

  const [errors, setErrors] = useState({});
  if (!newReport) return null;

  // ฟังก์ชันรีเซ็ต Error และข้อมูล
  const resetState = () => {
    setErrors({}); // รีเซ็ต Error ให้เป็นค่าว่าง
  };

  // ฟังก์ชันจัดการปิด Modal พร้อมรีเซ็ต
  const handleClose = () => {
    resetState(); // รีเซ็ตสถานะ Error
    setIsAddReportOpen(false); // ปิด Modal
  };

  // ฟังก์ชัน Validate ข้อมูลก่อนบันทึก
  const validateFields = () => {
    const newErrors = {};

    if (!newReport.title) newErrors.title = "Title is required";
    if (!newReport.detail) newErrors.detail = "Please give detail";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0; // คืนค่า true ถ้าไม่มี Error
  };

  // ฟังก์ชันบันทึกข้อมูล
  const handleSave = () => {
    if (validateFields()) {
      handleAddReport();
      resetState(); // รีเซ็ต Error เมื่อบันทึกสำเร็จ
    }
  };

  return (
    <div className="mx-auto my-20 flex flex-col gap-8">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6 flex justify-between items-center">
          <Typography variant="h6" color="white">
            Report
          </Typography>
          <Button variant="gradient" color="green" onClick={() => setIsAddReportOpen(true)}>
            New Report
          </Button>
        </CardHeader>
        <CardBody className="overflow-x-scroll pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Title", "Detail", "date", "status", ""].map((el) => (
                  <th
                    key={el}
                    className="border-b border-blue-gray-50 py-3 px-5 text-left"
                  >
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-blue-gray-400"
                    >
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {report.map(({ title, detail, date, status }, key) => {
                const className = `py-3 px-5 ${key === report.length - 1 ? "" : "border-b border-blue-gray-50"
                  }`;

                return (
                  <tr key={title}>
                    <td className={className}>
                      <div className="flex items-center gap-3">
                        <div>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold"
                          >
                            {title}
                          </Typography>
                        </div>
                      </div>
                    </td>

                    <td className={className}>
                      <Typography
                        className="text-xs font-normal text-blue-gray-500 truncate"
                        onClick={() => handleDialogOpen(detail)}
                        style={{ cursor: "pointer" }}
                      >
                        {detail.length > 50
                          ? `${detail.slice(0, 50)}...`
                          : detail}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {date}
                      </Typography>
                    </td>

                    <td className={className}>
                      <Typography
                        className={`text-xs font-semibold ${status?.toLowerCase() === 'success' ? 'text-green-500' : 'text-red-500'
                          }`}
                      >
                        {status}
                      </Typography>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
      </Card>


      {/* Modal Report Detail */}
      <Dialog open={dialogDetailOpen} handler={() => setDialogDetailOpen(false)}>
        <DialogHeader>Detailed Description</DialogHeader>
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
            {/* Input for Title */}
            <Input
              label="Title"
              value={newReport.title || ""}
              onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
              error={!!errors.title}
            />
            {errors.title && (
              <Typography variant="small" color="red" className="mt-1">
                {errors.title}
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
                className={`p-2 border ${errors.detail ? "border-red-500" : "border-gray-300"} rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
                value={newReport.detail || ""}
                onChange={(e) => setNewReport({ ...newReport, detail: e.target.value })}
              />
              {errors.detail && (
                <Typography variant="small" color="red" className="mt-1">
                  {errors.detail}
                </Typography>
              )}
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" onClick={handleClose}>
            Cancel
          </Button>
          {/* <Button variant="gradient" color="green" onClick={handleSave}> */}
          <Button variant="gradient" color="green" onClick={handleSave}>
            Submit
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default TeacherReports;
