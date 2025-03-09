import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import TATable from "./functionTables/TATable";
import TAModal from "./functionTables/TAModal";
import SearchAndAddTA from "./functionTables/SearchAndAddTA";
import { TATableData } from "@/data/TA-table-data";
import { addTAAPI } from "@/data/add-TA";


export function TAManagement() {
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
  const [TAs, setTA] = useState([]);
    const [refresh, setRefresh] = useState(false);


  const getTA = async () => {
    const data = await TATableData(sessionStorage.getItem("class_id"));
    setTA(data);
  };

  // toggle refresh status
  const handleRefresh = () => {
    setRefresh(prev => !prev);
  };

  // auto refresh page after data change
  useEffect(() => {
    getTA();
  }, [refresh]);

  // Modal State
  const [isAddTAOpen, setIsAddTAOpen] = useState(false);
  const [isEditTAOpen, setIsEditTAOpen] = useState(false);
  const [editingTA, setEditingTA] = useState(null);
  const [newTA, setNewTA] = useState({
    uid: "",
    class_id: sessionStorage.getItem("class_id"),
  });

  // seach 
  const filteredTA = TAs.filter(({ uid}) =>
    [uid].some((field) =>
      String(field).toLowerCase().includes(search.toLowerCase())
    )
  );

  // add
  const handleAddTA = async() => {
    // console.log(newTA);
    await addTAAPI(newTA);
    // setTA([...TAs, newTA]);
    setNewTA({ uid: "", class_id: sessionStorage.getItem("class_id")});
    setIsAddTAOpen(false);
    handleRefresh();
  };


  const handleEditTA = () => {
    setTA((prevTA) =>
      prevTA.map((TA) =>
        TA.name === editingTA.TA ? editingTA : TA
      )
    );
    setIsEditTAOpen(false);
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      
      <SearchAndAddTA
        search={search}
        setSearch={setSearch}
        toggleAddModal={() => setIsAddTAOpen(true)}
      />

      <TATable
        TAs={filteredTA}
        checkStatus={handleRefresh} // send fn to refresh page
      />
      
      <TAModal
        isOpen={isAddTAOpen}
        toggleModal={() => setIsAddTAOpen(false)}
        TAData={newTA}
        setTAData={setNewTA}
        onSave={handleAddTA}
        btnStatus={"Add"}
      />

      <TAModal
        isOpen={isEditTAOpen}
        toggleModal={() => setIsEditTAOpen(false)}
        TAData={editingTA}
        setTAData={setEditingTA}
        onSave={handleEditTA}
        btnStatus={"Edit"}
      />
    </div>
  );
}

export default TAManagement;
