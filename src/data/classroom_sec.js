import axios from 'axios';
export const ClassroomSecAPI = async (class_id) => {
    try {
        const result = await axios.get(`http://smith11.ce.kmitl.ac.th/api/classroom/sec/${class_id}`);
        //console.log(result.data);
        return result.data;
    } catch (err) {
        console.error('Error fetching user', err);
        return [];
    }
};
export default ClassroomSecAPI;