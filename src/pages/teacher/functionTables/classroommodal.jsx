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

function ClassroomModal({ isOpen, toggleModal, classroomData, setClassroomData, onSave , btnStatus }) {
  const [errors, setErrors] = useState({}); // เก็บสถานะ Error

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

    if (!classroomData.class_name) newErrors.classname = "Classname is required";
    if (!classroomData.sec) newErrors.sec = "Sec is required";
    if (!classroomData.semester) newErrors.semester = "Semester is required";
    if (!classroomData.year) newErrors.year = "Year is required";

    setErrors(newErrors);
    const result = Object.keys(newErrors).length === 0 ? true : false
    return result;
  };

  // ฟังก์ชันบันทึกข้อมูล
  const handleSave = () => {
    const result = validateFields();
    if (validateFields()) {
      onSave();
      resetState(); // รีเซ็ต Error เมื่อบันทึกสำเร็จ
    }
  };

  return (
  <>
    <Dialog open={isOpen} handler={handleClose}>
      <DialogHeader>{btnStatus} Classroom</DialogHeader>
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
            <div className="w-1/3">
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

            <div className="w-1/3">
              <Input
                label="semester"
                value={classroomData.semester || ""}
                onChange={(e) =>
                  setClassroomData({ ...classroomData, semester: e.target.value })
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
          {btnStatus}
        </Button>
      </DialogFooter>
    </Dialog>
  </>
  );
}

export default ClassroomModal;
