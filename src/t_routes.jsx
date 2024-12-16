import {
    HomeIcon,
    UserCircleIcon,
    ServerStackIcon,
    RectangleStackIcon,
    UsersIcon,
    DocumentTextIcon,
    FolderIcon,
    DocumentIcon,
    UserGroupIcon,
    NewspaperIcon
  } from "@heroicons/react/24/solid";
  import { HomeTeacher} from "@/pages/teacher";
  import { SignIn, SignUp } from "@/pages/auth";
import { lazy } from "react";
  
  const icon = {
    className: "w-5 h-5 text-inherit",
  };
  
  export const routes = [
    {
      layout: "teacher",
      pages: [
        {
          icon: <HomeIcon {...icon} />,
          name: "dashboard",
          label: "dashboard",
          path: "/home",
          element: <HomeTeacher />,
        },
        {
          icon: <UsersIcon {...icon} />,
          name: "Student",
          label: "Student Management",
          path: "/student_mgn",
          element: <HomeTeacher />,
        },
        {
          icon: <FolderIcon {...icon} />,
          name: "Practice",
          label: "Practice Management",
          path: "/practice_mgn",
          element: <HomeTeacher />,
        },
        {
          icon: <UserGroupIcon {...icon} />,
          name: "Classroom",
          label: "Classroom Management",
          path: "/classroom_mgn",
          element: <HomeTeacher />,
        },
        {
          icon: <DocumentTextIcon {...icon} />,
          name: "Report",
          label: "Reports",
          path: "/reports",
          element: "WAITING FOR ELEMENT",
        },
      ]
    },
  
    // {
    //   title: "auth pages",
    //   layout: "auth",
    //   pages: [
    //     {
    //       icon: <ServerStackIcon {...icon} />,
    //       name: "sign in",
    //       path: "/sign-in",
    //       element: <SignIn />,
    //     },
    //     {
    //       icon: <RectangleStackIcon {...icon} />,
    //       name: "sign up",
    //       path: "/sign-up",
    //       element: <SignUp />,
    //     },
    //   ],
    // },
  ];
  
  export default routes;
  