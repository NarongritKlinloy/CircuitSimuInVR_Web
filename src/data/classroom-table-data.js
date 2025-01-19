
import axios from "axios";
export const classroomTableData = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/classroom');
    return response.data;
  } catch (error) {
    console.error('Error fetching practice', error);
    return [];
  }
};
  export default classroomTableData;
  