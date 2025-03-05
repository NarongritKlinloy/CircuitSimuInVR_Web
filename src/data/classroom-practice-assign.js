import axios from "axios";
export const ClassroomPracticeAssign = async (class_id) => {
  try {
    const response = await axios.get(`https://backend:5000/api/practice/classroom/${class_id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching practice for classroom', error);
    return [];
  }
};
export default ClassroomPracticeAssign;
  