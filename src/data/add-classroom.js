import axios from "axios";
import Swal from 'sweetalert2';
export const addClassroomAPI = async (data) => {
  try {
    const result = await axios.post(`http://localhost:5001/api/classroom`, data);
    if (result.status == 200) {
      Swal.fire({
        title: "Added!",
        text: `${data.class_name} has been added.`,
        icon: "success",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600",
        },
      });
    }
  } catch (err) {
    console.error("Error adding classroom:", err);
    Swal.fire({
      title: "Failed!",
      text: `Can not add ${data.class_name}`,
      icon: "error",
      confirmButtonText: "OK",
      customClass: {
        confirmButton: "bg-red-500 text-white rounded px-4 py-2 hover:bg-blue-600",
      },
    });
  }
};