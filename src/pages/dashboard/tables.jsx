import React, { useState } from "react";
import SearchAndAddSection from "./functionTables/searchandaddsection";
import AuthorsTable from "./functionTables/authorstable";
import AuthorModal from "./functionTables/authormodal";
import { authorsTableData } from "@/data";

export function Tables() {
  const [search, setSearch] = useState(""); // คำค้นหา
  const [authors, setAuthors] = useState(authorsTableData); // เก็บรายชื่อผู้ใช้
  const [isAddOpen, setIsAddOpen] = useState(false); // สถานะ modal สำหรับเพิ่มข้อมูล
  const [isEditOpen, setIsEditOpen] = useState(false); // สถานะ modal สำหรับแก้ไขข้อมูล
  const [editingAuthor, setEditingAuthor] = useState(null); // ผู้ใช้ที่กำลังแก้ไข
  const [newAuthor, setNewAuthor] = useState({
    name: "",
    email: "",
    job: ["", ""],
    online: false,
    date: "",
  }); // รายละเอียดผู้ใช้ใหม่

  // ฟังก์ชันกรองข้อมูล Authors Table
  const filteredAuthors = authors.filter(({ name, email }) =>
    [name, email].some((field) =>
      field.toLowerCase().includes(search.toLowerCase())
    )
  );

  // ฟังก์ชันเพิ่มผู้ใช้ใหม่
  const handleAddAuthor = () => {
    setAuthors([...authors, newAuthor]);
    setNewAuthor({ name: "", email: "", job: ["", ""], online: false, date: "" });
    setIsAddOpen(false);
  };

  // ฟังก์ชันแก้ไขข้อมูล
  const handleEditAuthor = () => {
    setAuthors((prevAuthors) =>
      prevAuthors.map((author) =>
        author.name === editingAuthor.name ? editingAuthor : author
      )
    );
    setIsEditOpen(false);
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      {/* Section การค้นหาและปุ่ม Add */}
      <SearchAndAddSection
        search={search}
        setSearch={setSearch}
        toggleAddModal={() => setIsAddOpen(true)}
      />

      {/* Section ตารางข้อมูล */}
      <AuthorsTable
        authors={filteredAuthors}
        onEditClick={(author) => {
          setEditingAuthor(author);
          setIsEditOpen(true);
        }}
      />

      {/* Modal สำหรับเพิ่มข้อมูล */}
      <AuthorModal
        isOpen={isAddOpen}
        toggleModal={() => setIsAddOpen(false)}
        authorData={newAuthor}
        setAuthorData={setNewAuthor}
        onSave={handleAddAuthor}
      />

      {/* Modal สำหรับแก้ไขข้อมูล */}
      <AuthorModal
        isOpen={isEditOpen}
        toggleModal={() => setIsEditOpen(false)}
        authorData={editingAuthor}
        setAuthorData={setEditingAuthor}
        onSave={handleEditAuthor}
      />
    </div>
  );
}

export default Tables;
