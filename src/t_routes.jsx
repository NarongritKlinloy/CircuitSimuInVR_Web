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
          icon: <UsersIcon {...icon} />,
          name: "Student management",
          path: "/student_mgn",
          element: <HomeTeacher />,
        },
        {
          icon: <FolderIcon {...icon} />,
          name: "Practice",
          path: "/practice_mgn",
          element: <HomeTeacher />,
        },
        {
          icon: <UserGroupIcon {...icon} />,
          name: "Classroom",
          path: "/classroom_mgn",
          element: <HomeTeacher />,
        },
        {
          icon: <DocumentTextIcon {...icon} />,
          name: "Report",
          path: "/reports",
          element: "WAITING FOR ELEMENT",
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
  