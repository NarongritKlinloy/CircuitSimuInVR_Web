import axios from "axios";
import Swal from 'sweetalert2';
export const addTAAPI = async (data) => {
  try {
    const result = await axios.post(`https://backend:5000/api/classroom/assistant`, data);
    if (result.status == 200) {
      Swal.fire({
        title: "Added!",
        text: `${data.uid} has been added.`,
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
      text: `Can not add ${data.uid}`,
      icon: "error",
      confirmButtonText: "OK",
      customClass: {
        confirmButton: "bg-red-500 text-white rounded px-4 py-2 hover:bg-blue-600",
      },
    });
  }
};