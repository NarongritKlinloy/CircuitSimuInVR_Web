import React, { useState, useEffect } from "react";
import readXlsxFile from 'read-excel-file';
import Papa from 'papaparse';
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
 
function StudentModal({ isOpen, toggleModal, studentData, setStudentData, btnStatus, onSave }) {
  const [errors, setErrors] = useState({}); // เก็บสถานะ Error
  const [fileUploaded, setFileUploaded] = useState(false);
  const [excelData, setExcelData] = useState([]);
  const [showExample, setShowExample] = useState(false); // สร้าง State ควบคุม Modal รูปภาพ

  // declare user id
  const userId = studentTableData.length + 1;
  
  useEffect(() => {
    setStudentData({ ...studentData, id: userId  })
  }, [])

  if (!studentData) return null;

  // ฟังก์ชันรีเซ็ต Error และข้อมูล
  const resetState = () => {
    setErrors({}); // รีเซ็ต Error ให้เป็นค่าว่าง
    setFileUploaded(false);
    setShowExample(false);
    setExcelData([]);
  };

  // ฟังก์ชันจัดการปิด Modal พร้อมรีเซ็ต
  const handleClose = () => {
    resetState(); // รีเซ็ตสถานะ Error
    toggleModal(); // ปิด Modal
  };

  
  // ฟังก์ชัน Validate ข้อมูลก่อนบันทึก
  const validateFields = () => {
    const newErrors = {};

    if (!studentData.uid && !fileUploaded) newErrors.uid = "ID Student is required";
    
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        // ไฟล์ Excel
        readXlsxFile(file).then((rows) => {
          // เริ่มอ่านข้อมูลจากแถวแรกสุด
          const dataRows = rows;
  
          // กรองข้อมูลและแปลงเป็น formattedData
          const formattedData = dataRows
            .filter((item) => {
              // ตรวจสอบว่ามีข้อมูลในคอลัมน์ที่ 1 และ 2 และคอลัมน์ที่ 1 เป็นตัวเลข 8 หลัก
              return item[1] && item[2] && /^\d{8}$/.test(String(item[1]));
            })
            .map((item) => ({
              id: item[1],
              name: item[2],
            }));
  
          setExcelData(formattedData);
          setFileUploaded(true);
        });
      } else if (file.type === 'text/csv') {
        // ไฟล์ CSV
        Papa.parse(file, {
          header: false,
          delimiter: ',',
          complete: (results) => {
            const rows = results.data;
            // เริ่มอ่านข้อมูลจากแถวแรกสุด
            const dataRows = rows;
  
            // กรองข้อมูลและแปลงเป็น formattedData
            const formattedData = dataRows
              .filter((item) => {
                // ตรวจสอบว่ามีข้อมูลในคอลัมน์ที่ 1 และ 2 และคอลัมน์ที่ 1 เป็นตัวเลข 8 หลัก
                return item[1] && item[2] && /^\d{8}$/.test(String(item[1]));
              })
              .map((item) => ({
                id: item[1],
                name: item[2],
              }));
  
            setExcelData(formattedData);
            setFileUploaded(true);
          },
          error: (error) => {
            console.error('Error parsing CSV:', error);
            // แสดงข้อความแจ้งเตือนผู้ใช้
          },
        });
      } else {
        console.error('Error: Invalid file type.');
        // แสดงข้อความแจ้งเตือนผู้ใช้
      }
    }
  };

  return (
    <>
    <Dialog open={isOpen} handler={handleClose}>
      <DialogHeader>{btnStatus} Student</DialogHeader>
      <DialogBody>
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Add File</label>
            <input
              type="file"
              accept=".csv, .xlsx"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-500
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-lg file:border-0
                         file:text-sm file:font-semibold
                         file:bg-blue-50 file:text-blue-700
                         hover:file:bg-blue-100"
            />
          </div>
          {/* แสดงข้อมูลจาก Excel */}
          {fileUploaded && excelData.length > 0 && (
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              <Typography variant="h6">Student Data from Excel ({excelData.length} records) :</Typography>
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr>
                    {["รหัส น.ศ.", "ชื่อ-นามสกุล"].map((header) => (
                      <th
                        key={header}
                        className={`border-b border-blue-gray-50 px-5 py-2 ${header === "name" ? "text-left" : "text-center"}`}
                      >
                        <Typography
                          variant="small"
                          className="font-bold uppercase text-blue-gray-400"
                        >
                        {header}
                      </Typography>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {excelData.map((item, index) => (
                    <tr key={index}>
                      <td className={`py-3 px-5 align-middle border-b border-blue-gray-50 text-center`}>
                        <Typography className="text-s font-normal text-blue-gray-500">{item.id}</Typography>
                      </td>
                      <td className={`py-3 px-5 align-middle border-b border-blue-gray-50 text-center`}>
                        <Typography className="text-s font-normal text-blue-gray-500">{item.name}</Typography>
                      </td>
                    </tr>
                  ))}
                  {setStudentData({...studentData, data : excelData})}
                </tbody>
              </table>
            </div>
          )}
          {/* ซ่อนช่อง Student ID ถ้ามีไฟล์แล้ว */}
          {!fileUploaded && (
            <div>
              <Input
                label="Student ID"
                value={studentData.uid || ""}
                onChange={(e) =>
                  setStudentData({ ...studentData, uid: e.target.value })
                }
                error={!!errors.uid}
              />
              {errors.uid && (
                <Typography variant="small" color="red" className="mt-1">
                  {errors.uid}
                </Typography>
              )}
            </div>
          )}
          {/* ซ่อนช่อง Student ID ถ้ามีไฟล์แล้ว */}
          {showExample && !fileUploaded && (
            <div>
              <img src="https://img5.pic.in.th/file/secure-sv1/example4847e0fccad783e0.png" alt="Example Excel" className="w-full rounded-lg" />
            </div>
          )}
        </div>
      </DialogBody>
      <DialogFooter>
        <Button variant="text" color="red" onClick={handleClose}>
          Cancel
        </Button>
          {!fileUploaded && (
            <Button variant="text" color="orange" onClick={() => setShowExample(!showExample)}>
            Show Example Excel
            </Button>
          )}
        <Button variant="gradient" color="green" onClick={handleSave}>
          {btnStatus}
        </Button>
      </DialogFooter>
    </Dialog>
    </>
  );
}

export default StudentModal;
