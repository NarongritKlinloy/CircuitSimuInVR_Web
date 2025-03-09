import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Switch,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Textarea,
  Input
} from "@material-tailwind/react";
import Swal from "sweetalert2";
import {
  PencilSquareIcon,
  TrashIcon,
  FolderIcon
} from "@heroicons/react/24/solid";
import { deletePracticeAPI } from "@/data/delete-practice";
import { editPracticeAPI } from "@/data/edit-practice";
import { Link, useNavigate } from "react-router-dom";

function ExamTable({ practice, checkStatus, toggleModal }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedPractice, setSelectedPractice] = useState(null);

  // handle data change
  const inputScoreHandle = (event) => {
    let { name, value } = event.target;
    value = value.replace(/\D/g, "");
    if (value !== "" && Number(value) > 100) {
      value = "100";
    }

    setSelectedPractice((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const inputHandle = (event) => {
    setSelectedPractice((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  // เปิด Modal Edit และโหลดข้อมูล
  const openEditModal = (practice) => {
    setSelectedPractice(practice);
    setIsEditOpen(true);
  };

  // ปิด Modal Edit
  const closeEditModal = () => {
    setIsEditOpen(false);
    setSelectedPractice(null);
  };
  

  // ฟังก์ชันยืนยันการแก้ไข
  const handleSaveEdit = async () => {
    try {
      await editPracticeAPI(selectedPractice);
      closeEditModal();
      checkStatus();
    } catch (error) {
      console.error("Error updating practice: ", error)
    }
  };

  // ฟังก์ชันยืนยันการลบ
  const confirmDelete = (practice) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you really want to delete ${practice.practice_name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deletePracticeAPI({ practice_id: practice.practice_id, practice_name: practice.practice_name });
        console.log(`Deleted : ${practice.practice_name}`);
        checkStatus();
      }
    });
  };

  return (
    <div className="flex flex-col gap-8">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Practice Table
          </Typography>
        </CardHeader>

        <CardBody className="overflow-x-auto pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto border-collapse">
            <thead>
              <tr>
                {["No.", "Name", "Detail","Score", "Create Date", "Edit", "Delete"].map((el) => (
                  <th
                    key={el}
                    className={`border-b border-blue-gray-50 px-5 py-2 ${el === "Name" || el === "Detail"
                      ? "text-left"
                      : "text-center"
                      }`}
                  >
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-blue-gray-400"
                    >
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {practice.map((data, key) => {
                const isLast = key === practice.length - 1;
                const rowClassName = `py-3 px-5 align-middle ${isLast ? "" : "border-b border-blue-gray-50"}`;

                return (
                  <tr key={data.practice_id}>
                    <td className={`${rowClassName} text-center`}>
                      <div className="flex justify-center items-center gap-4">
                        <div>
                          <Typography variant="small" color="blue-gray" className="font-semibold">
                            {key + 1}
                          </Typography>
                        </div>
                      </div>
                    </td>


                    <td className={`${rowClassName} text-left`}>
                      <Typography className="text-s font-normal text-blue-gray-500">
                        {data.practice_name}
                      </Typography>
                    </td>

                    <td className={`${rowClassName} text-left`}>
                      <Typography className="text-s font-normal text-blue-gray-500">
                        {data.practice_detail}
                      </Typography>
                    </td>

                    <td className={`${rowClassName} text-center`}>
                      <Typography className="text-s font-normal text-blue-gray-500">
                        {data.practice_score}
                      </Typography>
                    </td>

                    <td className={`${rowClassName} text-center`}>
                      <Typography className="text-s font-normal text-blue-gray-500">
                        {new Date(data.create_date).toISOString().replace("T", " ").slice(0, 19)}
                      </Typography>
                    </td>

                    {/* Edit Button */}
                    <td className={`${rowClassName} text-center`}>
                      <button
                        onClick={() =>
                          openEditModal(data)
                        }
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                      </button>
                    </td>

                    {/* Delete Button */}
                    <td className={`${rowClassName} text-center`}>
                      <button
                        onClick={() =>
                          confirmDelete(data)
                        }
                        className="text-red-500 hover:text-red-700"
                      >
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
        <DialogHeader>Edit practice</DialogHeader>
        <DialogBody>
          <Typography className="mb-4">
            Update practice information
          </Typography>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="sm:w-1/2">
                <Input
                label="Name"
                name="practice_name"
                value={selectedPractice?.practice_name || ""}
                onChange={inputHandle}
              />
              </div>
              <div className="sm:w-1/2">
                <Input
                  label="score (0-100)"
                  name="practice_score"
                  maxLength={3}
                  value={selectedPractice?.practice_score || ""}
                  onChange={inputScoreHandle}
                />
              </div>
            </div>
            <div>
                <Textarea
                  label="detail"
                  name="practice_detail"
                  value={selectedPractice?.practice_detail || ""}
                  onChange={inputHandle}
                />              
            </div>
          </div>
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
export default ExamTable;