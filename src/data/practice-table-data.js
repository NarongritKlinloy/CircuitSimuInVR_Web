import axios from 'axios';
export const practiceTableData = async () => {
  try{
    const response = await axios.get('https://smith11.ce.kmitl.ac.th/api/practice');
    return response.data;
  } 
  catch (error) {
    console.error('Error fetching practice', error);
    return [];
  }
}
export default practiceTableData;
