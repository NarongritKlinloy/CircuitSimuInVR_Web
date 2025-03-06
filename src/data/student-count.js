import axios from 'axios';

export const countStudentAPI = async (class_id) => {
    try {
        const response = await axios.get(`https://smith11.ce.kmitl.ac.th/api/classroom/student/count/${class_id}`);
        // console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error counting enrollment:", error);
        return 0;
    }
};