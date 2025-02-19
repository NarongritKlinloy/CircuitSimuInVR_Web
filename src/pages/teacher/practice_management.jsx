import React, { useState, useEffect } from "react";
import SearchSection from "./functionTables/SearchSection";
import ClassroomList from "./functionTables/ClassroomList";
import { ClassroomData } from "@/data/classroom-list";
import { useNavigate } from "react-router-dom";

export function PracticeManagement() {
  const navigate = useNavigate();
  useEffect(() => {
    try {
      const role = sessionStorage.getItem("role");
      if (role === "admin") {
        navigate("/dashboard/home");
      }else if(role === null){
        navigate("/auth/sign-in");
      }
    } catch (error) {
      console.error("Error accessing sessionStorage:", error);
      navigate("/auth/sign-in");
    }
  }, [navigate]);
  const [search, setSearch] = useState(""); // คำค้นหา
  const [classrooms, setClassroom] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const getClassroom = async () => {
    const data = await ClassroomData();
    setClassroom(data);
  };

  // toggle refresh status
  const handleRefresh = () => {
    setRefresh(prev => !prev);
  };

  // auto refresh page after data change
  useEffect(() => {
    getClassroom();
  }, [refresh]);

  // ฟังก์ชันกรองข้อมูล Classroom Table
  const filteredClassroom = classrooms.filter(({ class_name, sec, semester, year }) =>
    [ class_name, sec, semester, year].some((field) =>
      String(field).toLowerCase().includes(search.toLowerCase())
      // console.log(field)
    ) 
  );

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      {/* Section การค้นหา */}
      <SearchSection
        search={search}
        setSearch={setSearch}
      />

      <ClassroomList
        classrooms={filteredClassroom}
        // checkStatus={handleRefresh}
      />

    </div>
  );
}

export default PracticeManagement;