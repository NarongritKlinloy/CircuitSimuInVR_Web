import axios from 'axios';
import Swal from 'sweetalert2';
export const editStudentAPI = async (uid, class_id) => {
    try {
        const result = await axios.put(`http://localhost:5000/api/classroom/sec/${class_id}`, class_id);
        console.log(class_id);
        if (result.status == 200) {
            Swal.fire({
                title: "Updated!",
                text: `${uid} has been updated.`,
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
            text: `${uid} can't update..`,
            icon: "error",
            confirmButtonText: "OK",
            customClass: {
                confirmButton: "bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600",
            },
        });
    }
}