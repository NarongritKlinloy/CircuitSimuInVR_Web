import React, { useState, useEffect } from "react";
import SearchSection from "./functionTables/SearchSection";
import ClassroomPracticeTable from "./functionTables/ClassroomPracticeTable";
import { useNavigate } from "react-router-dom";
import { ClassroomPractice } from "@/data/classroom-practice";


export function PracticeClassroom() {
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

  const [search, setSearch] = useState("");
  const [practices, setPractice] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const getPractice = async () => {
    const data = await ClassroomPractice(sessionStorage.getItem("class_id"));
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

  // search 
  const filteredPractice = practices.filter(({ practice_name , practice_detail }) =>
    [ practice_name , practice_detail ].some((field) =>
      String(field).toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      
      <SearchSection
        search={search}
        setSearch={setSearch}
        toggleAddModal={() => setIsAddStudentOpen(true)}
      />

      <ClassroomPracticeTable
        practices={filteredPractice}
        checkStatus={handleRefresh}
      />

    </div>
  );
}

export default PracticeClassroom;
