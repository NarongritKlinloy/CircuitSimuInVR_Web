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

function authormodal({ isOpen, toggleModal, authorData, setAuthorData, onSave }) {
  const [errors, setErrors] = useState({}); // เก็บสถานะ Error

  if (!authorData) return null;

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
    if (!authorData.name) newErrors.name = "Name is required";
    if (!authorData.email) newErrors.email = "Email is required";
    if (!authorData.password) newErrors.password = "Password is required";
    if (!authorData.role) newErrors.role = "Role is required";

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
      <DialogHeader>{authorData.name ? "Edit User" : "Add New User"}</DialogHeader>
      <DialogBody>
        <div className="flex flex-col gap-4">
          {/* ช่องเพิ่มรูปภาพ */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setAuthorData({ ...authorData, picture: reader.result });
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

          {/* ช่อง Name */}
          <div>
            <Input
              label="Name"
              value={authorData.name || ""}
              onChange={(e) =>
                setAuthorData({ ...authorData, name: e.target.value })
              }
              error={!!errors.name}
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
              value={authorData.email || ""}
              onChange={(e) =>
                setAuthorData({ ...authorData, email: e.target.value })
              }
              error={!!errors.email}
            />
            {errors.email && (
              <Typography variant="small" color="red" className="mt-1">
                {errors.email}
              </Typography>
            )}
          </div>

          {/* ช่อง Password และ Confirm Password */}
          <div className="flex gap-4">
            <div className="w-1/2">
              <Input
                label="Password"
                value={authorData.password || ""}
                onChange={(e) =>
                  setAuthorData({ ...authorData, password: e.target.value })
                }
                error={!!errors.password}
              />
              {errors.password && (
                <Typography variant="small" color="red" className="mt-1">
                  {errors.password}
                </Typography>
              )}
            </div>

            <div className="w-1/2">
              <Input
                label="Confirm Password"
                value={authorData.confirmPassword || ""}
                onChange={(e) =>
                  setAuthorData({ ...authorData, confirmPassword: e.target.value })
                }
                error={!!errors.confirmPassword}
              />
              {errors.confirmPassword && (
                <Typography variant="small" color="red" className="mt-1">
                  {errors.confirmPassword}
                </Typography>
              )}
            </div>
          </div>

          {/* Dropdown Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={authorData.role || ""}
              onChange={(e) =>
                setAuthorData({ ...authorData, role: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>Select Role</option>
              <option value="Student">Student</option>
              <option value="Teacher">Teacher</option>
              <option value="Admin">Admin</option>
            </select>
            {errors.role && (
              <Typography variant="small" color="red" className="mt-1">
                {errors.role}
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
          {authorData.name ? "Save" : "Add"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

export default authormodal;
