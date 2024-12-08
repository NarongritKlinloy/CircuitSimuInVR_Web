import {
  HomeIcon,
  UserCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
  UsersIcon,
  DocumentTextIcon
} from "@heroicons/react/24/solid";
import { HomeTeacher} from "@/pages/teacher";
import { Home, Profile, Tables, Notifications } from "@/pages/dashboard";
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
      }
    ]
  },
  
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },

      {
        icon: <UsersIcon {...icon} />,
        name: "Users",
        path: "/Users",
        element: <Tables />,
      },
      
      {
        icon: <UserCircleIcon {...icon} />,
        name: "Admin",
        path: "/profile",
        element: <Profile />,
      },
      
      {
        icon: <DocumentTextIcon {...icon} />,
        name: "Report",
        path: "/notifications",
        element: <Notifications />,
      },
    ],
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
