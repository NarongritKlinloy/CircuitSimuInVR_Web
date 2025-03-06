import axios from "axios";
export const ClassroomData = async (uid) => {
  try {
    const response = await axios.get(`https://smith11.ce.kmitl.ac.th/api/classroom/${uid}`);
    console.log(response);
    return response.data;
  } catch (error) {
    console.error('Error fetching classroom', error);
    return [];
  }
};

export const ClassroomDataTeacher = async (uid) => {
  try {
    const response = await axios.get(`https://smith11.ce.kmitl.ac.th/api/classroom/teach/${uid}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching classroom', error);
    return [];
  }
};
  export default ClassroomData;
  