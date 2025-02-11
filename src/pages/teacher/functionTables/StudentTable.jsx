import React, { useState , useEffect } from "react";
import { useParams } from "react-router-dom";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Select, Option, Card, Input, CardHeader, CardBody, Typography, Dialog, DialogHeader, DialogBody, DialogFooter, Button, select } from "@material-tailwind/react";
import Swal from "sweetalert2";
import { deleteStudentAPI } from "@/data/delete-student-classroom";
import { editStudentAPI } from "@/data/edit-student-classroom";
import { string } from "prop-types";

function StudentTable({ students, onEditClick, onDelete, checkStatus}) {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const { classname } = useParams();
    const [selectedStudent, setSelectedStudent] = useState(null);
    
    // handle data change
    const inputHandle = (event) => {
        setSelectedStudent((prev) => ({
            ...prev, [event.target.name]: event.target.value
        }))
    }

    // เปิด Modal และโหลดข้อมูล
    const openEditModal = (student) => {
        setSelectedStudent(student);
        setIsEditOpen(true);
    };

    // ปิด Modal 
    const closeEditModal = () => {
        setIsEditOpen(false);
        setSelectedStudent(null);
    };

    // ฟังก์ชันยืนยันการแก้ไข
    const handleSaveEdit = async () => {
        try {
            await editStudentAPI(selectedStudent.uid, sessionStorage.getItem("class_id"));
            checkStatus();
        } catch (error) {
            console.error("Error updating student : ", error)
        }
        closeEditModal();
    };

   
    // ฟังก์ชันยืนยันการลบ
    const confirmDelete = (uid) => {
        Swal.fire({
            title: "Are you sure?",
            text: `Do you really want to delete ${uid}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Delete",
            cancelButtonText: "Cancel",
        }).then(async (result) => {
            if (result.isConfirmed) {
                await deleteStudentAPI(uid, sessionStorage.getItem("class_id"));
                console.log(`Deleted : ${uid}`);
                checkStatus();
            }
        });
    };

    return (
        <div className="flex flex-col gap-8">
            <Card>
                <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
                    <Typography variant="h6" color="white">
                        Student Table : { classname }
                    </Typography>
                </CardHeader>

                {/* Table Section */}
                <CardBody className="overflow-x-auto pt-0 pb-2">
                    <table className="w-full min-w-[640px] table-auto border-collapse">
                        <thead>
                            <tr>
                                {["no.", "uid", "name", "last active","edit", "delete"].map((header) => (
                                    <th
                                        key={header}
                                        className={`border-b border-blue-gray-50 px-5 py-2 ${header === "name" ? "text-left" : "text-center"}`}
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
                            {students.map(({ uid, name, last_active ,sec}, key) => {
                                const isLast = key === students.length - 1;
                                const rowClassName = `py-3 px-5 align-middle ${isLast ? "" : "border-b border-blue-gray-50"}`;

                                return (
                                    <tr key={uid}>
                                        <td className={`${rowClassName} text-center`}>
                                            <Typography className="text-s font-normal font-semibold">
                                                {key+1}
                                            </Typography>
                                        </td>
                                        <td className={`${rowClassName} text-center`}>
                                            <Typography className="text-s font-normal text-blue-gray-500">
                                                {uid}
                                            </Typography>
                                        </td>
                                        <td className={`${rowClassName} text-left`}>
                                            <Typography className="text-s font-normal text-blue-gray-500">
                                                {name}
                                            </Typography>
                                        </td>
                                        <td className={`${rowClassName} text-left`}>
                                            <Typography className="text-s font-normal text-blue-gray-500">
                                                {last_active}
                                            </Typography>
                                        </td>
                                        {/* Edit Button */}
                                        <td className={`${rowClassName} text-center`}>
                                            <button
                                                onClick={() => openEditModal({ uid, name , sec})}
                                                className="text-blue-500 hover:text-blue-700"
                                            >
                                                <PencilSquareIcon className="h-5 w-5" />
                                            </button>
                                        </td>

                                        {/* Delete Button */}
                                        <td className={`${rowClassName} text-center`}>
                                            <button
                                                onClick={() => confirmDelete(uid)}
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
                <DialogHeader>Edit Student</DialogHeader>
                <DialogBody>
                    <Typography className="mb-4">
                        Update student information
                    </Typography>
                    <div className="flex flex-col gap-4">
                        <div className="flex gap-4">
                            <div className="w-1/2">
                                <Input 
                                    readOnly
                                    label="student id"
                                    name="stdid"
                                    value={selectedStudent?.uid}
                                    onChange={inputHandle}
                                />
                            </div>
                            <div className="w-1/2">
                                <Input  
                                    readOnly
                                    label="name"
                                    name="name"
                                    value={selectedStudent?.name}
                                    onChange={inputHandle}
                                />
                            </div>
                        </div>
                        
                        <div>
                            <Select 
                                label="Select Sec"
                                name="sec"
                                value={selectedStudent?.sec ? String(selectedStudent.sec) : ""}
                                onChange={(e)=>{
                                    setSelectedStudent((prev) => ({
                                        ...prev, "sec" : e
                                    }))
                                }}                        
                            >
                                <Option value="101">101</Option>
                                <Option value="102">102</Option>
                                <Option value="103">103</Option>
                                <Option value="111">111</Option>
                            </Select>
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

export default StudentTable;