import axios from 'axios';
export const updateRoleAPI = async (uid, newrole) => {
    try {
      const response = await axios.put(`https://smith11.ce.kmitl.ac.th/api/user/${uid}`, { newrole });
      console.log(response.data.message);
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };