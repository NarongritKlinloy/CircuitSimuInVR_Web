import axios from "axios";
export const NotificationReportData = async () => {
  // const email = sessionStorage.getItem("email"); // ดึงค่า uid จาก sessionStorage
  try {
    const response = await axios.get(`http://localhost:5000/api/countnotifications`);
    // headers: { "x-uid": email } // ส่งค่า uid ไปใน Query Parameters
    console.log("NotificationReportData" +response)
    return response.data;
  } catch (error) {
    console.error('Error fetching Report', error);
    return [];
  }
};
  export default NotificationReportData;