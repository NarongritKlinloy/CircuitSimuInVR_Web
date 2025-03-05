import axios from "axios";
export const ClassroomPractice = async (class_id) => {
  try {
    const response = await axios.get(`http://backend:5000/api/classroom/practice/${class_id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching practice for classroom', error);
    return [];
  }
};
  export default ClassroomPractice;
  