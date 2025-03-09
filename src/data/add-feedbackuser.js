import axios from "axios";
import Swal from "sweetalert2";

export const addFeedbackuser = async (data) => {
  try {
    const result = await axios.post(`https://smith11.ce.kmitl.ac.th/api/feedbackuser`, data);
    if (result.status === 200) {
      Swal.fire({
        title: "Added!",
        text: result.data.message,
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#3b82f6" // ✅ ปรับให้ตรงกับปุ่ม Submit
      });
    }
  } catch (err) {
    Swal.fire({
      title: "Failed!",
      text: err.response?.data?.message || "Something went wrong!",
      icon: "error",
      confirmButtonText: "OK",
      confirmButtonColor: "#e3342f"
    });
  }
};
