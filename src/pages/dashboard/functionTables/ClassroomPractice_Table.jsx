import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button
} from "@material-tailwind/react";
import Swal from "sweetalert2";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Link, useNavigate } from "react-router-dom";
import ClassroomPracticeAssign from "@/data/classroom-practice-assign";
import { addClassroomPractice } from "@/data/add-classroom-practice";
import { removeClassroomPractice } from "@/data/remove-classroom-practice";

function ClassroomPracticeTable({ classroom, checkStatus }) {
  const [selectedClassroom, setSelectedClassroom] = useState(null);

  // State สำหรับ modal แยกกัน
  const [isEditOpen, setIsEditOpen] = useState(false);  
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);

  // State สำหรับข้อมูล practice
  const [practices, setPractices] = useState([]);
  const [selectedPracticeIds, setSelectedPracticeIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPractices = async (class_id) => {
    try {
      const data = await ClassroomPracticeAssign(class_id);
      setPractices(data);
      setSelectedPracticeIds([]);
    } catch (error) {
      console.error("Error fetching practices:", error);
    }
  };

  // Edit Modal
  const openEditModal = (classroomItem) => {
    setSelectedClassroom(classroomItem);
    fetchPractices(classroomItem.class_id);
    setSearchTerm("");
    setIsEditOpen(true);
  };

  // Remove Modal
  const openRemoveModal = (classroomItem) => {
    setSelectedClassroom(classroomItem);
    fetchPractices(classroomItem.class_id);
    setSearchTerm("");
    setIsRemoveOpen(true);
  };

  // ปิด modal ทั้งสอง
  const closeModal = () => {
    setIsEditOpen(false);
    setIsRemoveOpen(false);
    setSelectedClassroom(null);
    setSearchTerm("");
    setSelectedPracticeIds([]);
  };

  // ฟังก์ชันจัดการ checkbox
  const handleCheckboxChange = (e, id) => {
    if (e.target.checked) {
      setSelectedPracticeIds((prev) => [...prev, id]);
    } else {
      setSelectedPracticeIds((prev) => prev.filter((item) => item !== id));
    }
  };

  const filteredPractices = practices.filter((practice) =>
    practice.practice_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // แยกข้อมูล practice
  const availablePractices = filteredPractices.filter(
    (p) => p.is_assigned === 0
  );
  const assignedPractices = filteredPractices.filter(
    (p) => p.is_assigned === 1
  );

  // Handler สำหรับการบันทึก Edit Modal
  const handleSaveEdit = async () => {
    try {
      await addClassroomPractice({
        class_id: selectedClassroom.class_id,
        practice_ids: selectedPracticeIds,
      });
    } catch (error) {
      console.error("Error updating classroom practice: ", error);
    }
    closeModal();
    checkStatus();
  };

  // Handler สำหรับการบันทึก Remove Modal
  const handleSaveRemove = async () => {
    try {
      await removeClassroomPractice({
        class_id: selectedClassroom.class_id,
        practice_ids: selectedPracticeIds,
      });
    } catch (error) {
      console.error("Error removing classroom practice: ", error);
    }
    closeModal();
    checkStatus();
  };

  return (
    <div className="flex flex-col gap-8">
      {/* ตาราง Classroom */}
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Class Practice Table
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-auto pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto border-collapse">
            <thead>
              <tr>
                {["No.", "Name", "sec", "semester", "year", "add practice", "remove practice"].map((el) => (
                  <th
                    key={el}
                    className={`border-b border-blue-gray-50 px-5 py-2 ${el === "Name" ? "text-left" : "text-center"}`}
                  >
                    <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {classroom.map((data, key) => {
                const isLast = key === classroom.length - 1;
                const rowClassName = `py-3 px-5 align-middle ${isLast ? "" : "border-b border-blue-gray-50"}`;
                return (
                  <tr key={data.class_id}>
                    <td className={`${rowClassName} text-center`}>
                      <Typography variant="small" color="blue-gray" className="font-semibold">
                        {key + 1}
                      </Typography>
                    </td>
                    <td className={`${rowClassName} text-left`}>
                      <Typography className="text-s font-normal text-blue-gray-500">
                        {data.class_name}
                      </Typography>
                    </td>
                    <td className={`${rowClassName} text-center`}>
                      <Typography className="text-s font-normal text-blue-gray-500">
                        {data.sec}
                      </Typography>
                    </td>
                    <td className={`${rowClassName} text-center`}>
                      <Typography className="text-s font-normal text-blue-gray-500">
                        {data.semester}
                      </Typography>
                    </td>
                    <td className={`${rowClassName} text-center`}>
                      <Typography className="text-s font-normal text-blue-gray-500">
                        {data.year}
                      </Typography>
                    </td>
                    {/* ปุ่ม Edit: สำหรับเพิ่ม available practice */}
                    <td className={`${rowClassName} text-center`}>
                      <button onClick={() => openEditModal(data)} className="text-blue-500 hover:text-blue-700">
                        <PencilSquareIcon className="h-5 w-5" />
                      </button>
                    </td>
                    {/* ปุ่ม Remove: สำหรับลบ assigned practice */}
                    <td className={`${rowClassName} text-center`}>
                      <button onClick={() => openRemoveModal(data)} className="text-red-500 hover:text-red-700">
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
      </Card>

      {/* Edit Modal */}
      <Dialog open={isEditOpen} handler={closeModal}>
        <DialogHeader>Add Classroom Practice</DialogHeader>
        <DialogBody className="p-6">
          {/* แสดงข้อมูล classroom ที่เลือก */}
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <Typography variant="h6" className="mb-2 text-gray-800">
              Classroom Information
            </Typography>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p><strong>Name:</strong> {selectedClassroom?.class_name}</p>
              <p><strong>Sec:</strong> {selectedClassroom?.sec}</p>
              <p><strong>Semester:</strong> {selectedClassroom?.semester}</p>
              <p><strong>Year:</strong> {selectedClassroom?.year}</p>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative mb-4">
            <svg
              className="w-5 h-5 text-gray-500 absolute left-3 top-2.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
            <input
              type="text"
              className="w-full pl-10 p-2 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search practice..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* แสดงรายการ practice ที่ถูกเลือก */}
          <div className="mb-4">
            {selectedPracticeIds.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {practices
                  .filter((p) => selectedPracticeIds.includes(p.practice_id))
                  .map((p) => (
                    <span
                      key={p.practice_id}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      {p.practice_name}
                    </span>
                  ))}
              </div>
            ) : (
              <Typography variant="small" className="text-gray-500">
                No practices selected.
              </Typography>
            )}
          </div>

          {/* แสดงรายการ available practice (is_assigned === 0) */}
          <ul className="max-h-72 overflow-y-auto text-sm text-gray-700">
            {availablePractices.length > 0 ? (
              availablePractices.map((practice) => (
                <li key={practice.practice_id}>
                  <div
                    className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      // Toggle checkbox เมื่อคลิกที่แถว
                      handleCheckboxChange(
                        { target: { checked: !selectedPracticeIds.includes(practice.practice_id) } },
                        practice.practice_id
                      );
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedPracticeIds.includes(practice.practice_id)}
                      onChange={(e) => handleCheckboxChange(e, practice.practice_id)}
                      className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label className="ml-2 text-gray-900 text-sm">
                      {practice.practice_name}
                    </label>
                  </div>
                </li>
              ))
            ) : (
              <li className="p-3 text-center text-gray-500">No available practices found</li>
            )}
          </ul>

          <Button
            onClick={() => {
              if (selectedPracticeIds.length === availablePractices.length) {
                setSelectedPracticeIds([]);
              } else {
                setSelectedPracticeIds(availablePractices.map((p) => p.practice_id));
              }
            }}
            variant="text"
            className="mt-4 w-full bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-200 hover:border-transparent rounded"
          >
            {selectedPracticeIds.length === availablePractices.length ? "Unselect All" : "Select All"}
          </Button>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" onClick={closeModal}>
            Cancel
          </Button>
          <Button variant="gradient" color="green" onClick={handleSaveEdit}>
            Save
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Remove Modal */}
      <Dialog open={isRemoveOpen} handler={closeModal}>
        <DialogHeader>Remove Classroom Practice</DialogHeader>
        <DialogBody className="p-6">
          {/* แสดงข้อมูลของ classroom ที่เลือก */}
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <Typography variant="h6" className="mb-2 text-gray-800">
              Classroom Information
            </Typography>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p><strong>Name:</strong> {selectedClassroom?.class_name}</p>
              <p><strong>Sec:</strong> {selectedClassroom?.sec}</p>
              <p><strong>Semester:</strong> {selectedClassroom?.semester}</p>
              <p><strong>Year:</strong> {selectedClassroom?.year}</p>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative mb-4">
            <svg
              className="w-5 h-5 text-gray-500 absolute left-3 top-2.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
            <input
              type="text"
              className="w-full pl-10 p-2 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search practice..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* แสดงรายการ practice ที่ถูกเลือก */}
          <div className="mb-4">
            {selectedPracticeIds.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {practices
                  .filter((p) => selectedPracticeIds.includes(p.practice_id))
                  .map((p) => (
                    <span
                      key={p.practice_id}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm"
                    >
                      {p.practice_name}
                    </span>
                  ))}
              </div>
            ) : (
              <Typography variant="small" className="text-gray-500">
                No practices selected.
              </Typography>
            )}
          </div>

          {/* แสดงรายการ */}
          <ul className="max-h-72 overflow-y-auto text-sm text-gray-700">
            {assignedPractices.length > 0 ? (
              assignedPractices.map((practice) => (
                <li key={practice.practice_id}>
                  <div
                    className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      handleCheckboxChange(
                        { target: { checked: !selectedPracticeIds.includes(practice.practice_id) } },
                        practice.practice_id
                      );
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedPracticeIds.includes(practice.practice_id)}
                      onChange={(e) => handleCheckboxChange(e, practice.practice_id)}
                      className="w-4 h-4 text-red-600 bg-white border-gray-300 rounded focus:ring-red-500"
                    />
                    <label className="ml-2 text-gray-900 text-sm">
                      {practice.practice_name}
                    </label>
                  </div>
                </li>
              ))
            ) : (
              <li className="p-3 text-center text-gray-500">No assigned practices found</li>
            )}
          </ul>

          <Button
            onClick={() => {
              if (selectedPracticeIds.length === assignedPractices.length) {
                setSelectedPracticeIds([]);
              } else {
                setSelectedPracticeIds(assignedPractices.map((p) => p.practice_id));
              }
            }}
            variant="text"
            className="mt-4 w-full bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-200 hover:border-transparent rounded"
          >
            {selectedPracticeIds.length === assignedPractices.length ? "Unselect All" : "Select All"}
          </Button>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" onClick={closeModal}>
            Cancel
          </Button>
          <Button variant="gradient" color="green" onClick={handleSaveRemove}>
            Save
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default ClassroomPracticeTable;
