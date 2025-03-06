import axios from "axios";
import Swal from 'sweetalert2';
export const addClassroomPractice = async (data) => {
  try {
    console.log("Request Data:", data);
    const result = await axios.post(`https://smith11.ce.kmitl.ac.th/api/classroom/practice`, data);
    if (result.status == 200) {
      Swal.fire({
        title: "Added!",
        text: `Updated class practice`,
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
      text: `Can not add class practice`,
      icon: "error",
      confirmButtonText: "OK",
      customClass: {
        confirmButton: "bg-red-500 text-white rounded px-4 py-2 hover:bg-blue-600",
      },
    });
  }
};