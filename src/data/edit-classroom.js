import axios from 'axios';
import Swal from 'sweetalert2';
export const editClassroomAPI = async (id, data) => {
    try {
        const result = await axios.put(`http://localhost:3000/api/classroom/${id}`, data);
        if (result.status == 200) {
            Swal.fire({
                title: "Updated!",
                text: `${data.class_name} has been updated.`,
                icon: "success",
                confirmButtonText: "OK",
                customClass: {
                    confirmButton: "bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600",
                },
            });
        }
    } catch (err) {
        Swal.fire({
            title: "Updated!",
            text: `${data.class_name} can't update..`,
            icon: "error",
            confirmButtonText: "OK",
            customClass: {
                confirmButton: "bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600",
            },
        });
    }
}