import axios from "axios";
export const classroomTableData = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/api/classroom`);
    return response.data;
  } catch (error) {
    console.error('Error fetching classroom', error);
    return [];
  }
};
  export default classroomTableData;
  