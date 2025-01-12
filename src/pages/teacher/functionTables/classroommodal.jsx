import React, { useState , useEffect } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import { classroomTableData } from "@/data/classroom-table-data";
import addClassroom from "@/data/add-classroom";

function ClassroomModal({ isOpen, toggleModal, classroomData, setClassroomData, onSave }) {
  const [errors, setErrors] = useState({}); // เก็บสถานะ Error

  // declare user id
  const userId = classroomTableData.length + 1;
  useEffect(() => {
    setClassroomData({ id: userId });
  },[])

  if (!classroomData) return null;

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
    if (!classroomData.class_name) newErrors.class_name = "Name is required";
    if (!classroomData.sec) newErrors.sec = "Email is required";
    if (!classroomData.year) newErrors.year = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // คืนค่า true ถ้าไม่มี Error
  };

  // ฟังก์ชันบันทึกข้อมูล
  const handleSave = () => {
    if (validateFields()) {
      addClassroom(classroomData.class_name, classroomData.sec, 1, classroomData.year);
      onSave();
      resetState(); // รีเซ็ต Error เมื่อบันทึกสำเร็จ
    }
  };

  return (
    <Dialog open={isOpen} handler={handleClose}>
      <DialogHeader>{classroomData.class_name ? "Edit Classroom" : "Add New Classroom"}</DialogHeader>
      <DialogBody>
        <div className="flex flex-col gap-4">
          <div>
            <Input
              label="Name"
              value={classroomData.class_name || ""}
              onChange={(e) =>
                setClassroomData({ ...classroomData, class_name: e.target.value })
              }
              error={!!errors.class_name}
            />
            {errors.classname && (
              <Typography variant="small" color="red" className="mt-1">
                {errors.class_name}
              </Typography>
            )}
          </div>
        
          <div className="flex gap-4">
            <div className="w-1/2">
              <Input
                label="sec"
                value={classroomData.sec || ""}
                onChange={(e) =>
                  setClassroomData({ ...classroomData, sec: e.target.value })
                }
                error={!!errors.sec}
              />
              {errors.sec && (
                <Typography variant="small" color="red" className="mt-1">
                  {errors.sec}
                </Typography>
              )}
            </div>

            <div className="w-1/2">
              <Input
                label="year"
                value={classroomData.year || ""}
                onChange={(e) =>
                  setClassroomData({ ...classroomData, year: e.target.value })
                }
                error={!!errors.year}
              />
              {errors.year && (
                <Typography variant="small" color="red" className="mt-1">
                  {errors.year}
                </Typography>
              )}
            </div>
          </div>
        </div>
      </DialogBody>
      <DialogFooter>
        <Button variant="text" color="red" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="gradient" color="green" onClick={handleSave}>
          {classroomData.class_name ? "Save" : "Add"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

export default ClassroomModal;
