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


function ClassroomPracticeModal({ isOpen, toggleModal, classroomData, setClassroomData, onSave , btnStatus}) {
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
    if (!classroomData.class_name) newErrors.class_name = "name is required";
    setErrors(newErrors);
    const result = Object.keys(newErrors).length === 0 ? true : false
    return result;
  };

  // ฟังก์ชันบันทึกข้อมูล
  const handleSave = () => {
    const result = validateFields();
    if (result) {
      onSave();
      resetState(); // รีเซ็ต Error เมื่อบันทึกสำเร็จ
    }
  };
  
  return (
  <>
    <Dialog open={isOpen} handler={handleClose}>
      <DialogHeader>{btnStatus} Classroom Practice</DialogHeader>
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
            {errors.class_name && (
              <Typography variant="small" color="red" className="mt-1">
                {errors.class_name}
              </Typography>
            )}
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

export default ClassroomPracticeModal;
