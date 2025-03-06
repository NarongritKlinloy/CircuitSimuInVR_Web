import axios from "axios";
export const TATableData = async (class_id) => {
  try {
    const response = await axios.get(`https://smith11.ce.kmitl.ac.th/api/classroom/assistant/${class_id}`);
    return response.data;
  }catch (error) {
    console.error('Error fetching teacher assistant data', error);
    return [];
  }
};

export default TATableData;