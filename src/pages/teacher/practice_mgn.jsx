import React, { useState } from "react";
import SearchAndAddSection from "./functionTables/searchandaddsection";
import PracticeTable from "./functionTables/PracticeTable";
import PracticeModal from "./functionTables/PracticeModal";
import { practiceTableData } from "@/data/practice-table-data";

export function PracticeMgn() {
  const [search, setSearch] = useState(""); // คำค้นหา
  const [practice, setPractice] = useState(practiceTableData);

  // Practice Modal State
  const [isAddPracticeOpen, setIsAddPracticeOpen] = useState(false);
  const [isEditPracticeOpen, setIsEditPracticeOpen] = useState(false);
  const [editingPractice, setEditingPractice] = useState(null);
  const [newPractice, setNewPractice] = useState({
    name: "",
    detail: "",
    status: true,
    date: "",
  });


  // ฟังก์ชันกรองข้อมูล Practice Table
  const filteredPractice = practice.filter(({ name, detail}) =>
    [name, detail].some((field) =>
      field.toLowerCase().includes(search.toLowerCase())
    )
  );

  // ฟังก์ชันเพิ่มผู้ใช้ใหม่
  const handleAddPractice = () => {
    setPractice([...practice, newPractice]);
    setNewPractice({ name: "", detail: "", status: true, date: "" });
    setIsAddPracticeOpen(false);
  };


  // ฟังก์ชันแก้ไขข้อมูลผู้ใช้
  const handleEditPractice = () => {
    setPractice((prevPractice) =>
      prevPractice.map((practice) =>
        practice.name === editingPractice.name ? editingPractice : practice
      )
    );
    setIsEditPracticeOpen(false);
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      {/* Section การค้นหา */}
      <SearchAndAddSection
        search={search}
        setSearch={setSearch}
        toggleAddModal={() => setIsAddPracticeOpen(true)}
      />

      
      <h2 className="text-xl font-bold mb-4">Practice Table</h2>
      <PracticeTable
        practice={filteredPractice}
        onEditClick={(practice) => {
          setEditingPractice(practice);
          setIsEditPracticeOpen(true);
        }}
      />


      {/* Modal สำหรับเพิ่มข้อมูลผู้ใช้ */}
      <PracticeModal
        isOpen={isAddPracticeOpen}
        toggleModal={() => setIsAddPracticeOpen(false)}
        practiceData={newPractice}
        setPracticeData={setNewPractice}
        onSave={handleAddPractice}
      />

      {/* Modal สำหรับแก้ไขข้อมูลผู้ใช้ */}
      <PracticeModal
        isOpen={isEditPracticeOpen}
        toggleModal={() => setIsEditPracticeOpen(false)}
        practiceData={editingPractice}
        setPracticeData={setEditingPractice}
        onSave={handleEditPractice}
      />

    </div>
  );
}

export default PracticeMgn;
