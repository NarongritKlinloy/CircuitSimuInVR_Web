import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SearchSection from "./functionTables/SearchSection";
import ClassroomPracticeScore from "./functionTables/ClassroomPracticeScore";
import { ClassroomScore } from "@/data/classroom-practice-score";



export function PracticeScore() {
  const navigate = useNavigate();
  const {class_id, practice_id} = useParams();

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
    const data = await ClassroomScore(class_id, practice_id);
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
  const filteredPractice = practices.filter(({ uid , name }) =>
    [ uid , name ].some((field) =>
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

      <ClassroomPracticeScore
        practices={filteredPractice}
        checkStatus={handleRefresh}
      />

    </div>
  );
}

export default PracticeScore;
