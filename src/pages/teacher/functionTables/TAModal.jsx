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
import { TATableData } from "@/data/TA-table-data";
 
function TAModal({ isOpen, toggleModal, TAData, setTAData, btnStatus, onSave }) {
  const [errors, setErrors] = useState({});

  // declare user id
  const userId = TATableData.length + 1;
  
  useEffect(() => {
    setTAData({ ...TAData, id: userId  })
  }, [])

  if (!TAData) return null;

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

    if (!TAData.uid) newErrors.uid = "Email is required";
    
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
      <DialogHeader>{btnStatus} TA</DialogHeader>
      <DialogBody>
        <div className="flex flex-col gap-4">
          <div>
            <Input
              label="Email"
              name="TAemail"
              value={TAData.uid || ""}
              onChange={(e) =>
                setTAData({ ...TAData, uid: e.target.value })
              }
              error={!!errors.uid}
            />
            {errors.uid && (
              <Typography variant="small" color="red" className="mt-1">
                {errors.uid}
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
  );
}

export default TAModal;
