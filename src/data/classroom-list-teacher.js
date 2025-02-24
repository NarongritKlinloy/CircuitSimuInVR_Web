import axios from "axios";
export const ClassroomData = async (uid) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/classroom/${uid}`);
    console.log(response);
    return response.data;
  } catch (error) {
    console.error('Error fetching classroom', error);
    return [];
  }
};
  export default ClassroomData;
  