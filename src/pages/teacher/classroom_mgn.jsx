import React, { useState, useEffect } from "react";
import SearchAndAddSection from "./functionTables/SearchAndAdd";
import ClassroomTable from "./functionTables/ClassroomTable";
import ClassroomModal from "./functionTables/classroommodal";
import { classroomTableData } from "@/data/classroom-table-data";
import { addClassroomAPI } from "@/data/add-classroom";
import { useNavigate } from "react-router-dom";


export function ClassroomMgn() {
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
  useEffect(() => {
    const getClassroom = async () => {
      const data = await classroomTableData(sessionStorage.getItem("email"));
      setClassroom(data);
    };
    getClassroom();
  }, [classrooms]);
  
  // Modal State
  const [isAddClassroomOpen, setIsAddClassroomOpen] = useState(false);
  const [isEditClassroomOpen, setIsEditClassroomOpen] = useState(false);
  const [editingClassroom, setEditingClassroom] = useState(null);
  const [newClassroom, setNewClassroom] = useState({
    class_name: "",
    sec: "",
    semester: "",
    year: "",
    uid: sessionStorage.getItem("email"),
  });

  // ฟังก์ชันค้นหา
  const filteredClassroom = classrooms.filter(({ class_name, sec }) =>
    [class_name, sec].some((field) => 
      String(field).toLowerCase().includes(search.toLowerCase())
    )
  );

  // ฟังก์ชันเพิ่ม
  const handleAddClassroom = async() => {
    setClassroom([...classrooms, newClassroom]);
    addClassroomAPI(newClassroom);
    setNewClassroom({ class_name: "", sec: "", year: "" , semester: ""});
    setIsAddClassroomOpen(false);
  };

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
      {/* Section การค้นหาและปุ่ม Add */}
      <SearchAndAddSection
        search={ search }
        setSearch={ setSearch }
        toggleAddModal={() => setIsAddClassroomOpen(true)}
        
      />
      
      {/* Section ตาราง Classroom */}
      <ClassroomTable
        classrooms={filteredClassroom}
        onEditClick={(classroom) => {
          setEditingClassroom(classroom);
          setIsEditClassroomOpen(true);
        }}
      />
      
    
      {/* Modal add classroom */}
      <ClassroomModal
        isOpen={isAddClassroomOpen}
        toggleModal={() => setIsAddClassroomOpen(false)}
        classroomData={newClassroom}
        setClassroomData={setNewClassroom}
        onSave={handleAddClassroom}
        btnStatus={"Add"}
      />

      {/* Modal edit classroom */}
      <ClassroomModal
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

export default ClassroomMgn;