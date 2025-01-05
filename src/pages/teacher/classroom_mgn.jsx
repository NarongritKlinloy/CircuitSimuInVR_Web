import React, { useState } from "react";
import SearchAndAddSection from "./functionTables/SearchAndAdd";
import ClassroomTable from "./functionTables/ClassroomTable";
import ClassroomModal from "./functionTables/classroommodal";
import { classroomTableData } from "@/data/classroom-table-data";

export function ClassroomMgn() {
  const [search, setSearch] = useState(""); // คำค้นหา
  const [classrooms, setClassroom] = useState(classroomTableData);

  // Authors Modal State
  const [isAddClassroomOpen, setIsAddClassroomOpen] = useState(false);
  const [isEditClassroomOpen, setIsEditClassroomOpen] = useState(false);
  const [editingClassroom, setEditingClassroom] = useState(null);
  const [newClassroom, setNewClassroom] = useState({
    name: "",
    email: "",
    job: ["", ""],
    online: false,
    date: "",
  });

  // ฟังก์ชันกรองข้อมูล Authors Table
  const filteredClassroom = classrooms.filter(({ name, email }) =>
    [name, email].some((field) =>
      field.toLowerCase().includes(search.toLowerCase())
    )
  );

  // ฟังก์ชันเพิ่มผู้ใช้ใหม่
  const handleAddClassroom = () => {
    setClassroom([...classrooms, newClassroom]);
    setNewClassroom({ name: "", email: "", job: ["", ""], online: false, date: "" });
    setIsAddClassroomOpen(false);
  };

  // ฟังก์ชันแก้ไขข้อมูลผู้ใช้
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