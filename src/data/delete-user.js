import axios from 'axios';
export const deleteUserAPI = async (uid) => {
    try {
        const response = await axios.delete(`http://backend:5000/api/user/${uid}`);
        console.log(response.data.message);
    } catch (error) {
        console.error("Error deleting user:", error);
    }
};