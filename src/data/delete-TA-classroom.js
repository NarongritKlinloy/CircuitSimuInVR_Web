import axios from 'axios';
import Swal from 'sweetalert2';
export const deleteTAAPI = async (uid, class_id) => {
    try {
        const response = await axios.delete(`http://localhost:3000/api/classroom/assistant/${uid}/${class_id}`);
        console.log(uid, class_id);
        if (response.status === 200) { 
            Swal.fire({
                title: "Deleted!",
                text: `${uid} has been deleted.`,
                icon: "success", confirmButtonText: "OK",
                customClass: {
                    confirmButton: 'bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600',
                }
            });
        }
    } catch (error) {
        console.error("Error deleting TA of classroom:", error);
        Swal.fire({
            title: "Failed!",
            text: `Can not delete ${uid}`,
            icon: "error",
            confirmButtonText: "OK",
            customClass: {
                confirmButton: "bg-red-500 text-white rounded px-4 py-2 hover:bg-blue-600",
            },
        });
    }
};