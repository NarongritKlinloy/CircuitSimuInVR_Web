import {
  HomeIcon,
  UserCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
  UsersIcon,
  DocumentTextIcon,
  FolderIcon
} from "@heroicons/react/24/solid";
import { Home, Profile, Tables, Notifications, ExamManagement, ClassroomPractice } from "@/pages/dashboard";
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
        icon: <DocumentTextIcon {...icon} />,
        name: "Practice",
        label: "Practice Management",
        path: "/exam",
        element: <ExamManagement />,
      },
      {
        icon: <DocumentTextIcon {...icon} />,
        name: "Class Practice",
        label: "Class Practice Management",
        path: "/classroom_practice",
        element: <ClassroomPractice />,
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
        name: "Feedback",
        label: "Feedback",
        path: "/feedback",
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
