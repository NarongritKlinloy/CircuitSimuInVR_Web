import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import SearchAndAddStudent from "./functionTables/SearchAndAddStudent";
import StudentTable from "./functionTables/StudentTable";
import StudentModal from "./functionTables/StudentModal";
import { studentTableData } from "@/data/student-table-data";

export function StudentMgn() {
  const { classname } = useParams();
  const [search, setSearch] = useState("");
  const [students, setStudent] = useState(studentTableData);

  useEffect(() => {
    const getStudent = async () => {
      const data = await studentTableData();
      setStudent(data);
    };
    getStudent();
  }, [students]);

  // Modal State
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isEditStudentOpen, setIsEditStudentOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [newStudent, setNewStudent] = useState({
    name: "",
    sec: "",
    semester: "",
    year: "",
  });

  // seach 
  const filteredStudent = students.filter(({ name, id }) =>
    [name, id].some((field) =>
      field.toLowerCase().includes(search.toLowerCase())
    )
  );

  // add
  const handleAddStudent = () => {
    setStudent([...students, newStudent]);
    setNewStudent({ name: "", sec: "", semester: "", year: "" });
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
