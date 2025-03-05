import axios from 'axios';
export const ClassroomScore = async (class_id, practice_id) => {
    console.log(class_id,practice_id);
    try {
        const response = await axios.get(`http://backend:5000/api/classroom/practice/${class_id}/${practice_id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching practice score', error);
        return [];
    }
};