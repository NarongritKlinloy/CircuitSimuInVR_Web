import React, { useState, useEffect } from "react";
import SearchAndAddsection from "./functionTables/searchandaddsection";
import ExamTable from "./functionTables/ExamTable";
import ExamModal from "./functionTables/ExamModal";
import { practiceTableData } from "@/data/practice-table-data";
import { addPracticeAPI } from "@/data/add-practice";
import { useNavigate } from "react-router-dom";


export function ExamManagement() {
  const navigate = useNavigate();
  
  useEffect(() => {
    try {
      const role = sessionStorage.getItem("role");
      if (role === "admin") {
        navigate("/dashboard/exam");
      }else if(role === null){
        navigate("/auth/sign-in");
      }
    } catch (error) {
      console.error("Error accessing sessionStorage:", error);
      navigate("/auth/sign-in");
    }
  }, [navigate]);
  
  const [search, setSearch] = useState(""); // คำค้นหา
  const [practice, setPractice] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const getPractice = async () => {
    const data = await practiceTableData();
    setPractice(data);
  };

  // toggle refresh status
  const handleRefresh = () => {
    setRefresh(prev => !prev);
  };

  // auto refresh page after data change
  useEffect(() => {
    getPractice();
  }, [refresh]);

  // Modal State
    const [isAddPracticeOpen, setIsAddPracticeOpen] = useState(false);
    const [newPractice, setNewPractice] = useState({
      practice_name: "",
      practice_detail: "",
      practice_score: "",
    });

  const [isEditPracticeOpen, setIsEditPracticeOpen] = useState(false);
  const [editingPractice, setEditingPractice] = useState(null);
    
    // ฟังก์ชันกรองข้อมูล Practice Table
  const filteredPractice = practice.filter(({ practice_name, practice_detail}) =>
    [practice_name, practice_detail].some((field) =>
      String(field).toLowerCase().includes(search.toLowerCase())
    ) 
  );
  
  // ฟังก์ชันเพิ่ม
  const handleAddPractice = async() => {
    // setPractice([...practice, newPractice]);
    addPracticeAPI(newPractice);
    setNewPractice({ practice_name: "",
      practice_detail: "",
      practice_score: "" });
    setIsAddPracticeOpen(false);
    handleRefresh();
  };

  // ฟังก์ชันแก้ไข
  const handleEditClassroom = () => {
    setPractice((prev) =>
      prev.map((practice) =>
        practice.name === editingPractice.name ? editingPractice : practice
      )
    );
    setIsEditPracticeOpen(false);
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      {/* Section การค้นหา */}
      <SearchAndAddsection
        search={search}
        setSearch={setSearch}
        toggleAddModal={() => setIsAddPracticeOpen(true)}
      />

      <ExamTable
        practice={filteredPractice}
        onEditClick={(practice) => {
          setEditingPractice(practice);
          setIsEditPracticeOpen(true);
        }}
        checkStatus={handleRefresh}
      />

      {/* Modal add practice */}
      <ExamModal
        isOpen={isAddPracticeOpen}
        toggleModal={() => setIsAddPracticeOpen(false)}
        practiceData={newPractice}
        setPracticeData={setNewPractice}
        onSave={handleAddPractice}
        btnStatus={"Add"}
      />

      {/* Modal edit practice */}
      <ExamModal
        isOpen={isEditPracticeOpen}
        toggleModal={() => setIsEditPracticeOpen(false)}
        practiceData={editingPractice}
        setPracticeData={setEditingPractice}
        onSave={handleEditClassroom}
        btnStatus={"Edit"}
      />

    </div>
  );
}

export default ExamManagement;