import axios from "axios";

export const fetchUsersData = async () => {
  try {
    const response = await axios.get("http://localhost:3000/users");
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

fetchUsersData().then((data) => {
  console.log("Users Data:", data); 
});
