import axios from "axios";
export const studentTableData = async (class_id) => {
  try {
    const response = await axios.get(`http://smith11.ce.kmitl.ac.th/api/classroom/student/${class_id}`);
    return response.data;
  }catch (error) {
    console.error('Error fetching classroom student', error);
    return [];
  }
};

export default studentTableData;