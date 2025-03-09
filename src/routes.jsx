import {
  HomeIcon,
  UserCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
  UsersIcon,
  DocumentTextIcon,
  FolderIcon
} from "@heroicons/react/24/solid";
import { Home,  Tables, Notifications, ExamManagement, ClassroomPractice } from "@/pages/dashboard";
import { SignIn, SignUp ,FeedbackPage} from "@/pages/auth";

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
  { 
        icon: <DocumentTextIcon {...icon} />,
        name: "feedbackuser",
        path: "/feedbackuser",
        element: <FeedbackPage />,
  },
];

export default routes;
