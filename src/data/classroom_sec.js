import axios from 'axios';
import Swal from 'sweetalert2';
export const ClassroomSecAPI = async (class_id) => {
    try {
        const result = await axios.get(`http://localhost:5000/api/classroom/sec/${class_id}`);
        return result;
    } catch (err) {
        consol.log(err);
    }
}