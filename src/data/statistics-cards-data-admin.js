import {
  UsersIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  BookOpenIcon,
  BuildingOffice2Icon,
} from "@heroicons/react/24/solid";
import axios from 'axios';

// ฟังก์ชันสำหรับดึงข้อมูลและนับจำนวนนักเรียน
const countStudentAPI = async () => {
  try {
    const response = await axios.get('https://smith11.ce.kmitl.ac.th/api/student/count');
    return response.data.count;
  } catch (error) {
    console.error("Error counting student:", error);
    return 0;
  }
};

// ฟังก์ชันสำหรับดึงข้อมูลและนับจำนวนอาจารย์
const countTeacherAPI = async () => {
  try {
    const response = await axios.get('https://smith11.ce.kmitl.ac.th/api/teacher/count');
    return response.data.count;
  } catch (error) {
    console.error("Error counting teacher:", error);
    return 0;
  }
};

// ฟังก์ชันสำหรับดึงข้อมูลและนับจำนวนรายงาน
const countReportAPI = async () => {
  try {
    const response = await axios.get('https://smith11.ce.kmitl.ac.th/api/report/count');
    return response.data.count;
  } catch (error) {
    console.error("Error counting report:", error);
    return 0;
  }
};

// ฟังก์ชันสำหรับดึงข้อมูลและนับจำนวนห้องเรียน
const countClassroomAPI = async () => {
  try {
    const response = await axios.get('https://smith11.ce.kmitl.ac.th/api/classroom/count');
    return response.data.count;
  } catch (error) {
    console.error("Error counting classroom:", error);
    return 0;
  }
};

// ฟังก์ชันสำหรับดึงข้อมูลและนับจำนวนการฝึกฝน
const countPracticeAPI = async () => {
  try {
    const response = await axios.get('https://smith11.ce.kmitl.ac.th/api/practices/count');
    return response.data.count;
  } catch (error) {
    console.error("Error counting practice:", error);
    return 0;
  }
};

export const statisticsCardsData = async () => { // เปลี่ยนเป็น async function
  const student_count = await countStudentAPI(); // รอให้ countStudentAPI() return ค่า
  const teacher_count = await countTeacherAPI(); // รอให้ countTeacherAPI() return ค่า
  const report_count = await countReportAPI(); // รอให้ countReportAPI() return ค่า
  const classroom_count = await countClassroomAPI(); // รอให้ countClassroomAPI() return ค่า
  const practice_count = await countPracticeAPI(); // รอให้ countPracticeAPI() return ค่า

  return [
    {
      color: "gray",
      icon: AcademicCapIcon,
      title: "Students",
      value: student_count,
    },
    {
      color: "gray",
      icon: UsersIcon,
      title: "Teachers",
      value: teacher_count,
    },
    {
      color: "gray",
      icon: DocumentTextIcon,
      title: "New Feedbacks",
      value: report_count,
    },
    {
      color: "gray",
      icon: BookOpenIcon,
      title: "Practices",
      value: practice_count,
    },
    {
      color: "gray",
      icon: BuildingOffice2Icon,
      title: "Classrooms",
      value: classroom_count,
    },
  ];
};

export default statisticsCardsData;