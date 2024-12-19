import {
  HomeIcon,
  UsersIcon,
  DocumentTextIcon,
  FolderIcon,
  UserGroupIcon
} from "@heroicons/react/24/solid";
import { HomeTeacher, StudentMgn, PracticeMgn, ClassroomMgn, TeaherReports } from "@/pages/teacher";

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
        element: <StudentMgn />,
      },
      {
        icon: <FolderIcon {...icon} />,
        name: "Practice",
        label: "Practice Management",
        path: "/practice_mgn",
        element: <PracticeMgn />,
      },
      {
        icon: <UserGroupIcon {...icon} />,
        name: "Classroom",
        label: "Classroom Management",
        path: "/classroom_mgn",
        element: <ClassroomMgn />,
      },
      {
        icon: <DocumentTextIcon {...icon} />,
        name: "Report",
        label: "Reports",
        path: "/reports",
        element: <TeaherReports />,
      },
    ]
  },
];

export default routes;
