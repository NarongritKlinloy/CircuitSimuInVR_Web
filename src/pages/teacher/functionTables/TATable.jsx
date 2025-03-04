import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Select, Option, Card, Input, CardHeader, CardBody, Typography, Dialog, DialogHeader, DialogBody, DialogFooter, Button, select } from "@material-tailwind/react";
import Swal from "sweetalert2";
import { deleteTAAPI } from "@/data/delete-TA-classroom";
import { string } from "prop-types";

function TATable({ TAs, checkStatus }) {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const { classname } = useParams();
    const [selectedTA, setSelectedTA] = useState(null);

    // handle data change
    const inputHandle = (event) => {
        setSelectedTA((prev) => ({
            ...prev, [event.target.name]: event.target.value
        }))
    }

    // เปิด Modal และโหลดข้อมูล
    const openEditModal = (TA) => {
        setSelectedTA(TA);
        setIsEditOpen(true);
    };

    // ปิด Modal 
    const closeEditModal = () => {
        setIsEditOpen(false);
        setSelectedTA(null);
    };

    // ฟังก์ชันยืนยันการแก้ไข
    const handleSaveEdit = () => {
        console.log(`Updated ${selectedTA.name}`);
        Swal.fire({
            title: "Updated!",
            text: `${selectedTA.name} has been updated`,
            icon: "success",
            confirmButtonText: "OK",
            customClass: {
                confirmButton: 'bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600',
            },
        });
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
                await deleteTAAPI(uid, sessionStorage.getItem("class_id"));
                checkStatus();
            }
            // .then((result) => {
            //     if (result.isConfirmed) {
            //         console.log(sessionStorage.getItem("class_id"));
            //         deleteTAAPI(uid, sessionStorage.getItem("class_id"));
            //         console.log(`Deleted : ${uid}`);
            //         Swal.fire({
            //             title: "Deleted!",
            //             text: `${uid} has been deleted.`,
            //             icon: "success", confirmButtonText: "OK",
            //             customClass: {
            //                 confirmButton: 'bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600',
            //             }
            //         });
            //     }
        });
    };

    return (
        <div className="flex flex-col gap-8">
            <Card>
                <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
                    <Typography variant="h6" color="white">
                        Teacher Assistant Table : {classname}
                    </Typography>
                </CardHeader>

                {/* Table Section */}
                <CardBody className="overflow-x-auto pt-0 pb-2">
                    <table className="w-full min-w-[640px] table-auto border-collapse">
                        <thead>
                            <tr>
                                {["no.", "uid", "name", "last active", "delete"].map((header) => (
                                    <th
                                        key={header}
                                        // className={`border-b border-blue-gray-50 px-5 py-2 ${header === "name" ? "text-left" : "text-center"}`}
                                        className={`border-b border-blue-gray-50 px-5 py-2 text-center}`}
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
                            {TAs.map(({ uid, name, last_active }, key) => {
                                const isLast = key === TAs.length - 1;
                                const rowClassName = `py-3 px-5 align-middle ${isLast ? "" : "border-b border-blue-gray-50"}`;

                                return (
                                    <tr key={uid}>
                                        <td className={`${rowClassName} text-center`}>
                                            <Typography className="text-s font-normal font-semibold">
                                                {key + 1}
                                            </Typography>
                                        </td>
                                        <td className={`${rowClassName} text-center`}>
                                            <Typography className="text-s font-normal text-blue-gray-500">
                                                {uid}
                                            </Typography>
                                        </td>
                                        <td className={`${rowClassName} text-center`}>
                                            <Typography className="text-s font-normal text-blue-gray-500">
                                                {name}
                                            </Typography>
                                        </td>
                                        <td className={`${rowClassName} text-center`}>
                                            <Typography className="text-s font-normal text-blue-gray-500">
                                                {new Date(last_active).toLocaleString("en-GB", { 
                                                    day: '2-digit', 
                                                    month: '2-digit', 
                                                    year: 'numeric', 
                                                    hour: '2-digit', 
                                                    minute: '2-digit', 
                                                    second: '2-digit', 
                                                    hour12: false 
                                                }).replace(',', '')}
                                            </Typography>
                                        </td>

                                        {/* Edit Button */}
                                        {/* <td className={`${rowClassName} text-center`}>
                                            <button
                                                onClick={() => openEditModal({ uid })}
                                                className="text-blue-500 hover:text-blue-700"
                                            >
                                                <PencilSquareIcon className="h-5 w-5" />
                                            </button>
                                        </td> */}

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
                            <Input
                                readOnly
                                label="student id"
                                name="stdid"
                                value={selectedTA?.uid}
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

export default TATable;