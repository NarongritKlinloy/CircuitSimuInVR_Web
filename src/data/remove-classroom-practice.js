import axios from "axios";
import Swal from 'sweetalert2';

export const removeClassroomPractice = async (data) => {
  try {
    console.log("Request Data:", data);
    const result = await axios.delete(`http://localhost:5001/api/classroom/practice`, { data });
    if (result.status === 200) {
      Swal.fire({
        title: "Removed!",
        text: `Class practice removed successfully.`,
        icon: "success",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600",
        },
      });
    }
  } catch (err) {
    Swal.fire({
      title: "Failed!",
      text: `Cannot remove class practice.`,
      icon: "error",
      confirmButtonText: "OK",
      customClass: {
        confirmButton: "bg-red-500 text-white rounded px-4 py-2 hover:bg-blue-600",
      },
    });
  }
};
