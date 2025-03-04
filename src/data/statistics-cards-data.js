import {
  UsersIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  BookOpenIcon,
  BuildingOffice2Icon,
} from "@heroicons/react/24/solid";
import axios from 'axios';

export const countStudentAPI = async () => {
    try {
        const response = await axios.get('http://localhost:3000/api/student/count');
        return response.data.count;
    } catch (error) {
        console.error("Error counting student:", error);
        return 0;
    }
};
const student_count = await countStudentAPI();

export const countTeacherAPI = async () => {
  try {
      const response = await axios.get('http://localhost:3000/api/teacher/count');
      return response.data.count;
  } catch (error) {
      console.error("Error counting teacher:", error);
      return 0;
  }
};
const teacher_count = await countTeacherAPI();

export const countReportAPI = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/report/count');
    return response.data.count;
  } catch (error) {
    console.error("Error counting report:", error);
    return 0;
  }
};
const report_count = await countReportAPI();

export const countClassroomAPI = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/classroom/count');
    return response.data.count;
  } catch (error) {
    console.error("Error counting classroom:", error);
    return 0;
  }
};
const classroom_count = await countClassroomAPI();

export const countPracticeAPI = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/practices/count');
    return response.data.count;
  } catch (error) {
    console.error("Error counting practice:", error);
    return 0;
  }
};
const practice_count = await countPracticeAPI();

export const statisticsCardsData = [
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

export default statisticsCardsData;
