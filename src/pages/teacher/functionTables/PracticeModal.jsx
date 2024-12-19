import React, { useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";

function PracticeModal({ isOpen, toggleModal, practiceData, setPracticeData, onSave }) {
  const [errors, setErrors] = useState({}); // เก็บสถานะ Error

  if (!practiceData) return null;

  // ฟังก์ชันจัดการไฟล์รูปที่อัพโหลด
  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPracticeData({ ...practiceData, picture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // ฟังก์ชันสำหรับ Validate ข้อมูลก่อนบันทึก
  const validateFields = () => {
    const newErrors = {};
    if (!practiceData.name) newErrors.name = "Name is required";
    if (!practiceData.email) newErrors.email = "Email is required";
    if (!practiceData.password) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // คืนค่า true ถ้าไม่มี Error
  };

  // ฟังก์ชันจัดการ Save พร้อม Validate
  const handleSave = () => {
    if (validateFields()) {
      onSave(); // เรียกฟังก์ชัน onSave ถ้ากรอกข้อมูลครบ
    }
  };

  return (
    <Dialog open={isOpen} handler={toggleModal}>
      <DialogHeader>{practiceData.name ? "Edit Author" : "Add New Author"}</DialogHeader>
      <DialogBody>
        <div className="flex flex-col gap-4">
          {/* ช่องเพิ่มรูปภาพ */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePictureChange}
              className="mt-1 block w-full text-sm text-gray-500
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-lg file:border-0
                         file:text-sm file:font-semibold
                         file:bg-blue-50 file:text-blue-700
                         hover:file:bg-blue-100"
            />
            {practiceData.picture && (
              <img
                src={practiceData.picture}
                alt="Uploaded Preview"
                className="mt-2 h-20 w-20 rounded-lg object-cover"
              />
            )}
          </div>

          {/* ช่อง Name */}
          <div>
            <Input
              label="Name"
              value={practiceData.name || ""}
              onChange={(e) =>
                setPracticeData({ ...practiceData, name: e.target.value })
              }
              error={!!errors.name} // แสดง Error ใน Input
            />
            {errors.name && (
              <Typography variant="small" color="red" className="mt-1">
                {errors.name}
              </Typography>
            )}
          </div>

          {/* ช่อง Email */}
          <div>
            <Input
              label="Email"
              value={practiceData.email || ""}
              onChange={(e) =>
                setPracticeData({ ...practiceData, email: e.target.value })
              }
              error={!!errors.email}
            />
            {errors.email && (
              <Typography variant="small" color="red" className="mt-1">
                {errors.email}
              </Typography>
            )}
          </div>

          {/* ช่อง Password */}
          <div>
            <Input
              label="Password"
              value={practiceData.password || ""}
              onChange={(e) =>
                setPracticeData({ ...practiceData, password: e.target.value })
              }
              error={!!errors.password}
              
            />
            {errors.password && (
              <Typography variant="small" color="red" className="mt-1">
                {errors.password}
              </Typography>
            )}
          </div>
        </div>
      </DialogBody>
      <DialogFooter>
        <Button variant="text" color="red" onClick={toggleModal}>
          Cancel
        </Button>
        <Button variant="gradient" color="green" onClick={handleSave}>
          {practiceData.name ? "Save" : "Add"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

export default PracticeModal;
