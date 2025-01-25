import axios from "axios";
export const studentTableData = async (class_id) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/classroom/student/${class_id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching classroom student', error);
    return [];
  }
};
export default studentTableData;