import React, { useState } from "react";
import { useParams } from "react-router-dom";
import SearchAndAddStudent from "./functionTables/SearchAndAddStudent";
import StudentTable from "./functionTables/StudentTable";
import StudentModal from "./functionTables/StudentModal";
import { studentTableData } from "@/data/student-table-data";

export function StudentMgn() {
  const { classname } = useParams();
  const [search, setSearch] = useState("");
  const [students, setStudent] = useState(studentTableData);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isEditStudentOpen, setIsEditStudentOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [newStudent, setNewStudent] = useState({
    name: "",
    sec: "",
    semester: "",
    year: "",
  });

  const filteredStudent = students.filter(({ name, id }) =>
    [name, id].some((field) =>
      field.toLowerCase().includes(search.toLowerCase())
    )
  );

  const handleAddStudent = () => {
    setStudent([...students, newStudent]);
    setNewStudent({ name: "", sec: "", semester: "", year: "" });
    setIsAddStudentOpen(false);
  };

  const handleEditAuthor = () => {
    setStudent((prevAuthors) =>
      prevAuthors.map((student) =>
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
      />

      <StudentModal
        isOpen={isEditStudentOpen}
        toggleModal={() => setIsEditStudentOpen(false)}
        studentData={editingStudent}
        setStudentData={setEditingStudent}
        onSave={handleEditAuthor}
      />
    </div>
  );
}

export default StudentMgn;
