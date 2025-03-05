import axios from 'axios';

export const signInAPI = async (uid, name, role_id, last_active) => {
  try {
    const response = await axios.post(`https://smith11.ce.kmitl.ac.th/api/user/${uid}/${name}/${role_id}/${last_active}`);
    return response.data;
  } catch (error) {
    console.error("Error sign in", error);
    throw error;  // เพิ่มการ throw error เพื่อให้สามารถจัดการได้ที่จุดอื่น
  }
};

export default signInAPI;
