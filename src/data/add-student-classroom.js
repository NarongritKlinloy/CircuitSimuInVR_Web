import axios from "axios";
import Swal from 'sweetalert2';
export const addStudentAPI = async (data) => {
  try {
    const result = await axios.post(`http://localhost:5000/api/classroom/student`, data);
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

export const addMultiStudentAPI = async (data) => {
  try {
    const result = await axios.post(`http://localhost:5000/api/classroom/student/multidata`, { data });
    console.log(result);
    if (result.status == 200) {
      const uids = result.data.map((item) => item.uid);
      let text = "Added Successfully!!<br>"; // เพิ่ม \n ตรงนี้

      if (uids.length > 10) {
        text += "But Student ID : <br>";
        text += uids.slice(0, 10).join("<br>");
        text += `<br>And ${uids.length - 10} other student can't be added to the classroom.`; // เพิ่ม \n ตรงนี้
      } else if(uids.length < 10 && uids.length !== 0){
        text += "But Student ID : <br>";
        text += uids.join("<br>");
        text += "<br>Can't be added to the classroom.";
      }else{
        text += "";
      }

      Swal.fire({
        title: "Added!",
        html: text,
        icon: "success",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600",
        },
      });
    }
  } catch (err) {
    let errorMessage = "Failed to add students.";
    Swal.fire({
      title: "Failed!",
      text: errorMessage,
      icon: "error",
      confirmButtonText: "OK",
      customClass: {
        confirmButton: "bg-red-500 text-white rounded px-4 py-2 hover:bg-blue-600",
      },
    });
  }
};