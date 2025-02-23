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

function ExamModal({ isOpen, toggleModal, practiceData, setPracticeData, onSave , btnStatus}) {
  const [errors, setErrors] = useState({}); // เก็บสถานะ Error

  if (!practiceData) return null;

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
    if (!practiceData.practice_name) newErrors.practice_name = "name is required";
    if (!practiceData.practice_detail) newErrors.practice_detail = "detail is required";
    if (!practiceData.practice_score) newErrors.practice_score = "score is required";
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
      <DialogHeader>{btnStatus} Classroom</DialogHeader>
      <DialogBody>
        <div className="flex flex-col gap-4">
          <div>
            <Input
              label="Name"
              value={practiceData.practice_name || ""}
              onChange={(e) =>
                setPracticeData({ ...practiceData, practice_name: e.target.value })
              }
              error={!!errors.practice_name}
            />
            {errors.classname && (
              <Typography variant="small" color="red" className="mt-1">
                {errors.practice_name}
              </Typography>
            )}
          </div>
        
          <div className="flex gap-4">
            <div className="w-1/2">
              <Input
                label="detail"
                value={practiceData.practice_detail || ""}
                onChange={(e) =>
                  setPracticeData({ ...practiceData, practice_detail: e.target.value })
                }
                error={!!errors.practice_detail}
              />
              {errors.practice_detail && (
                <Typography variant="small" color="red" className="mt-1">
                  {errors.practice_detail}
                </Typography>
              )}
            </div>

            <div className="w-1/2">
            <Input
              label="score"
              value={practiceData.practice_score || ""}
              maxLength={2}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setPracticeData({ ...practiceData, practice_score: value });
              }}
              error={!!errors.practice_score}
            />
            {errors.practice_score && (
              <Typography variant="small" color="red" className="mt-1">
                {errors.practice_score}
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

export default ExamModal;
