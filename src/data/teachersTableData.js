import axios from 'axios';
export const teachersTableData = async () => {
  try{
    const response = await axios.get('http://localhost:5001/api/teacher');
    return response.data;
  }
  catch(error){
    console.error('Error fetching user', error);
    return [];
  }
};
export default teachersTableData;
  
  