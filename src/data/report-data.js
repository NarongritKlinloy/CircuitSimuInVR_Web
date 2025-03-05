// export const ReportTableData = [
//     {
//         img: "https://www.ce.kmitl.ac.th/api/faculty/download/Kiatnarong", // รูปภาพตัวแทน
//         name: "Dr. Kiatnarong Tongprasert",
//         email: "kiatnarong.to@kmitl.ac.th",
//         description: "ใช้งานยากจริงๆใช้ไปใช้มาก็ค้างดูไม่สมูทเลยโครตน่าเบื่ออยากจะเล่นให้ดูสมจริงแต่ปัญหาก็โครตเยอะ",
//         date: "14/09/20",
//         role: "Teacher",
//       },
//       {
//         img: "https://scontent.fbkk5-5.fna.fbcdn.net/v/t1.6435-9/75264827_2515988055347046_1934387376730144768_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeG-Jq_N1HTdvDHa-yeYEWZO73aeDbRE7Cbvdp4NtETsJqxtQVlqx4cP__lgWUvw292Pyt-4D8M4JHjv5FFAClFz&_nc_ohc=oeqc6kFNEs0Q7kNvgE5Ti13&_nc_zt=23&_nc_ht=scontent.fbkk5-5.fna&_nc_gid=AlLZwTnI3JRcnmZAvvwkGjk&oh=00_AYAfu8SM5x3VWDigKexg1jKcU6Oe7P-cdfQVstsZJl6KSQ&oe=677E6761",
//         name: "Fluke ",
//         email: "65015101@kmitl.ac.th",
//         description: "โครตกาก",
//         date: "14/09/20",
//         role: "Student",
//       },
//       {
//         img: "https://scontent.fbkk5-6.fna.fbcdn.net/v/t39.30808-1/354452417_2870340309765467_985370166059778613_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=102&ccb=1-7&_nc_sid=0ecb9b&_nc_eui2=AeHexhRPjdJI4A1drQo5nYVCiENxBgDYWiKIQ3EGANhaIi-63Ic8Ben-EMhwT2NCePmMt5Nz_CDKhRlWSK0IqJ-v&_nc_ohc=bUXPwR54cFEQ7kNvgFc8arc&_nc_zt=24&_nc_ht=scontent.fbkk5-6.fna&_nc_gid=A2JFJtqbyVwLJ-ZApIsDL4U&oh=00_AYB1Kg7mmQVp-nBv27DCTL81fy_JOkUn6vpUnIj5EPeCCA&oe=675CCCC7",
//         name: "Nong Champ",
//         email: "65015168@kmitl.ac.th",
//         description: "ควรปรับปรุงเรื่องการต่อวงจรรู้สึกว่าการที่เราจะทำอะไรสักอย่างที่ตั้งใจมันต้องมีความสมจริงมากกว่านี้ไม่ควรจะต้องมามีปัญหาแบบนี้ หนึ่งเลยนะคือต้องแก้การเชื่อมต่อทำให้มันดูสมูทขึ้นมากกว่านี้ สองคือถ้าต้องการให้มีการต่อให้สมจริงขึ้นควรเพิ่มอันนี้อีกนิดหน่อย ยังไงก็ฝากปรับปรุงด้วยนะครับ",
//         date: "14/09/20",
//         role: "Student",
//       },
//   ];

import axios from "axios";
export const ReportTableData = async () => {
  // const email = sessionStorage.getItem("email"); // ดึงค่า uid จาก sessionStorage
  try {
    const response = await axios.get(`https://backend:5000/api/adminreport`);
    // headers: { "x-uid": email } // ส่งค่า uid ไปใน Query Parameters
    return response.data;
  } catch (error) {
    console.error('Error fetching Report', error);
    return [];
  }
};
  export default ReportTableData;