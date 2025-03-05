import axios from 'axios';
export const updatePracticeStatusAPI = async (class_id, practice_id, currentStatus) => {
  console.log(class_id, practice_id, currentStatus);
    try {
      // คำนวณสถานะใหม่ (เปลี่ยนจาก 0 เป็น 1 หรือ 1 เป็น 0)
      const newStatus = currentStatus === 1 ? 0 : 1;
      // ส่งคำขออัพเดตไปที่ API
      const response = await axios.put('http://backend:5000/api/update-status-practice', {
        class_id: class_id,
        practice_id: practice_id,
        new_status: newStatus,
      });
  
      console.log("Update successful", response.data);
      return response.data; // หรือส่งข้อมูลที่ได้รับกลับไป
    } catch (error) {
      console.error("Error updating status:", error);
      return null;
    }
  };