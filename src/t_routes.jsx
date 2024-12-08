import {
    HomeIcon,
    UserCircleIcon,
    ServerStackIcon,
    RectangleStackIcon,
    UsersIcon,
    DocumentTextIcon
  } from "@heroicons/react/24/solid";
  import { HomeTeacher} from "@/pages/teacher";
  import { SignIn, SignUp } from "@/pages/auth";
  
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
          path: "/home",
          element: <HomeTeacher />,
        },
        {
          icon: <HomeIcon {...icon} />,
          name: "Student management",
          path: "/student_mgn",
          element: <HomeTeacher />,
        },
        {
          icon: <HomeIcon {...icon} />,
          name: "Practice",
          path: "/practice_mgn",
          element: <HomeTeacher />,
        },
        {
          icon: <HomeIcon {...icon} />,
          name: "Classroom",
          path: "/classroom_mgn",
          element: <HomeTeacher />,
        },
        {
          icon: <HomeIcon {...icon} />,
          name: "Report",
          path: "/reports",
          element: <HomeTeacher />,
        },
      ]
    },
  
    {
      title: "auth pages",
      layout: "auth",
      pages: [
        {
          icon: <ServerStackIcon {...icon} />,
          name: "sign in",
          path: "/sign-in",
          element: <SignIn />,
        },
        {
          icon: <RectangleStackIcon {...icon} />,
          name: "sign up",
          path: "/sign-up",
          element: <SignUp />,
        },
      ],
    },
  ];
  
  export default routes;
  