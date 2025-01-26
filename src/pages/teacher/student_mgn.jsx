import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import SearchAndAddStudent from "./functionTables/SearchAndAddStudent";
import StudentTable from "./functionTables/StudentTable";
import StudentModal from "./functionTables/StudentModal";
import { studentTableData } from "@/data/student-table-data";
import { addStudentAPI } from "@/data/add-student-classroom";

export function StudentMgn() {
  const [search, setSearch] = useState("");
  const [students, setStudent] = useState([]);
  useEffect(() => {
    const getStudent = async () => {
      const data = await studentTableData(sessionStorage.getItem("class_id"));
      setStudent(data);
    };
    getStudent();
  }, [students]);

  // Modal State
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isEditStudentOpen, setIsEditStudentOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [newStudent, setNewStudent] = useState({
    uid: "",
    class_id: sessionStorage.getItem("class_id"),
  });

  // seach 
  const filteredStudent = students.filter(({ uid , class_id}) =>
    [uid, class_id ].some((field) =>
      field.toLowerCase().includes(search.toLowerCase())
    )
  );

  // add
  const handleAddStudent = () => {
    //console.log(newStudent);
    addStudentAPI(newStudent);
    setStudent([...students, newStudent]);
    setNewStudent({ uid: "", class_id: sessionStorage.getItem("class_id")});
    setIsAddStudentOpen(false);
  };


  const handleEditStudent = () => {
    setStudent((prevStudent) =>
      prevStudent.map((student) =>
        student.name === editingStudent.name ? editingStudent : student
      )
    );
    setIsEditStudentOpen(false);
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      
      <SearchAndAddStudent
        search={search}
        setSearch={setSearch}
        toggleAddModal={() => setIsAddStudentOpen(true)}
      />

      <StudentTable
        students={filteredStudent}
        onEditClick={(student) => {
          setEditingStudent(student);
          setIsEditStudentOpen(true);
        }}
      />
      
      <StudentModal
        isOpen={isAddStudentOpen}
        toggleModal={() => setIsAddStudentOpen(false)}
        studentData={newStudent}
        setStudentData={setNewStudent}
        onSave={handleAddStudent}
        btnStatus={"Add"}
      />

      <StudentModal
        isOpen={isEditStudentOpen}
        toggleModal={() => setIsEditStudentOpen(false)}
        studentData={editingStudent}
        setStudentData={setEditingStudent}
        onSave={handleEditStudent}
        btnStatus={"Edit"}
      />
    </div>
  );
}

export default StudentMgn;
