import React, { useState, useEffect } from "react";
import SearchSection from "./functionTables/SearchSection";
import PracticeTable from "./functionTables/PracticeTable";
import { practiceTableData } from "@/data/practice-table-data";
import { useNavigate } from "react-router-dom";


export function PracticeMgn() {
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

  // ฟังก์ชันกรองข้อมูล Practice Table
  const filteredPractice = practice.filter(({ practice_name, practice_detail}) =>
    [practice_name, practice_detail].some((field) =>
      field.toLowerCase().includes(search.toLowerCase())
      // console.log(field)
    ) 
  );

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      {/* Section การค้นหา */}
      <SearchSection
        search={search}
        setSearch={setSearch}
        toggleAddModal={() => setIsAddPracticeOpen(true)}
      />

      <PracticeTable
        practice={filteredPractice}
        onEditClick={(practice) => {
          setEditingPractice(practice);
          setIsEditPracticeOpen(true);
        }}
        checkStatus={handleRefresh}
      />

    </div>
  );
}

export default PracticeMgn;