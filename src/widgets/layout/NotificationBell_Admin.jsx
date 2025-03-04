import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  MenuList,
  MenuItem,
  Typography,
  Button,
} from "@material-tailwind/react";
import { ClockIcon } from "@heroicons/react/24/solid";

const NotificationBellAdmin = ({ isOpen, toggleMenu }) => {
  const [notifications, setNotifications] = useState([]);
  const [visibleCount, setVisibleCount] = useState(4);
  const [ws, setWs] = useState(null);
  let pollingInterval = null; // ตัวแปรเก็บ API Polling

  /**  ฟังก์ชันดึงแจ้งเตือนจาก API */
  const fetchNotifications = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/all_notifications");
      setNotifications(response.data);
    } catch (error) {
      console.error(" Error fetching notifications:", error);
    }
  };

  /**  ฟังก์ชันเริ่ม WebSocket */
  const connectWebSocket = () => {
    const newWs = new WebSocket("ws://localhost:5050");

    newWs.onopen = () => {
      // console.log(" WebSocket Connected to 5050");

      // **ถ้า WebSocket กลับมา → หยุด API Polling**
      if (pollingInterval) {
        clearInterval(pollingInterval);
        pollingInterval = null;
      }
    };

    newWs.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.notifications) {
          setNotifications(data.notifications);
        }
      } catch (error) {
        console.error(" Error parsing WebSocket message:", error);
      }
    };

    newWs.onclose = () => {
      console.warn(" WebSocket Disconnected, switching to API polling...");
      
      // **เริ่ม API Polling ถ้า WebSocket ปิด**
      if (!pollingInterval) {
        pollingInterval = setInterval(fetchNotifications, 10000);
      }

      // **พยายามเชื่อมต่อ WebSocket ใหม่หลังจาก 5 วินาที**
      setTimeout(connectWebSocket, 5000);
    };

    setWs(newWs);
  };

  /**  ใช้ `useEffect` เริ่มต้น WebSocket และ API Polling */
  useEffect(() => {
    fetchNotifications(); // โหลด API ครั้งแรก
    connectWebSocket(); // เริ่ม WebSocket

    return () => {
      if (ws) {
        ws.close(); // ปิด WebSocket เมื่อ Component ถูกปิด
      }
      if (pollingInterval) {
        clearInterval(pollingInterval); // หยุด API Polling ถ้ามี
      }
    };
  }, []);

  /** ฟังก์ชันโหลดแจ้งเตือนเพิ่ม */
  const loadMore = (e) => {
    e.stopPropagation();
    setVisibleCount((prevCount) => prevCount + 4);
  };

  /**  รีเซ็ตจำนวนแสดงแจ้งเตือนเมื่อปิดเมนู */
  useEffect(() => {
    if (!isOpen) {
      setVisibleCount(4);
    }
  }, [isOpen]);


  return (
    <>
      {isOpen && (
        <MenuList
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 mt-2 w-72 border-0 p-3 bg-white shadow-lg rounded-lg overflow-y-auto"
          // style={{ maxHeight: "300px"  }}
          style={{
            maxHeight: notifications.length > 6 ? "350px" : "auto",  //  แสดง Scroll Bar เมื่อรายการมาก
          }}
        >
          {notifications.length === 0 ? (
            <Typography variant="small" color="gray" className="p-3 text-center">
              ไม่มีแจ้งเตือน
            </Typography>
          ) : (
            <>
              {notifications.slice(0, visibleCount).map((notification) => (

                
                <MenuItem key={notification.id} className="flex items-center gap-3 p-3 hover:bg-gray-100 ">
                  {notification.report_isread === 0 ? (
                //  ซองจดหมายปิด (ยังไม่ได้อ่าน)
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-envelope-fill text-red-500">
                  <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414zM0 4.697v7.104l5.803-3.558zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586zm3.436-.586L16 11.801V4.697z"/>
                </svg>
              ) : (
                //  ซองจดหมายเปิด (อ่านแล้ว)
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-envelope-open-fill text-green-500">
                  <path d="M8.941.435a2 2 0 0 0-1.882 0l-6 3.2A2 2 0 0 0 0 5.4v.314l6.709 3.932L8 8.928l1.291.718L16 5.714V5.4a2 2 0 0 0-1.059-1.765zM16 6.873l-5.693 3.337L16 13.372v-6.5Zm-.059 7.611L8 10.072.059 14.484A2 2 0 0 0 2 16h12a2 2 0 0 0 1.941-1.516M0 13.373l5.693-3.163L0 6.873z"/>
                </svg>
              )}

                  <div className="flex-1">
                    <Typography variant="small" color="blue-gray" className="mb-1 font-normal">
                      <strong>รายงาน: {notification.report_name}</strong>
                    </Typography>
                    <Typography variant="small" color="blue-gray" className="mb-1 font-normal">
                      <strong>From: {notification.report_uid}</strong>
                    </Typography>
                    <Typography variant="small" color="gray" className="flex items-center gap-1 text-xs font-normal opacity-60">
                      <ClockIcon className="h-3.5 w-3.5" /> {new Date(notification.report_create_date).toLocaleString("en-GB")}
                    </Typography>
                  </div>
                </MenuItem>
              ))}

              {visibleCount < notifications.length && (
                <div className="text-center mt-3">
                  <Button size="sm" color="blue" onMouseDown={loadMore}>
                    Show More
                  </Button>
                </div>
              )}
            </>
          )}
        </MenuList>
      )}
    </>
  );
};

export default NotificationBellAdmin;
