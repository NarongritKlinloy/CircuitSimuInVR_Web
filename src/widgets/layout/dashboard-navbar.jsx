/*Nav Bar ส่วนที่เป็นการแจ้งเตือน*/
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import {
  Navbar,
  Typography,
  Button,
  IconButton,
  Breadcrumbs,
  Input,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  Cog6ToothIcon,
  BellIcon,
  ClockIcon,
  CreditCardIcon,
  Bars3Icon,
} from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";
// import routes from "@/t_routes";

import adminRoutes from "@/routes";
import teacherRoutes from "@/t_routes";

import {
  useMaterialTailwindController,
  setOpenConfigurator,
  setOpenSidenav,
} from "@/context";
// import axios from 'axios';
import {NotificationReportData} from "@/data/CountNoti_Report";
  
export function DashboardNavbar() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { fixedNavbar, openSidenav } = controller;

  const userRole = sessionStorage.getItem("role"); // ใช้ sessionStorage ให้ตรงกัน
  const activeRoutes = userRole === "admin" ? adminRoutes : teacherRoutes;

  const { pathname } = useLocation();
  const [layout, page] = pathname.split("/").filter((el) => el !== "");
  
  // show name label
  // หาหน้า label ที่ตรง
  const pageLabel = activeRoutes
    .flatMap(route => route.pages)
    .find(({ path }) => 
      path === `/${page}` || 
      (path.startsWith("/student") && pathname.startsWith("/teacher/student")) ||
      (path.startsWith("/TA_mgn") && pathname.startsWith("/teacher/TA_mgn"))
    );
  
  // const pageLabel = routes[0].pages.find(({ path }) => {
  //   return path === `/${page}` || (path.startsWith("/student") && pathname.startsWith("/teacher/student"));
  // });
  // const checkPage = "/"+page; 
  // const pageLabel = routes[0].pages.filter(({path})=> (path == checkPage));

  // เก็บชื่อผู้ใช้จาก sessionStorage
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const name = sessionStorage.getItem("name");
    setUserName(name || ""); // ถ้าไม่มี name ให้ตั้งค่าเป็นค่าว่าง
  }, []);


  const [notificationCount, setNotificationCount] = useState(0); // ✅ กำหนด state
  console.log("Nav -- "+notificationCount)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const count = await NotificationReportData(); // ✅ ดึงข้อมูลจาก API
        if (count !== null && count !== undefined) {
          setNotificationCount(count); // ✅ อัปเดต State
        }
      } catch (error) {
        console.error("❌ Error fetching notifications:", error);
      }
    };

    fetchNotifications(); // เรียกใช้งานครั้งแรกทันที

    const interval = setInterval(fetchNotifications, 10000); // อัปเดตทุก 10 วินาที
    console.log(interval)
    return () => clearInterval(interval); // เคลียร์ Interval เมื่อ Component ถูก Unmount
  }, []);

  


  return (
    <Navbar
      color={fixedNavbar ? "white" : "transparent"}
      className={`rounded-xl transition-all ${
        fixedNavbar
          ? "sticky top-4 z-40 py-3 shadow-md shadow-blue-gray-500/5"
          : "px-0 py-1"
      }`}
      fullWidth
      blurred={fixedNavbar}
    >
      <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
        <div className="capitalize">
          
          <Breadcrumbs
            className={`bg-transparent p-0 transition-all ${
              fixedNavbar ? "mt-1" : ""
            }`}
          >
            <Link to={`/${layout}`}>
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal opacity-50 transition-all hover:text-blue-500 hover:opacity-100"
              >
                {layout}
              </Typography>
            </Link>
            <Typography
              variant="small"
              color="blue-gray"
              className="font-normal"
            >
              {page}
            </Typography>
          </Breadcrumbs>

          <Typography variant="h3" color="blue-gray">
            {/* {pageLabel[0].label} */}
            {pageLabel ? pageLabel.label : "Unknown Page"}
          </Typography>


        </div>
        
        <div className="flex items-center">
          {/* 
          <div className="mr-auto md:mr-4 md:w-56">
            <Input label="Search" />
          </div>*/}

          
          <IconButton
            variant="text"
            color="blue-gray"
            className="grid xl:hidden"
            onClick={() => setOpenSidenav(dispatch, !openSidenav)}
          >
            <Bars3Icon strokeWidth={3} className="h-6 w-6 text-blue-gray-500" />
          </IconButton>

          
          {/*ทำส่วนนี้ให้เป็น ข้อมูลของผู้ใช้งาน ตัวอย่างใน link นี้ >> https://img2.pic.in.th/pic/Screenshot-2025-01-05-152144.png */}
            <Button
              variant="text"
              color="blue-gray"
              className="hidden items-center gap-1 px-4 xl:flex normal-case"
              disabled
            >
              <UserCircleIcon className="h-5 w-5 text-blue-gray-500" />
              {userName}
            </Button>
            <IconButton
              variant="text"
              color="blue-gray"
              className="grid xl:hidden"
            >
              <UserCircleIcon className="h-5 w-5 text-blue-gray-500" />
            </IconButton>
          {/* ------------------------------------------------------------------------------------------------------- */}

          
          <Menu>
            {/* <MenuHandler>
              <IconButton variant="text" color="blue-gray">
                <BellIcon className="h-5 w-5 text-blue-gray-500" />
              </IconButton>
            </MenuHandler> */}

<MenuHandler>
  <div className="relative">
    <IconButton variant="text" color="blue-gray">
      <BellIcon className="h-6 w-6 text-blue-gray-500" />
    </IconButton>

    {/* <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full px-1">
        {"100"}
      </span> */}

    {/* Badge สำหรับแสดงจำนวนแจ้งเตือนที่ยังไม่ได้อ่าน */}
    {notificationCount > 0 && (
      <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full px-2">
        {notificationCount}
      </span>
    )}

    {/* {notificationCount == 0 && (
      <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full px-2">
        {""}
      </span>
    )} */}

  </div>
</MenuHandler>

            
            <MenuList className="w-max border-0">

              <MenuItem className="flex items-center gap-3">
                <Avatar
                  src="https://verticalresponse.com/wp-content/uploads/2023/04/chat-gpt-logo-scaled.jpeg"
                  alt="item-1"
                  size="sm"
                  variant="circular"
                />
                <div>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="mb-1 font-normal"
                  >
                    <strong>Chat GPT</strong> from Laur
                  </Typography>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="flex items-center gap-1 text-xs font-normal opacity-60"
                  >
                    <ClockIcon className="h-3.5 w-3.5" /> 55 minutes ago
                  </Typography>
                </div>
              </MenuItem>

              <MenuItem className="flex items-center gap-4">
                <Avatar
                  src="https://curriculum.kmitl.ac.th/wp-content/uploads/2021/07/logo02-1.png"
                  alt="item-1"
                  size="sm"
                  variant="circular"
                />
                <div>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="mb-1 font-normal"
                  >
                    <strong>New album</strong> by Travis Scott
                  </Typography>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="flex items-center gap-1 text-xs font-normal opacity-60"
                  >
                    <ClockIcon className="h-3.5 w-3.5" /> 1 day ago
                  </Typography>
                </div>
              </MenuItem>
              <MenuItem className="flex items-center gap-4">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-tr from-blue-gray-800 to-blue-gray-900">
                  <CreditCardIcon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="mb-1 font-normal"
                  >
                    Payment successfully completed
                  </Typography>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="flex items-center gap-1 text-xs font-normal opacity-60"
                  >
                    <ClockIcon className="h-3.5 w-3.5" /> 2 days ago
                  </Typography>
                </div>
              </MenuItem>
            </MenuList>
          </Menu>

          
          <IconButton
            variant="text"
            color="blue-gray"
            onClick={() => setOpenConfigurator(dispatch, true)}
          >
            <Cog6ToothIcon className="h-5 w-5 text-blue-gray-500" />
          </IconButton>
        </div>
      </div>
    </Navbar>
  );
}

DashboardNavbar.displayName = "/src/widgets/layout/dashboard-navbar.jsx";

export default DashboardNavbar;
