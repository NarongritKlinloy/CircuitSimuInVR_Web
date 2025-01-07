import axios from "axios";

export const fetchUsersData = async () => {
  try {
    const response = await axios.get("http://localhost:5000/users");
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

// ใช้ fetchAuthorsData เพื่อดึงข้อมูล
fetchUsersData().then((data) => {
  console.log("Users Data:", data); // ใช้แทน authorsTableData แบบฮาร์ดโค้ด
});
