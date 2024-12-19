import React, { useState } from "react";
import SearchAndAddSection from "./functionTables/searchandaddsection";
import PracticeTable from "./functionTables/PracticeTable";
import PracticeModal from "./functionTables/PracticeModal";
import { practiceTableData } from "@/data/practice-table-data";

export function PracticeMgn() {
  const [search, setSearch] = useState(""); // คำค้นหา
  const [practice, setPractice] = useState(practiceTableData);

  // ฟังก์ชันกรองข้อมูล Practice Table
  const filteredPractice = practice.filter(({ name, detail}) =>
    [name, detail].some((field) =>
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

      <h2 className="text-xl font-bold mb-4">Practice Table</h2>
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
