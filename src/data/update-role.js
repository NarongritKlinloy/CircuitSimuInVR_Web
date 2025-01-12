import axios from 'axios';
export const updateRoleAPI = async (uid, newrole) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/user/${uid}`, { newrole });
      console.log(response.data.message);
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };