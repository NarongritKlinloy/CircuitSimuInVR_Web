import {
  HomeIcon,
  UsersIcon,
  DocumentTextIcon,
  FolderIcon,
  UserGroupIcon
} from "@heroicons/react/24/solid";
import { HomeTeacher, StudentMgn, PracticeMgn, ClassroomMgn, TeacherReports, TAManagement } from "@/pages/teacher";

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
        path: "/student/:classname",
        element: <StudentMgn />,
      },
      {
        icon: <FolderIcon {...icon} />,
        name: "Practice",
        label: "Practice Management",
        path: "/practice",
        element: <PracticeMgn />,
      },
      {
        icon: <UserGroupIcon {...icon} />,
        name: "Classroom",
        label: "Classroom Management",
        path: "/classroom",
        element: <ClassroomMgn />,
      },
      {
        icon: <DocumentTextIcon {...icon} />,
        name: "Feedback",
        label: "Feedback",
        path: "/feedback",
        element: <TeacherReports />,
      },
      {
        icon: <DocumentTextIcon {...icon} />,
        name: "Teacher Assistant",
        label: "Teacher Assistant",
        path: "/TA_mgn/:classname",
        element: <TAManagement />,
      },
    ]
  },
];

export default routes;
