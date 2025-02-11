import axios from 'axios';
export const deleteTAAPI = async (uid, class_id) => {
    try {
        const response = await axios.delete(`http://localhost:5000/api/classroom/assistant/${uid}/${class_id}`);
        console.log(uid,class_id);
        // console.log(response.data.message);
    } catch (error) {
        console.error("Error deleting TA of classroom:", error);
    }
};