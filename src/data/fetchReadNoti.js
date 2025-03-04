import axios from 'axios';

/**
 * ✅ ฟังก์ชันดึงรายการ report_id ที่มี is_read = 1
 */
export const fetchReadNotifications = async (recipient_uid) => {
    if (!recipient_uid) {
        console.error("❌ Error: Missing required parameter (recipient_uid)");
        return { error: "Missing required parameter" };
    }

    try {
        const response = await axios.get(`http://smith11.ce.kmitl.ac.th/api/get-read-notifications?recipient_uid=${recipient_uid}`);
        
        // console.log("✅ API Response:", response.data); // ✅ ตรวจสอบค่าที่ได้รับจาก API
        return response.data; // ✅ คืนค่าเป็นอาร์เรย์ของ report_id
    } catch (error) {
        console.error(
            "❌ Error fetching read notifications:",
            error.response?.data?.error || error.message
        );
        return { error: error.response?.data?.error || "Failed to fetch read notifications" };
    }
};
