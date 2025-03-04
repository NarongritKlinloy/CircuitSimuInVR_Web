import {
  UsersIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  BookOpenIcon,
  BuildingOffice2Icon,
} from "@heroicons/react/24/solid";
import axios from 'axios';
const uid = sessionStorage.getItem("email");
export const countStudentAPI = async (uid) => {
    try {
        const response = await axios.get(`http://localhost:5000/api/student_teacher/${uid}`);
        return response.data.count;
    } catch (error) {
        console.error("Error counting student:", error);
        return 0;
    }
};
const student_count = await countStudentAPI(uid);

export const countClassroomAPI = async (uid) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/classroom_teacher/${uid}`);
    return response.data.count;
  } catch (error) {
    console.error("Error counting classroom:", error);
    return 0;
  }
};
const classroom_count = await countClassroomAPI(uid);

export const countPracticeAPI = async (uid) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/practice_teacher/${uid}`);
    return response.data;
  } catch (error) {
    console.error("Error counting practice:", error);
    return 0;
  }
};
const practice  = await countPracticeAPI(uid);

export const countReportAPI = async (uid) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/report_teacher/${uid}`);
    return response.data;
  } catch (error) {
    console.error("Error counting report:", error);
    return 0;
  }
};
const report  = await countReportAPI(uid);

export const statisticsCardsDataTheacher = [
  {
    color: "gray",
    icon: AcademicCapIcon,
    title: "Students",
    value: student_count,
  },
  {
    color: "gray",
    icon: BuildingOffice2Icon,
    title: "Classrooms",
    value: classroom_count,
  },
  {
    color: "gray",
    icon: BookOpenIcon,
    title: "Practice Open",
    value: `${practice.open} / ${practice.count}`,
  },
  {
    color: "gray",
    icon: DocumentTextIcon,
    title: "Feedback Approved",
    value: `${report.open} / ${report.count}`,
  }
];

export default statisticsCardsDataTheacher;
