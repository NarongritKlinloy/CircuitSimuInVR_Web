import axios from "axios";
export const addLogAPI = async (uid, log_type, practice_id) => {
  try {
    const data = {
        uid: uid,
        log_type: log_type,
        practice_id: practice_id,
      };
    const result = await axios.post(`https://smith11.ce.kmitl.ac.th/api/log/visit`, data);
    return result.data;
  } catch (err) {
    console.error('Error insert log', err);
    return 0;
  }
};