import {
    Card,
    Input,
    CardHeader,
    CardBody,
    Typography,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Button,
} from "@material-tailwind/react";

import {
    PencilSquareIcon,
    UsersIcon,
    TrashIcon,
    UserPlusIcon
} from "@heroicons/react/24/solid";

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { deleteClassroomAPI } from "@/data/delete-classroom";
import { editClassroomAPI } from "@/data/edit-classroom";
import { countStudentAPI } from "@/data/student-count";

function ClassroomTable({ classrooms, onEditClick, onDelete, checkStatus}) {
    const navigate = useNavigate();
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isAddTAOpen, setIsAddTAOpen] = useState(false);
    const [selectedClassroom, setSelectedClassroom] = useState(null);

    //นับจำนวน student
    const [studentCount, setStudentCount] = useState({});
    useEffect(() => {
        const fetchStudentCounts = async () => {
            const countPromises = classrooms.map(async (classroom) => {
                const count = await countStudentAPI(classroom.class_id);
                return { [classroom.class_id]: count };
            });

            const counts = await Promise.all(countPromises);
            setStudentCount(Object.assign({}, ...counts));
        };

        fetchStudentCounts();
    }, [classrooms]);


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
    };

    // ฟังก์ชันยืนยันการแก้ไข
    const handleSaveEdit = async () => {
        try {
            await editClassroomAPI(selectedClassroom.class_id, selectedClassroom);
            checkStatus();
            closeEditModal();
        } catch (error) {
            console.error("Error updating classroom: ",error)
        }
    };


    // เปิด Modal Add TA
    const openAddTAModal = (classroom) => {
        setSelectedClassroom(classroom);
        setIsAddTAOpen(true);
    };

    // ปิด Modal ADD TA
    const closeAddTAModal = () => {
        setIsAddTAOpen(false);
        setSelectedClassroom(null);
    };

    // ฟังก์ชันยืนยันการแก้ไข
    const handleAddTA = async () => {
        // editClassroomAPI(selectedClassroom.class_id, selectedClassroom);
        closeEditModal();
    };

    // ฟังก์ชันยืนยันการลบ
    const confirmDelete = (classroom) => {
        Swal.fire({
            title: "Are you sure?",
            text: `Do you really want to delete ${classroom.class_name}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Delete",
            cancelButtonText: "Cancel",
        }).then(async (result) => {
            if (result.isConfirmed) {
                await deleteClassroomAPI(classroom.class_id, classroom.class_name);
                console.log(`Deleted : ${classroom.class_name}`);
                checkStatus();
            }
        });
    };

    return (
        <div className="flex flex-col gap-8">
            <Card>
                <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
                    <Typography variant="h6" color="white">
                        Classroom Table
                    </Typography>
                </CardHeader>

                {/* Table Section */}
                <CardBody className="overflow-x-auto pt-0 pb-2">
                    <table className="w-full min-w-[640px] table-auto border-collapse">
                        <thead>
                            <tr>
                                {[
                                    "id",
                                    "classname",
                                    "sec",
                                    "semester",
                                    "year",
                                    "student",
                                    "add student",
                                    "add assistant",
                                    "edit",
                                    "delete",
                                ].map((header) => (
                                    <th
                                        key={header}
                                        className={`border-b border-blue-gray-50 px-5 py-2 ${header === "classname"
                                                ? "text-left"
                                                : "text-center"
                                            }`}
                                    >
                                        <Typography
                                            variant="small"
                                            className="text-[11px] font-bold uppercase text-blue-gray-400"
                                        >
                                            {header}
                                        </Typography>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {classrooms.map(
                                ({ class_id, class_name, sec, semester, year }, key) => {
                                    const isLast = key === classrooms.length - 1;
                                    const rowClassName = `py-3 px-5 align-middle ${isLast ? "" : "border-b border-blue-gray-50"
                                        }`;

                                    return (
                                        <tr key={class_id}>
                                            <td className={`${rowClassName} text-center`}>
                                                <div className="flex justify-center items-center gap-4">
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-semibold"
                                                    >
                                                        {key+1}
                                                    </Typography>
                                                </div>
                                            </td>

                                            <td className={`${rowClassName} text-left`}>
                                                <div className="text-s font-normal text-blue-gray-500">
                                                    {class_name}
                                                </div>
                                            </td>
                                            <td className={`${rowClassName} text-center`}>
                                                <Typography className="text-s font-normal text-blue-gray-500">
                                                    {sec}
                                                </Typography>
                                            </td>
                                            <td className={`${rowClassName} text-center`}>
                                                <Typography className="text-s font-normal text-blue-gray-500">
                                                    {semester}
                                                </Typography>
                                            </td>

                                            <td className={`${rowClassName} text-center`}>
                                                <Typography className="text-s font-normal text-blue-gray-500">
                                                    {year}
                                                </Typography>
                                            </td>
                                            <td className={`${rowClassName} text-center`}>
                                                <Typography className="text-s font-normal text-blue-gray-500">
                                                    {studentCount[class_id]}
                                                </Typography>
                                            </td>

                                            {/* Add Student Button */}
                                            <td className={`${rowClassName} text-center`}>
                                                <Link
                                                    to={`/teacher/student/${class_name} (${sec})`}
                                                    className="text-green-500 hover:text-green-700"
                                                    onClick={() => {
                                                        sessionStorage.setItem("class_id", class_id);
                                                    }}
                                                >
                                                    <UserPlusIcon className="h-5 w-5 mx-auto" />
                                                </Link>
                                            </td>

                                            {/* Add TA Button */}
                                            <td className={`${rowClassName} text-center`}>
                                                <Link
                                                    to={`/teacher/TA_mgn/${class_name} (${sec})`}
                                                    onClick={() => {
                                                        sessionStorage.setItem("class_id", class_id);
                                                    }}
                                                    className="text-blue-500 hover:text-blue-700"
                                                >
                                                    <UsersIcon className="h-5 w-5 mx-auto" />
                                                </Link>
                                            </td>

                                            {/* Edit Classroom Button */}
                                            <td className={`${rowClassName} text-center`}>
                                                <button
                                                    onClick={() =>
                                                        openEditModal({
                                                            class_id,
                                                            class_name,
                                                            sec,
                                                            semester,
                                                            year,
                                                        })
                                                    }
                                                    className="text-blue-500 hover:text-blue-700"
                                                >
                                                    <PencilSquareIcon className="h-5 w-5" />
                                                </button>
                                            </td>

                                            {/* Delete Classroom Button */}
                                            <td className={`${rowClassName} text-center`}>
                                                <button
                                                    onClick={() =>
                                                        confirmDelete({
                                                            class_id,
                                                            class_name,
                                                        })
                                                    }
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <TrashIcon className="h-5 w-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                }
                            )}
                        </tbody>
                    </table>
                </CardBody>
            </Card>

            {/* Edit Modal */}
            <Dialog open={isEditOpen} handler={closeEditModal}>
                <DialogHeader>Edit Classroom</DialogHeader>
                <DialogBody>
                    <Typography className="mb-4">
                        Update classroom information
                    </Typography>
                    <div className="flex flex-col gap-4">
                        <div>
                            <Input
                                label="Name"
                                name="class_name"
                                value={selectedClassroom?.class_name || ""}
                                onChange={inputHandle}
                            />
                        </div>

                        <div className="flex gap-4">
                            <div className="w-1/3">
                                <Input
                                    label="sec"
                                    name="sec"
                                    value={selectedClassroom?.sec || ""}
                                    onChange={inputHandle}
                                />
                            </div>
                            <div className="w-1/3">
                                <Input
                                    label="semester"
                                    name="semester"
                                    value={selectedClassroom?.semester || ""}
                                    onChange={inputHandle}
                                />
                            </div>
                            <div className="w-1/3">
                                <Input
                                    label="year"
                                    name="year"
                                    value={selectedClassroom?.year || ""}
                                    onChange={inputHandle}
                                />
                            </div>
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

            {/* Add TA Modal */}
            {/* <Dialog open={isAddTAOpen} handler={closeAddTAModal}>
                <DialogHeader>Add Teacher Assistant</DialogHeader>
                <DialogBody>
                    <Typography className="mb-4">
                        class : {selectedClassroom?.class_name}
                    </Typography>
                    <div className="flex flex-col gap-4">
                        <div>
                            <Input
                                label="Email"
                                name="uid"
                                onChange={inputHandle}
                            />
                        </div>
                    </div>
                </DialogBody>
                <DialogFooter>
                    <Button variant="text" color="red" onClick={closeAddTAModal}>
                        Cancel
                    </Button>
                    <Button variant="gradient" color="green" onClick={handleAddTA}>
                        Add
                    </Button>
                </DialogFooter>
            </Dialog> */}
        </div>
    );
}
export default ClassroomTable;