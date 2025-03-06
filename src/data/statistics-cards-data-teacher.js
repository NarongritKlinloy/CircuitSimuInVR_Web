import {
  UsersIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  BookOpenIcon,
  BuildingOffice2Icon,
} from "@heroicons/react/24/solid";
import axios from 'axios';
export const countStudentAPI = async (uid) => {
    try {
        const response = await axios.get(`https://smith11.ce.kmitl.ac.th/api/student_teacher/${uid}`);
        return response.data.count;
    } catch (error) {
        console.error("Error counting student:", error);
        return 0;
    }
};

export const countClassroomAPI = async (uid) => {
  try {
    const response = await axios.get(`https://smith11.ce.kmitl.ac.th/api/classroom_teacher/${uid}`);
    return response.data.count;
  } catch (error) {
    console.error("Error counting classroom:", error);
    return 0;
  }
};

export const countPracticeAPI = async (uid) => {
  try {
    const response = await axios.get(`https://smith11.ce.kmitl.ac.th/api/practice_teacher/${uid}`);
    return response.data;
  } catch (error) {
    console.error("Error counting practice:", error);
    return 0;
  }
};

export const countReportAPI = async (uid) => {
  try {
    const response = await axios.get(`https://smith11.ce.kmitl.ac.th/api/report_teacher/${uid}`);
    return response.data;
  } catch (error) {
    console.error("Error counting report:", error);
    return 0;
  }
};

export const statisticsCardsDataTheacher = async () => { // เปลี่ยนเป็น async function
  const uid = sessionStorage.getItem("email");
  const student_count = await countStudentAPI(uid); // รอให้ countStudentAPI() return ค่า
  const report = await countReportAPI(uid); // รอให้ countReportAPI() return ค่า
  const classroom_count = await countClassroomAPI(uid); // รอให้ countClassroomAPI() return ค่า
  const practice = await countPracticeAPI(uid); // รอให้ countPracticeAPI() return ค่า

  return [
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
};

export default statisticsCardsDataTheacher;
