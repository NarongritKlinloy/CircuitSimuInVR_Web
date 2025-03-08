import axios from 'axios';
export const signInAPI = async (uid, name, role_id) => {
  try{
    const response = await axios.post(`https://smith11.ce.kmitl.ac.th/api/user/${uid}/${name}/${role_id}}`);
    return response.data;
  }
  catch(error){
    console.error('Error sign in', error);
  }
};
export default signInAPI;