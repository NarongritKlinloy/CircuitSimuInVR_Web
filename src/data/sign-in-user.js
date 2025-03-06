import axios from 'axios';
export const signInAPI = async (uid, name, role_id, last_active) => {
  try{
    const response = await axios.post(`http://localhost:5000/api/user/${uid}/${name}/${role_id}/${last_active}`);
    return response.data;
  }
  catch(error){
    console.error('Error sign in', error);
  }
};
export default signInAPI;