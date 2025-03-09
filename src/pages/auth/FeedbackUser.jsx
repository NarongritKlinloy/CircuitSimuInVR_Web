import { useState, useEffect } from "react";
import { Typography } from "@material-tailwind/react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
//import { addFeedbackAPI } from "@/data/feedback";

export function FeedbackPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [feedbackList, setFeedbackList] = useState([]);

  useEffect(() => {
    sessionStorage.clear();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !comment) return;

    const newFeedback = { name, comment };
    setFeedbackList([...feedbackList, newFeedback]);
    //addFeedbackAPI(name, comment);
    setName("");
    setComment("");

    Swal.fire({
      icon: "success",
      title: "Feedback Submitted",
      text: "Thank you for your feedback!",
      confirmButtonText: "OK",
    });
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
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-md text-sm sm:text-base"
              required
            />
            <textarea
              placeholder="Write your comments here..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
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
        </div>
      </div>
    </section>
  );
}

export default FeedbackPage;
