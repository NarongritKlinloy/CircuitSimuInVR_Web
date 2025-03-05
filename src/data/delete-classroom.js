import axios from 'axios';
import Swal from 'sweetalert2';

export const deleteClassroomAPI = async (class_id, class_name) => {
    try {
        const result = await axios.delete(`https://backend:5000/api/classroom/${class_id}`);
        console.log(result);
        if (result.status === 200) {
            Swal.fire({
                title: "Deleted!",
                text: `${class_name} has been deleted.`,
                icon: "success",
                confirmButtonText: "OK",
                customClass: {
                    confirmButton: "bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600",
                },
            });
        }
    } catch (error) {
        console.error("Error deleting classroom:", error);
        Swal.fire({
            title: "Failed!",
            text: `Can not delete ${class_name}`,
            icon: "error",
            confirmButtonText: "OK",
            customClass: {
                confirmButton: "bg-red-500 text-white rounded px-4 py-2 hover:bg-blue-600",
            },
        });
    }
};