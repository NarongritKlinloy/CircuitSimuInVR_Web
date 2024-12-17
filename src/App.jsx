import { Routes, Route, Navigate } from "react-router-dom";
import { Teacher, Dashboard, Auth } from "@/layouts";

function App() {
  return (
    <Routes>
      <Route path="/teacher/*" element={<Teacher />} />
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="/auth/*" element={<Auth />} />
      <Route path="*" element={<Navigate to="/auth/sign-in" replace />} />
    </Routes>
  );
}

export default App;
