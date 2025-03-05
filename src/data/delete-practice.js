import axios from 'axios';
import Swal from 'sweetalert2';

export const deletePracticeAPI = async ({ practice_id, practice_name }) => {
  try {
    const response = await axios.delete(`http://backend:5000/api/practice/${practice_id}`);
    console.log(response.data.message);
    if (response.status === 200) {
      await Swal.fire({
        title: "Deleted!",
        text: `${practice_name} has been deleted.`,
        icon: "success",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600",
        },
      });
    }
  } catch (error) {
    console.error("Error deleting practice:", error);
    await Swal.fire({
      title: "Failed!",
      text: `Cannot delete ${practice_name}`,
      icon: "error",
      confirmButtonText: "OK",
      customClass: {
        confirmButton: "bg-red-500 text-white rounded px-4 py-2 hover:bg-blue-600",
      },
    });
  }
};
