import React, { useState, useEffect } from "react";
import {
  Select, Option,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import { studentTableData } from "@/data/student-table-data";
 
function StudentModal({ isOpen, toggleModal, studentData, setStudentData, btnStatus }) {
  const [errors, setErrors] = useState({}); // เก็บสถานะ Error

  // declare user id
  const userId = studentTableData.length + 1;
  
  useEffect(() => {
    setStudentData({ ...studentData, id: userId  })
  }, [])

  if (!studentData) return null;

  // ฟังก์ชันรีเซ็ต Error และข้อมูล
  const resetState = () => {
    setErrors({}); // รีเซ็ต Error ให้เป็นค่าว่าง
  };

  // ฟังก์ชันจัดการปิด Modal พร้อมรีเซ็ต
  const handleClose = () => {
    resetState(); // รีเซ็ตสถานะ Error
    toggleModal(); // ปิด Modal
  };

  
  // ฟังก์ชัน Validate ข้อมูลก่อนบันทึก
  const validateFields = () => {
    const newErrors = {};

    if (!studentData.name) newErrors.name = "Name is required";
    if (!studentData.sec) newErrors.sec = "Sec is required";
    if (!studentData.semester) newErrors.semester = "Semester is required";
    if (!studentData.year) newErrors.year = "Year is required";
    
    setErrors(newErrors);
    
    return Object.keys(newErrors).length === 0; // คืนค่า true ถ้าไม่มี Error
  };

  // ฟังก์ชันบันทึกข้อมูล
  const handleSave = () => {
    if (validateFields()) {
      onSave();
      resetState(); // รีเซ็ต Error เมื่อบันทึกสำเร็จ
    }
  };


  return (
    <Dialog open={isOpen} handler={handleClose}>
      <DialogHeader>{btnStatus} Student</DialogHeader>
      <DialogBody>
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Add File</label>
            <input
              type="file"
              accept="csv/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setStudentData({ ...studentData, picture: reader.result });
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="mt-1 block w-full text-sm text-gray-500
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-lg file:border-0
                         file:text-sm file:font-semibold
                         file:bg-blue-50 file:text-blue-700
                         hover:file:bg-blue-100"
            />
          </div>
          <div>
            <Input
              label="Student ID"
              value={studentData.name || ""}
              onChange={(e) =>
                setStudentData({ ...studentData, name: e.target.value })
              }
              error={!!errors.name}
            />
            {errors.name && (
              <Typography variant="small" color="red" className="mt-1">
                {errors.name}
              </Typography>
            )}
          </div>

          {/* <div className="flex gap-4">
            <div className="w-1/3">
              <Select
                label="Select Sec"
                value={studentData.sec}
                onChange={(e) => setStudentData({ ...studentData, sec: e })}
              >
                <Option value="101">101</Option>
                <Option value="102">102</Option>
                <Option value="103">103</Option>
              </Select>

              {errors.sec && (
                <Typography variant="small" color="red" className="mt-1">
                  {errors.sec}
                </Typography>
              )}
            </div>
            <div className="w-1/3">
              <Input
                label="semester"
                value={studentData.semester || ""}
                onChange={(e) =>
                  setStudentData({ ...studentData, semester: e.target.value })
                }
                error={!!errors.semester}
              />
              {errors.semester && (
                <Typography variant="small" color="red" className="mt-1">
                  {errors.semester}
                </Typography>
              )}
            </div>

            <div className="w-1/3">
              <Input
                label="year"
                value={studentData.year || ""}
                onChange={(e) =>
                  setStudentData({ ...studentData, year: e.target.value })
                }

                error={!!errors.year}
              />
              {errors.year && (
                <Typography variant="small" color="red" className="mt-1">
                  {errors.year}
                </Typography>
              )}
            </div>
          </div> */}
        </div>
      </DialogBody>
      <DialogFooter>
        <Button variant="text" color="red" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="gradient" color="green" onClick={handleSave}>
          {btnStatus}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

export default StudentModal;
