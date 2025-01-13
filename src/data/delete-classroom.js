import axios from 'axios';
export const deleteClassroomAPI = async (class_id) => {
    try {
        const response = await axios.delete(`http://localhost:5000/api/classroom/${class_id}`);
        console.log(response.data.message);
    } catch (error) {
        console.error("Error deleting classroom:", error);
    }
};