import axios from "axios";
export const ClassroomData = async (uid) => {
  try {
    const response = await axios.get(`http://backend:5000/api/classroom/${uid}`);
    console.log(response);
    return response.data;
  } catch (error) {
    console.error('Error fetching classroom', error);
    return [];
  }
};

export const ClassroomDataTeacher = async (uid) => {
  try {
    const response = await axios.get(`http://backend:5000/api/classroom/teach/${uid}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching classroom', error);
    return [];
  }
};
  export default ClassroomData;
  