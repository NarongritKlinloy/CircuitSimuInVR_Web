// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { MenuItem, Avatar, Typography } from "@material-tailwind/react";
// import { ClockIcon } from "@heroicons/react/24/solid";

// export const ReportListMenu = () => { //  ใช้ Named Export
//   const [reports, setReports] = useState([]);

//   const fetchReports = async () => {
//     try {
//       const response = await axios.get("http://localhost:5000/api/adminreport");
//       setReports(response.data);
//     } catch (error) {
//       console.error("❌ Error fetching reports:", error);
//     }
//   };

//   useEffect(() => {
//     fetchReports();
//   }, []);

//   return (
//     <>
//       {reports.map((report) => (
//         <MenuItem key={report.report_id} className="flex items-center gap-3">
//           <Avatar
//             src="https://verticalresponse.com/wp-content/uploads/2023/04/chat-gpt-logo-scaled.jpeg" //  สามารถเปลี่ยนรูปภาพตามต้องการ
//             alt={report.report_name}
//             size="sm"
//             variant="circular"
//           />
//           <div>
//             <Typography variant="small" color="blue-gray" className="mb-1 font-normal">
//               <strong>{report.report_name}</strong> from {report.report_uid}
//             </Typography>
//             <Typography variant="small" color="blue-gray" className="flex items-center gap-1 text-xs font-normal opacity-60">
//               <ClockIcon className="h-3.5 w-3.5" /> {new Date(report.report_date).toLocaleDateString("en-GB")}
//             </Typography>
//           </div>
//         </MenuItem>
//       ))}
//     </>
//   );
// };
// export default ReportListMenu;