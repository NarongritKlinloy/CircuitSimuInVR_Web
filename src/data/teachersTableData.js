import axios from 'axios';
export const teachersTableData = async () => {
  try{
    const response = await axios.get('https://backend:5000/api/teacher');
    return response.data;
  }
  catch(error){
    console.error('Error fetching user', error);
    return [];
  }
};
export default teachersTableData;
  
  