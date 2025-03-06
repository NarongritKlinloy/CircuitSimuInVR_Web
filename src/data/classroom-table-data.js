import axios from "axios";
export const classroomTableData = async () => {
  try {
    const response = await axios.get(`https://smith11.ce.kmitl.ac.th/api/classroom`);
    return response.data;
  } catch (error) {
    console.error('Error fetching classroom', error);
    return [];
  }
};
  export default classroomTableData;
  