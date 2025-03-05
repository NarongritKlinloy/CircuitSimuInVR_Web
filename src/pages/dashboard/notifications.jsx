import React, { useState, useEffect } from "react";
import axios from "axios";
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
} from "@material-tailwind/react";
import SearchAdmin from "../teacher/functionTables/SearchAdmin";
import { updateNotificationAPI } from "@/data/updateNotification";
// import { fetchReadNotifications } from "@/data/fetchReadNoti";

export function Notifications() {

  const [reports, setReports] = useState([]); //  เก็บข้อมูล Reports
  const [updatedReports, setUpdatedReports] = useState([]); //  รายการที่อ่านแล้ว
  const [selectedReport, setSelectedReport] = useState(null); //  รายการที่ถูกเลือก
  const [dialogOpen, setDialogOpen] = useState(false); //  สถานะเปิดปิด Modal
  const [searchTerm, setSearchTerm] = useState(""); //  ใช้เก็บค่าการค้นหา
  let pollingInterval = null;

  /**  ฟังก์ชันดึงข้อมูล `Reports` */
  const fetchReports = async () => {
    try {
      const response = await axios.get("http://backend:5000/api/adminreport");
      setReports(response.data);
    } catch (error) {

      console.error(" Error fetching reports:", error);
    }
  };

  /**  เริ่มต้น WebSocket และ API Polling สำรอง */

  useEffect(() => {
    const connectWebSocket = () => {
      const ws = new WebSocket("ws://localhost:5050");

      ws.onopen = () => {

        // console.log(" WebSocket Connected to 5050");

        if (pollingInterval) {
          clearInterval(pollingInterval);
          pollingInterval = null;
        }
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.reports !== undefined) {
            setReports(data.reports);
          }
          if (data.unread_count !== undefined) {
            // console.log(" Unread Notifications:", data.unread_count);
          }
        } catch (error) {
          console.error(" Error parsing WebSocket message:", error);

        }
      };

      ws.onclose = () => {
        console.warn(" WebSocket Disconnected, switching to API polling...");

        if (!pollingInterval) {
          pollingInterval = setInterval(fetchReports, 10000);
        }
        setTimeout(connectWebSocket, 5000);
      };

      return ws;
    };

    fetchReports();
    const ws = connectWebSocket();

    return () => {
      ws.close();
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, []);

  /** โหลด `is_read = 1` จาก API */
  // const loadReadNotifications = async () => {
  //   const email = sessionStorage.getItem("email");
  //   const readReports = await fetchReadNotifications(email);

  //   if (readReports && Array.isArray(readReports)) {
  //     const reportIds = readReports.map((item) => item.report_id);
  //     setUpdatedReports(reportIds);
  //   }
  // };

  // useEffect(() => {
  //   loadReadNotifications();
  // }, []);


  /**  ฟังก์ชันสำหรับกรอง Reports ตาม `searchTerm` */

  const filteredReports = reports.filter((report) => {
    const reportDate = new Date(report.report_date).toLocaleDateString("en-GB"); // แปลงวันที่เป็น DD/MM/YYYY
    const lowerSearchTerm = searchTerm.toLowerCase(); // แปลงเป็นตัวพิมพ์เล็กเพื่อให้ค้นหาแบบ case-insensitive

    return (

      report.report_name.toLowerCase().includes(lowerSearchTerm) || //  ค้นหาจากชื่อ
      report.report_uid.toLowerCase().includes(lowerSearchTerm) || //  ค้นหาจากผู้ใช้
      reportDate.includes(lowerSearchTerm) //  ค้นหาจากวันที่
    );
  });




  /**  กดปุ่ม `VIEW` → เปิด Modal + อัปเดต `is_read` */

  // const handleReadReport = async (report) => {
  //   setSelectedReport(report);
  //   setDialogOpen(true);

  //   try {
  //     const response = await updateNotificationAPI(report.report_id);
  //     // console.log(" API Response:", response);

  //     if (response.error) {
  //       console.error("Error updating report read status:", response.error);
  //       return;
  //     }
  //     //อัปเดตรายงานที่อ่านแล้วใน state
  //     setUpdatedReports((prev) => [...prev, report.report_id]);
  //     fetchReports();
  //   } catch (error) {

  //     console.error("Error updating notification:", error);
  //   }
  // };
  const handleReadReport = async (report) => {
    // ✅ ตรวจสอบว่ารายงานนี้เคยถูกอ่านแล้วหรือไม่
    if (updatedReports.includes(report.report_id)) {
      console.log("📌 รายงานนี้ถูกอ่านแล้ว");
      return;
    }
  
    setSelectedReport(report);
    setDialogOpen(true);
  
    try {
      //  เรียก API เพื่ออัปเดตสถานะอ่านแล้ว
      const response = await updateNotificationAPI(report.report_id);
  
      if (response.error) {
        console.error("❌ Error updating report read status:", response.error);
        return;
      }
  
      //  อัปเดตรายการที่อ่านแล้วใน state
      setUpdatedReports((prev) => [...prev, report.report_id]);
  
      //  รีเฟรชข้อมูลรายงานใหม่
      fetchReports();
    } catch (error) {
      console.error("❌ Error updating notification:", error);
    }
  };
  

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">

      {/* เพิ่มช่องค้นหา */}
      <SearchAdmin searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6 flex justify-between items-center">
          <Typography variant="h6" color="white">Feedback</Typography>
        </CardHeader>
        <CardBody className="overflow-x-auto overflow-y-auto max-h-96 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto border-collapse">
            <thead>
              <tr>
                {["No.", "Name", "Detail", /*"Report by",*/ "Create Date", "Info."].map((header) => (
                  <th key={header}
                    className={`border-b border-blue-gray-50 px-5 py-2 ${header === "Name" ? "text-left" : "text-center"}`}>
                    <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
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

                    {/* <td className={`${rowClassName} text-center`}>
                      <Typography className="text-s font-normal text-blue-gray-500">
                        {report.recipient_uid}
                      </Typography>
                    </td> */}

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
                      <Typography className="text-s font-normal text-blue-gray-500">
                        <button onClick={() => handleReadReport(report)} className="hover:text-green-700">
                          {report.report_isread === 1 ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" strokeWidth="1.5" stroke="currentColor" viewBox="0 0 23 23" className="h-5 w-5 text-green-500 hover:text-blue-600">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9 M10.125 2.25h.375a9 9 0 0 1 9 9v.375 M10.125 2.25A3.375 3.375 0 0 1 13.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 0 1 3.375 3.375 M9 15l2.25 2.25L15 12" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 23" fill="currentColor" className="h-5 w-5 text-red-500 hover:text-green-600">
                              <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625Z" />
                              <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
                            </svg>
                          )}
                        </button>
                      </Typography>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
      </Card>


      {/* Modal รายละเอียด */}
      <Dialog open={dialogOpen} handler={() => setDialogOpen(false)}>
        <DialogHeader>Detail</DialogHeader>
        <DialogBody>{selectedReport?.report_detail}</DialogBody>
        <DialogFooter>
          <Button variant="gradient" color="blue" onClick={() => setDialogOpen(false)}>Read</Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default Notifications;
