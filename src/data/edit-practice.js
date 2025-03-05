import axios from 'axios';
import Swal from 'sweetalert2';

export const editPracticeAPI = async (practiceData) => {
    try {
      const { practice_id, practice_name } = practiceData;
      const result = await axios.put(`https://backend:5000/api/practice/${practice_id}`,practiceData );
      if (result.status === 200) {
        Swal.fire({
          title: "Updated!",
          text: `${practice_name} has been updated.`,
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
        text: `Can't update ${practiceData.practice_name}`,
        icon: "error",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600",
        },
      });
    }
};