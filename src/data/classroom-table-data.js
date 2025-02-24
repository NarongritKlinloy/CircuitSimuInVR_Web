import axios from "axios";
export const classroomTableData = async (uid) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/classroom/teach/${uid}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching classroom', error);
    return [];
  }
};
  export default classroomTableData;
  