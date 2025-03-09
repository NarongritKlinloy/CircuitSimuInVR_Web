import { useState, useEffect } from "react";
import { Typography } from "@material-tailwind/react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { addFeedbackuser } from "@/data/add-feedbackuser"; // ✅ แก้ชื่อ import ให้ถูกต้อง

export function FeedbackPage() {
  const navigate = useNavigate();
  const [uid, setuid] = useState("");
  const [report_detail, setreport_detail] = useState("");
  const [feedbackList, setFeedbackList] = useState([]);
  const [responseMessage, setResponseMessage] = useState(""); // ✅ เพิ่ม state สำหรับแสดงผลลัพธ์
  const [responseType, setResponseType] = useState(""); // ✅ success หรือ error

  useEffect(() => {
    sessionStorage.clear();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!uid || !report_detail) return;

    const newFeedback = { uid, report_detail };
    
    try {
      const result = await addFeedbackuser(newFeedback); // ✅ เรียก API ที่แก้ไขแล้ว
      setFeedbackList([...feedbackList, newFeedback]);
      setuid("");
      setreport_detail("");

      setResponseMessage("Thank you for your feedback!"); // ✅ แสดงข้อความสำเร็จ
      setResponseType("success");
    } catch (error) {
      setResponseMessage("Unable to send feedback. Please try again!"); // ✅ แสดงข้อความผิดพลาด
      setResponseType("error");
    }
  };

  return (
    <section className="flex flex-wrap items-center justify-center min-h-screen bg-[url('https://img5.pic.in.th/file/secure-sv1/65395415_9563801.jpg')] bg-cover bg-center px-4 sm:px-6 md:px-8">
      <div className="w-full max-w-lg p-6 md:p-8 lg:p-10 bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="text-center">
          <Typography variant="h3" className="font-bold text-gray-800 text-xl sm:text-2xl md:text-3xl">
            Feedback System
          </Typography>
          <Typography
            variant="paragraph"
            color="blue-gray"
            className="text-sm sm:text-lg font-normal mt-2"
          >
            Please leave your feedback about our system.
          </Typography>
        </div>
        <div className="mt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Please enter your email address."
              value={uid}
              onChange={(e) => setuid(e.target.value)}
              className="w-full px-4 py-2 border rounded-md text-sm sm:text-base"
              required
            />
            <textarea
              placeholder="Write your comments here..."
              value={report_detail}
              onChange={(e) => setreport_detail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md text-sm sm:text-base"
              required
            />
            <button 
              type="submit" 
              className="w-full bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 text-sm sm:text-base"
            >
              Submit
            </button>
          </form>
          {responseMessage && (
            <div className={`mt-4 p-3 text-center rounded-lg ${responseType === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {responseMessage}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default FeedbackPage;
