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
import {
  PencilSquareIcon,
  TrashIcon
} from "@heroicons/react/24/solid";
import { Link, useNavigate } from "react-router-dom";
import { practiceTableData } from "@/data/practice-table-data";
import { addClassroomPractice } from "@/data/add-classroom-practice";

function ClassroomPracticeTable({ classroom, checkStatus }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedClassroom, setSelectedClassroom] = useState(null);

  const [practices, setPractices] = useState([]);
  const getPractice = async () => {
    const data = await practiceTableData();
    setPractices(data);
  };

  useEffect(() => {
    getPractice();
  }, []);

  const [selectedPracticeIds, setSelectedPracticeIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // ฟังก์ชันจัดการเมื่อเลือก checkbox
  const handleCheckboxChange = (e, id) => {
    if (e.target.checked) {
      setSelectedPracticeIds((prev) => [...prev, id]);
    } else {
      setSelectedPracticeIds((prev) => prev.filter((item) => item !== id));
    }
  };

  // handle data change
  const inputHandle = (event) => {
    setSelectedClassroom((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  // เปิด Modal Edit และโหลดข้อมูล
  const openEditModal = (classroom) => {
    setSelectedClassroom(classroom);
    setIsEditOpen(true);
  };

  // ปิด Modal Edit
  const closeEditModal = () => {
    setIsEditOpen(false);
    setSelectedClassroom(null);
    setIsDropdownOpen(false);
    setSearchTerm("");
    setSelectedPracticeIds([]);
  };

  // ฟังก์ชันยืนยันการแก้ไข
  const handleSaveEdit = async () => {
    try {
      await addClassroomPractice({
        class_id: selectedClassroom.class_id,
        practice_ids: selectedPracticeIds,
      });
    } catch (error) {
      console.error("Error updating classroom practice: ", error);
    }
    closeEditModal();
    checkStatus();
  };
  

  // ฟังก์ชันยืนยันการลบ
  const confirmDelete = (classroom) => {
    // โค้ดสำหรับยืนยันการลบ
  };

  // Filter practices ตาม search term
  const filteredPractices = practices.filter((practice) =>
    practice.practice_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8">
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
                    className={`border-b border-blue-gray-50 px-5 py-2 ${el === "Name" ? "text-left" : "text-center"
                      }`}
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
                      <div className="flex justify-center items-center gap-4">
                        <Typography variant="small" color="blue-gray" className="font-semibold">
                          {key + 1}
                        </Typography>
                      </div>
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
                    {/* Edit Button */}
                    <td className={`${rowClassName} text-center`}>
                      <button onClick={() => openEditModal(data)} className="text-blue-500 hover:text-blue-700">
                        <PencilSquareIcon className="h-5 w-5" />
                      </button>
                    </td>
                    {/* Delete Button */}
                    <td className={`${rowClassName} text-center`}>
                      <button onClick={() => confirmDelete(data)} className="text-red-500 hover:text-red-700">
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
      <Dialog open={isEditOpen} handler={closeEditModal}>
        <DialogHeader>Edit Classroom practice</DialogHeader>
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

          {/* แสดงรายการ practice ที่เลือก */}
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

          {/* Practice List */}
          <ul className="max-h-72 overflow-y-auto text-sm text-gray-700">
            {filteredPractices.length > 0 ? (
              filteredPractices.map((practice) => (
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
              <li className="p-3 text-center text-gray-500">No practices found</li>
            )}
          </ul>


          <Button
            onClick={() => {
              if (selectedPracticeIds.length === practices.length) {
                setSelectedPracticeIds([]); // Unselect all
              } else {
                setSelectedPracticeIds(practices.map((p) => p.practice_id)); // Select all
              }
            }}
            variant="text"
            // className="mt-4 w-full py-2 px-4 rounded-lg"
            className="mt-4 w-full 
            bg-transparent 
            hover:bg-blue-500 
            text-blue-700 
            font-semibold 
            hover:text-white py-2 px-4 
            border border-blue-200 hover:border-transparent rounded"
          >
            {selectedPracticeIds.length === practices.length ? "Unselect All" : "Select All"}
          </Button>

        </DialogBody>

        <DialogFooter>
          <Button variant="text" color="red" onClick={closeEditModal}>
            Cancel
          </Button>
          <Button variant="gradient" color="green" onClick={handleSaveEdit}>
            Save
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default ClassroomPracticeTable;
