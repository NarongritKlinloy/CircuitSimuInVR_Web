import axios from "axios";
export const ClassroomPractice = async (class_id) => {
  try {
    const response = await axios.get(`https://smith11.ce.kmitl.ac.th/api/classroom/practice/${class_id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching practice for classroom', error);
    return [];
  }
};
  export default ClassroomPractice;
  