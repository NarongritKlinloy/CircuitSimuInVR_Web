import React, { useState } from "react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Card, Input, CardHeader, CardBody, Typography, Avatar, Chip, Dialog, DialogHeader, DialogBody, DialogFooter, Button } from "@material-tailwind/react";
import Swal from "sweetalert2";

function ClassroomTable({ classrooms, onEditClick, onDelete }) {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedClassroom, setSelectedClassroom] = useState(null);
    

    // handle data change
    const inputHandle = (event) => { 
        setSelectedClassroom((prev) => ({
            ...prev , [event.target.name] : event.target.value
        }))
    }

    // เปิด Modal และโหลดข้อมูล
    const openEditModal = (classroom) => {
        setSelectedClassroom(classroom);
        setIsEditOpen(true);
    };

    // ปิด Modal
    const closeEditModal = () => {
        setIsEditOpen(false);
        setSelectedClassroom(null);
    };

    // ฟังก์ชันยืนยันการแก้ไข
    const handleSaveEdit = () => {
        console.log(`Updated ${selectedClassroom.classname} to ${selectedClassroom.classname}`);
        Swal.fire({
            title: "Updated!",
            text: `${selectedClassroom.classname} has been updated to ${selectedClassroom.classname}.`,
            icon: "success",
            confirmButtonText: "OK",
            customClass: {
                confirmButton: 'bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600',
            },
        });
        closeEditModal();
    };

    // ฟังก์ชันยืนยันการลบ
    const confirmDelete = (classname) => {
        Swal.fire({
            title: "Are you sure?",
            text: `Do you really want to delete ${classname}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Delete",
            cancelButtonText: "Cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                console.log(`Deleted : ${classname}`);
                Swal.fire({
                    title: "Deleted!",
                    text: `${classname} has been deleted.`,
                    icon: "success", confirmButtonText: "OK",
                    customClass: {
                        confirmButton: 'bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600',
                    }
                });
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
                                {["classname", "sec","semester", "year", "edit", "delete"].map((header) => (
                                    <th
                                        key={header}
                                        className={`border-b border-blue-gray-50 px-5 py-2 ${header === "classname" ? "text-left" : "text-center"}`}
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
                            {/* {classrooms.map(({ img, name, email, online, date, role }, key) => { */}
                            {classrooms.map(({ id, classname, sec , semester, year}, key) => {
                                const isLast = key === classrooms.length - 1;
                                const rowClassName = `py-3 px-5 align-middle ${isLast ? "" : "border-b border-blue-gray-50"}`;

                                return (
                                    <tr key={id}>
                                        <td className={`${rowClassName} text-left`}>
                                            <div className="flex items-center gap-4">
                                                <Typography variant="small" color="blue-gray" className="font-semibold">
                                                    {id}
                                                </Typography>
                                                {classname}
                                            </div>
                                        </td>
                                        <td className={`${rowClassName} text-center`}>
                                            <Typography className="text-xs font-normal text-blue-gray-500">
                                                {sec}
                                            </Typography>
                                        </td>
                                        <td className={`${rowClassName} text-center`}>
                                            <Typography className="text-xs font-normal text-blue-gray-500">
                                                {semester}
                                            </Typography>
                                        </td>

                                        <td className={`${rowClassName} text-center`}>
                                            <Typography className="text-xs font-normal text-blue-gray-500">
                                                {year}
                                            </Typography>
                                        </td>

                                        {/* Edit Button */}
                                        <td className={`${rowClassName} text-center`}>
                                            <button
                                                onClick={() => openEditModal({id, classname , sec ,semester, year})}
                                                className="text-blue-500 hover:text-blue-700"
                                            >
                                                <PencilSquareIcon className="h-5 w-5" />
                                            </button>
                                        </td>

                                        {/* Delete Button */}
                                        <td className={`${rowClassName} text-center`}>
                                            <button
                                                onClick={() => confirmDelete(classname)}
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
                <DialogHeader>Edit Classroom</DialogHeader>
                <DialogBody>
                    <Typography className="mb-4">
                        {/* Update <strong>{selectedClassroom?.classname}</strong> Information */}
                        Update classroom information
                    </Typography>
                    <div className="flex flex-col gap-4">
                        <div>
                            <Input
                                label="Name"
                                name = "classname"
                                value={selectedClassroom?.classname}
                                onChange={inputHandle}
                            />
                        </div>

                        <div className="flex gap-4">
                            <div className="w-1/3">
                                <Input
                                    label="sec"
                                    name = "sec"
                                    value={selectedClassroom?.sec}
                                    onChange={inputHandle}
                                />
                            </div>
                            <div className="w-1/3">
                                <Input
                                    label="semester"
                                    name = "semester"
                                    value={selectedClassroom?.semester}
                                    onChange={inputHandle}
                                />
                            </div>
                            <div className="w-1/3">
                                <Input
                                    label="year"
                                    name="year"
                                    value={selectedClassroom?.year}
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
        </div>
    );
}

export default ClassroomTable;
