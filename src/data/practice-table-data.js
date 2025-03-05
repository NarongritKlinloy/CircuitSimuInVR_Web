import axios from 'axios';
export const practiceTableData = async () => {
  try{
    const response = await axios.get('https://backend:5000/api/practice');
    return response.data;
  } 
  catch (error) {
    console.error('Error fetching practice', error);
    return [];
  }
}
export default practiceTableData;
