import axios from 'axios';
export const authorsTableData = async () => {
  try{
    const response = await axios.get('http://localhost:3000/api/student');
    return response.data;
  }
  catch(error){
    console.error('Error fetching user', error);
    return [];
  }
};
export default authorsTableData;
