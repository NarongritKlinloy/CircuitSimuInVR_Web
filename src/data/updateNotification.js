import axios from 'axios';

export const updateNotificationAPI = async (recipient_uid, report_id) => {
    if (!recipient_uid || !report_id) {
        console.error("Error: Missing required parameters (recipient_uid or report_id)");
        return { error: "Missing required parameters" };
    }

    try {
         // ส่งคำขออัพเดตไปที่ API
      const response = await axios.put('http://localhost:5000/api/update-notification', {
        recipient_uid: recipient_uid,
        report_id: report_id,
      });

        // console.log("API Response:", response.data.message);
        return response.data; // ส่งค่ากลับไปให้ใช้งาน
    } catch (error) {
        console.error(
            "Error updating notification:",
            error.response?.data?.error || error.message
        );
        return { error: error.response?.data?.error || "Failed to update notification" };
    }
};


