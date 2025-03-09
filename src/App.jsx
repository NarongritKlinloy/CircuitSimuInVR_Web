import { Routes, Route, Navigate } from "react-router-dom";
import { Teacher, Dashboard, Auth } from "@/layouts";
import FeedbackPage from "@/pages/auth/FeedbackUser"; // ✅ ตรวจสอบ path ให้ถูกต้อง

function App() {
  return (
    <Routes>
      <Route path="/teacher/*" element={<Teacher />} />
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="/auth/*" element={<Auth />} />
      <Route path="/api/*" />
      <Route path="*" element={<Navigate to="/auth/sign-in" replace />} />
      <Route path="/feedbackuser" element={<FeedbackPage />} />    
    </Routes>
  );
}

export default App;
