import React, { useState, useEffect } from "react";
import SearchAndAddSection from "./functionTables/searchpractice";
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
  useEffect(() => {
    const getPractice = async () => {
      const data = await practiceTableData();
      setPractice(data);
    };
    getPractice();
  }, [practice]);

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
      <SearchAndAddSection
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
      />

    </div>
  );
}

export default PracticeMgn;