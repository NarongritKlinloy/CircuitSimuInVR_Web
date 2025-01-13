import React, { useState, useEffect } from "react";
import SearchAndAddSection from "./functionTables/searchpractice";
import PracticeTable from "./functionTables/PracticeTable";
import { practiceTableData } from "@/data/practice-table-data";

export function PracticeMgn() {
  const [search, setSearch] = useState(""); // คำค้นหา
  const [practice, setPractice] = useState([]);
  useEffect(() => {
    const getPractice = async () => {
      const data = await practiceTableData();
      //console.log("data: ", data);
      setPractice(data);
    };
    getPractice();
  }, []);

  // ฟังก์ชันกรองข้อมูล Practice Table
  const filteredPractice = practice.filter(({ practice_name, practice_detail}) =>
    [practice_name, practice_detail].some((field) =>
      field.toLowerCase().includes(search.toLowerCase())
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