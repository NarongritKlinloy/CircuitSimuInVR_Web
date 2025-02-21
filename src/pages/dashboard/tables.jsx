import React, { useEffect, useState } from "react";
import SearchSection from "./functionTables/SearchSection";
import AuthorsTable from "./functionTables/authorstable";
import AuthorModal from "./functionTables/authormodal";
import TeacherTable from "./functionTables/teachertable";
import { authorsTableData } from "@/data/authors-table-data";
import { teachersTableData } from "@/data/teachersTableData";
import { useNavigate } from "react-router-dom";

export function Tables() {
  const navigate = useNavigate();
  useEffect(() => {
    try {
      const role = sessionStorage.getItem("role");
      if (role === "teacher") {
        navigate("/teacher/home");
      }else if(role === null){
        navigate("/auth/sign-in");
      }
    } catch (error) {
      console.error("Error accessing sessionStorage:", error);
      navigate("/auth/sign-in");
    }
  }, [navigate]);
  
  const [search, setSearch] = useState(""); // คำค้นหา

  const [authors, setAuthors] = useState([]); // เก็บรายชื่อผู้ใช้
  useEffect(() => {
    const getAuthors = async () => {
      const data = await authorsTableData();
      setAuthors(data);
    };
    getAuthors();
  }, []);

  const [teachers, setTeachers] = useState([]); // เก็บรายชื่ออาจารย์
  useEffect(() => {
    const getTeachers = async () => {
      const data = await teachersTableData();
      setTeachers(data);
    };
    getTeachers();
  }, []);

  // Authors Modal State
  const [isAddAuthorOpen, setIsAddAuthorOpen] = useState(false);
  const [isEditAuthorOpen, setIsEditAuthorOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState(null);
  const [newAuthor, setNewAuthor] = useState({
    name: "",
    uid: "",
    job: ["", ""],
    online: false,
    date: "",
  });

  // Teachers Modal State
  
  const [isEditTeacherOpen, setIsEditTeacherOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
 

  // ฟังก์ชันกรองข้อมูล Authors Table
  const filteredAuthors = authors.filter(({ name, uid }) =>
    [name, uid].some((field) =>
      field.toLowerCase().includes(search.toLowerCase())
    )
  );

  // ฟังก์ชันกรองข้อมูล Teachers Table
  const filteredTeachers = teachers.filter(({ name, uid }) =>
    [name, uid].some((field) =>
      field.toLowerCase().includes(search.toLowerCase())
    )
  );

  // ฟังก์ชันเพิ่มผู้ใช้ใหม่
  const handleAddAuthor = () => {
    setAuthors([...authors, newAuthor]);
    setNewAuthor({ name: "", uid: "", job: ["", ""], online: false, date: "" });
    setIsAddAuthorOpen(false);
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
      <SearchSection
        search={search}
        setSearch={setSearch}
        toggleAddModal={() => setIsAddAuthorOpen(true)} // เริ่มต้นที่ Authors
      />

      {/* Section ตาราง Authors */}
      <AuthorsTable
        authors={filteredAuthors}
        onEditClick={(author) => {
          setEditingAuthor(author);
          setIsEditAuthorOpen(true);
        }}
      />

      {/* Section ตาราง Teachers */}
      
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

      

     
    </div>
  );
}

export default Tables;
