import React, { useState } from "react";
import SearchAndAddSection from "./functionTables/searchandaddsection";
import AuthorsTable from "./functionTables/authorstable";
import AuthorModal from "./functionTables/authormodal";
import TeacherTable from "./functionTables/teachertable";
import TeacherModal from "./functionTables/teachermodal";
import { authorsTableData } from "@/data/authors-table-data";
import { teachersTableData } from "@/data/teachersTableData";

export function Tables() {
  const [search, setSearch] = useState(""); // คำค้นหา
  const [authors, setAuthors] = useState(authorsTableData); // เก็บรายชื่อผู้ใช้
  const [teachers, setTeachers] = useState(teachersTableData); // เก็บรายชื่ออาจารย์

  // Authors Modal State
  const [isAddAuthorOpen, setIsAddAuthorOpen] = useState(false);
  const [isEditAuthorOpen, setIsEditAuthorOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState(null);
  const [newAuthor, setNewAuthor] = useState({
    name: "",
    email: "",
    job: ["", ""],
    online: false,
    date: "",
  });

  // Teachers Modal State
  const [isAddTeacherOpen, setIsAddTeacherOpen] = useState(false);
  const [isEditTeacherOpen, setIsEditTeacherOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [newTeacher, setNewTeacher] = useState({
    name: "",
    email: "",
    department: "",
    online: false,
    date: "",
  });

  // ฟังก์ชันกรองข้อมูล Authors Table
  const filteredAuthors = authors.filter(({ name, email }) =>
    [name, email].some((field) =>
      field.toLowerCase().includes(search.toLowerCase())
    )
  );

  // ฟังก์ชันกรองข้อมูล Teachers Table
  const filteredTeachers = teachers.filter(({ name, email }) =>
    [name, email].some((field) =>
      field.toLowerCase().includes(search.toLowerCase())
    )
  );

  // ฟังก์ชันเพิ่มผู้ใช้ใหม่
  const handleAddAuthor = () => {
    setAuthors([...authors, newAuthor]);
    setNewAuthor({ name: "", email: "", job: ["", ""], online: false, date: "" });
    setIsAddAuthorOpen(false);
  };

  // ฟังก์ชันเพิ่มอาจารย์ใหม่
  const handleAddTeacher = () => {
    setTeachers([...teachers, newTeacher]);
    setNewTeacher({ name: "", email: "", department: "", online: false, date: "" });
    setIsAddTeacherOpen(false);
  };

  // ฟังก์ชันแก้ไขข้อมูลผู้ใช้
  const handleEditAuthor = () => {
    setAuthors((prevAuthors) =>
      prevAuthors.map((author) =>
        author.name === editingAuthor.name ? editingAuthor : author
      )
    );
    setIsEditAuthorOpen(false);
  };

  // ฟังก์ชันแก้ไขข้อมูลอาจารย์
  const handleEditTeacher = () => {
    setTeachers((prevTeachers) =>
      prevTeachers.map((teacher) =>
        teacher.name === editingTeacher.name ? editingTeacher : teacher
      )
    );
    setIsEditTeacherOpen(false);
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      {/* Section การค้นหาและปุ่ม Add */}
      <SearchAndAddSection
        search={search}
        setSearch={setSearch}
        toggleAddModal={() => setIsAddAuthorOpen(true)} // เริ่มต้นที่ Authors
      />

      {/* Section ตาราง Authors */}
      <h2 className="text-xl font-bold mb-4">Authors Table</h2>
      <AuthorsTable
        authors={filteredAuthors}
        onEditClick={(author) => {
          setEditingAuthor(author);
          setIsEditAuthorOpen(true);
        }}
      />

      {/* Section ตาราง Teachers */}
      <h2 className="text-xl font-bold mb-4 mt-8">Teachers Table</h2>
      <TeacherTable
        teachers={filteredTeachers}
        onEditClick={(teacher) => {
          setEditingTeacher(teacher);
          setIsEditTeacherOpen(true);
        }}
      />

      {/* Modal สำหรับเพิ่มข้อมูลผู้ใช้ */}
      <AuthorModal
        isOpen={isAddAuthorOpen}
        toggleModal={() => setIsAddAuthorOpen(false)}
        authorData={newAuthor}
        setAuthorData={setNewAuthor}
        onSave={handleAddAuthor}
      />

      {/* Modal สำหรับแก้ไขข้อมูลผู้ใช้ */}
      <AuthorModal
        isOpen={isEditAuthorOpen}
        toggleModal={() => setIsEditAuthorOpen(false)}
        authorData={editingAuthor}
        setAuthorData={setEditingAuthor}
        onSave={handleEditAuthor}
      />

      {/* Modal สำหรับเพิ่มข้อมูลอาจารย์ */}
      <TeacherModal
        isOpen={isAddTeacherOpen}
        toggleModal={() => setIsAddTeacherOpen(false)}
        teacherData={newTeacher}
        setTeacherData={setNewTeacher}
        onSave={handleAddTeacher}
      />

      {/* Modal สำหรับแก้ไขข้อมูลอาจารย์ */}
      <TeacherModal
        isOpen={isEditTeacherOpen}
        toggleModal={() => setIsEditTeacherOpen(false)}
        teacherData={editingTeacher}
        setTeacherData={setEditingTeacher}
        onSave={handleEditTeacher}
      />
    </div>
  );
}

export default Tables;
