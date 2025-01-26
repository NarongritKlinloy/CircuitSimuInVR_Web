import axios from 'axios';
export const deleteStudentAPI = async (uid, class_id) => {
    try {
        const response = await axios.delete(`http://localhost:5000/api/classroom/student/${uid}/${class_id}`);
        console.log(response.data.message);
    } catch (error) {
        console.error("Error deleting student of classroom:", error);
    }
};