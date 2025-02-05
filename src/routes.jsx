import {
  HomeIcon,
  UserCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
  UsersIcon,
  DocumentTextIcon
} from "@heroicons/react/24/solid";
import { Home, Profile, Tables, Notifications } from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        label: "dashboard",
        path: "/home",
        element: <Home />,
      },

      {
        icon: <UsersIcon {...icon} />,
        name: "Users",
        label: "Users",
        path: "/Users",
        element: <Tables />,
      },
      
      // {
      //   icon: <UserCircleIcon {...icon} />,
      //   name: "Admin",
      //   path: "/profile",
      //   element: <Profile />,
      // },
      
      {
        icon: <DocumentTextIcon {...icon} />,
        name: "Report",
        label: "Report",
        path: "/report",
        element: <Notifications />,
      },
    ],
  },
  {
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
