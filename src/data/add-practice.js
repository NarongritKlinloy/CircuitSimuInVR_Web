import axios from "axios";
import Swal from 'sweetalert2';
export const addPracticeAPI = async (data) => {
  try {
    console.log("Sending data:", data);
    const result = await axios.post(`https://backend:5000/api/practice`, data);
    if (result.status == 200) {
      Swal.fire({
        title: "Added!",
        text: `${data.practice_name} has been added.`,
        icon: "success",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600",
        },
      });
    }
  } catch (err) {
    console.error("Error adding practice:", err);
    Swal.fire({
      title: "Failed!",
      text: `Can not add ${data.practice_name}`,
      icon: "error",
      confirmButtonText: "OK",
      customClass: {
        confirmButton: "bg-red-500 text-white rounded px-4 py-2 hover:bg-blue-600",
      },
    });
  }
};