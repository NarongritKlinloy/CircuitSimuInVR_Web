import axios from "axios";
export const addClassroom = async (class_name, sec, semester, year) => {
    try{
      const response = await axios.post('http://localhost:5000/api/classroom/add', {
        class_name: class_name,
        sec: sec,
        semester: semester,
        year: year,
      });
      console.log("Added successfully");
      return response.data;
    } 
    catch (error) {
      console.error('Error adding classroom', error);
      return null;
    }
  };
  export default addClassroom;