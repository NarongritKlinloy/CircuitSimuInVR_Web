import React, { useState } from "react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Avatar,
    Chip,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Button,
} from "@material-tailwind/react";
import Swal from "sweetalert2";
import { updateRoleAPI } from "@/data/update-role";
import { deleteUserAPI } from "@/data/delete-user";

function TeacherTable({ teachers, onEditClick, onDelete }) {
    const [isEditOpen, setIsEditOpen] = useState(false); // State สำหรับเปิด/ปิด Modal
    const [selectedUser, setSelectedUser] = useState(null); // เก็บข้อมูล User ที่จะแก้ไข
    const [selectedRole, setSelectedRole] = useState(3); // เก็บ Role ที่เลือกจาก Dropdown

    // เปิด Modal และโหลดข้อมูล User ที่เลือก
    const openEditModal = (user) => {
        setSelectedUser(user);
        setIsEditOpen(true);
    };

    // ปิด Modal
    const closeEditModal = () => {
        setIsEditOpen(false);
        setSelectedUser(null);
    };

    // ฟังก์ชันยืนยันการแก้ไข Role
    const handleSaveEdit = () => {
        updateRoleAPI(selectedUser.uid, selectedRole);
        console.log(`Updated role for ${selectedUser.name} to ${selectedRole}`);
        Swal.fire({
            title: "Updated!",
            text: `${selectedUser.name}'s role has been updated to ${selectedRole}.`,
            icon: "success",
            confirmButtonText: "OK",
            customClass: {
                confirmButton: "bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600",
            },
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.reload();
            }
        });
        closeEditModal();
    };

    // ฟังก์ชันยืนยันการลบ
    const confirmDelete = (teachers) => {
        Swal.fire({
            title: "Are you sure?",
            text: `Do you really want to delete ${teachers.name}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Delete",
            cancelButtonText: "Cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                deleteUserAPI(teachers.uid);
                console.log(`Deleted user: ${teachers.name}`);
                Swal.fire({
                    title: "Deleted!",
                    text: `${teachers.name} has been deleted.`,
                    icon: "success",
                    confirmButtonText: "OK",
                    customClass: {
                        confirmButton: "bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600",
                    },
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.reload();
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
                        Teacher Table
                    </Typography>
                </CardHeader>

                {/* Table Section */}
                <CardBody className="overflow-x-auto pt-0 pb-2">
                    <table className="w-full min-w-[640px] table-auto border-collapse">
                        <thead>
                            <tr>
                                {["Name", "Email", "Last Active", "Edit", "Delete"].map((header, index) => (
                                    <th
                                        key={index}
                                        className={`border-b border-blue-gray-50 px-5 py-2 ${
                                            header === "Name" ? "text-left" : "text-center"
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

                        {/* Table Body */}
                        <tbody>
                            {teachers.map((teachers, key) => {
                                const isLast = key === teachers.length - 1;
                                const rowClassName = `py-3 px-5 align-middle ${
                                    isLast ? "" : "border-b border-blue-gray-50"
                                }`;

                                return (
                                    <tr key={teachers.uid}> {/* ใช้ uid เป็น key */}
                                        <td className={`${rowClassName} text-left`}>
                                            <div className="flex items-center gap-4">
                                                {/* <Avatar
                                                    src={teachers.img || "https://via.placeholder.com/150"} // ใช้รูปเริ่มต้นหากไม่มีรูป
                                                    alt={teachers.name}
                                                    size="sm"
                                                    variant="rounded"
                                                /> */}
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-semibold"
                                                >
                                                    {teachers.name}
                                                </Typography>
                                            </div>
                                        </td>

                                        <td className={`${rowClassName} text-center`}>
                                            <Typography className="text-xs font-normal text-blue-gray-500">
                                                {teachers.uid}
                                            </Typography>
                                        </td>

                                        <td className={`${rowClassName} text-center`}>
                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                {new Date(teachers.last_active).toISOString().replace("T", " ").slice(0, 19)}
                                            </Typography>
                                        </td>

                                        <td className={`${rowClassName} text-center`}>
                                            <button
                                                onClick={() => openEditModal(teachers)}
                                                className="text-blue-500 hover:text-blue-700"
                                            >
                                                <PencilSquareIcon className="h-5 w-5" />
                                            </button>
                                        </td>

                                        <td className={`${rowClassName} text-center`}>
                                            <button
                                                onClick={() => confirmDelete(teachers)}
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
                <DialogHeader>Edit User Role</DialogHeader>
                <DialogBody>
                    <Typography className="mb-4">
                        Update role for <strong>{selectedUser?.name}</strong>
                    </Typography>
                    <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="3">Student</option>
                        <option value="2">Admin</option>
                    </select>
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

export default TeacherTable;
