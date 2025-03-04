import React, { useState, useEffect } from "react";
import SearchSection from "./functionTables/SearchSection";
import { useNavigate } from "react-router-dom";

import ClassroomPracticeModal from "./functionTables/ClassroomPractice_Modal";
import ClassroomPracticeTableAdmin from "./functionTables/ClassroomPractice_Table";
import { classroomTableData } from "@/data/classroom-table-data";


export function ClassroomPractice() {
  const navigate = useNavigate();
  
  useEffect(() => {
    try {
      const role = sessionStorage.getItem("role");
      if (role === "admin") {
        navigate("/dashboard/classroom_practice");
      }else if(role === null){
        navigate("/auth/sign-in");
      }
    } catch (error) {
      console.error("Error accessing sessionStorage:", error);
      navigate("/auth/sign-in");
    }
  }, [navigate]);
  
  const [search, setSearch] = useState(""); // คำค้นหา
  const [classroom, setClassroom] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const getClassroom = async () => {
    const data = await classroomTableData();
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

  // Modal State
  const [isEditClassroomOpen, setIsEditClassroomOpen] = useState(false);
  const [editingClassroom, setEditingClassroom] = useState(null);
    
  // ฟังก์ชันกรองข้อมูล Practice Table
  const filteredClassroom = classroom.filter(({ class_name, sec, year }) =>
    [class_name, sec, year].some((field) =>
      String(field).toLowerCase().includes(search.toLowerCase())
    ) 
  );

  // ฟังก์ชันแก้ไข
  const handleEditClassroom = () => {
    setClassroom((prev) =>
      prev.map((classroom) =>
        classroom.name === editingClassroom.name ? editingClassroom : classroom
      )
    );
    setIsEditClassroomOpen(false);
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      {/* Section การค้นหา */}
      <SearchSection
        search={search}
        setSearch={setSearch}
      />

      <ClassroomPracticeTableAdmin
        classroom={filteredClassroom}
        checkStatus={handleRefresh}
      />

      {/* Modal edit classroom */}
      <ClassroomPracticeModal
        isOpen={isEditClassroomOpen}
        toggleModal={() => setIsEditClassroomOpen(false)}
        classroomData={editingClassroom}
        setClassroomData={setEditingClassroom}
        onSave={handleEditClassroom}
        btnStatus={"Edit"}
      />

    </div>
  );
}

export default ClassroomPractice;