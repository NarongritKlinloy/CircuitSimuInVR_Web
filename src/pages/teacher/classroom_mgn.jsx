import React, { useState, useEffect } from "react";
import SearchAndAddSection from "./functionTables/SearchAndAdd";
import ClassroomTable from "./functionTables/ClassroomTable";
import ClassroomModal from "./functionTables/classroommodal";
import { classroomTableData } from "@/data/classroom-table-data";

export function ClassroomMgn() {
  const [search, setSearch] = useState(""); // คำค้นหา
  const [classrooms, setClassroom] = useState([]);
  useEffect(() => {
    const getClassroom = async () => {
      const data = await classroomTableData();
      //console.log("data: ", data);
      setClassroom(data);
    };
    getClassroom();
  }, []);
  // Modal State
  const [isAddClassroomOpen, setIsAddClassroomOpen] = useState(false);
  const [isEditClassroomOpen, setIsEditClassroomOpen] = useState(false);
  const [editingClassroom, setEditingClassroom] = useState(null);
  const [newClassroom, setNewClassroom] = useState({
    class_name: "",
    sec: "",
    semester: "",
    year: "",
  });

  // ฟังก์ชันค้นหา
  const filteredClassroom = classrooms.filter(({ class_name, sec }) =>
    [class_name, sec].some((field) =>
      field.toLowerCase().includes(search.toLowerCase())
    )
  );

  // ฟังก์ชันเพิ่ม
  const handleAddClassroom = () => {
    //console.log("Hello!");
    setClassroom([...classrooms, newClassroom]);
    setNewClassroom({ class_name: "", sec: "", year: "" , semester: ""});
    setIsAddClassroomOpen(false);
  };

  // ฟังก์ชันแก้ไข
  const handleEditAuthor = () => {
    setClassroom((prevAuthors) =>
      prevAuthors.map((classroom) =>
        classroom.name === editingClassroom.name ? editingClassroom : classroom
      )
    );
    setIsEditClassroomOpen(false);
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      {/* Section การค้นหาและปุ่ม Add */}
      <SearchAndAddSection
        search={search}
        setSearch={setSearch}
        toggleAddModal={() => setIsAddClassroomOpen(true)}
      />

      {/* Section ตาราง Authors */}
      <ClassroomTable
        classrooms={filteredClassroom}
        onEditClick={(classroom) => {
          setEditingClassroom(classroom);
          setIsEditClassroomOpen(true);
        }}
      />
      
    
      {/* Modal สำหรับเพิ่มข้อมูลผู้ใช้ */}
      <ClassroomModal
        isOpen={isAddClassroomOpen}
        toggleModal={() => setIsAddClassroomOpen(false)}
        classroomData={newClassroom}
        setClassroomData={setNewClassroom}
        onSave={handleAddClassroom}
      />

      {/* Modal สำหรับแก้ไขข้อมูลผู้ใช้ */}
      <ClassroomModal
        isOpen={isEditClassroomOpen}
        toggleModal={() => setIsEditClassroomOpen(false)}
        classroomData={editingClassroom}
        setClassroomData={setEditingClassroom}
        onSave={handleEditAuthor}
      />

    </div>
  );
}

export default ClassroomMgn;