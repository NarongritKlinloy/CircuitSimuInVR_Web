import axios from 'axios';
export const deleteUserAPI = async (uid) => {
    try {
        const response = await axios.delete(`http://smith11.ce.kmitl.ac.th/api/user/${uid}`);
        console.log(response.data.message);
    } catch (error) {
        console.error("Error deleting user:", error);
    }
};