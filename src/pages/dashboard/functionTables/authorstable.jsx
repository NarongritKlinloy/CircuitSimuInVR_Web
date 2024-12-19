import React, { useState } from "react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Card, CardHeader, CardBody, Typography, Avatar, Chip, Dialog, DialogHeader, DialogBody, DialogFooter, Button } from "@material-tailwind/react";
import Swal from "sweetalert2";

function AuthorsTable({ authors, onEditClick, onDelete }) {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedRole, setSelectedRole] = useState("");

    // เปิด Modal และโหลดข้อมูล User ที่เลือก
    const openEditModal = (user) => {
        setSelectedUser(user);
        setSelectedRole(user.role || "Student"); // Set role เริ่มต้น
        setIsEditOpen(true);
    };

    // ปิด Modal
    const closeEditModal = () => {
        setIsEditOpen(false);
        setSelectedUser(null);
    };

    // ฟังก์ชันยืนยันการแก้ไข Role
    const handleSaveEdit = () => {
        console.log(`Updated role for ${selectedUser.name} to ${selectedRole}`);
        Swal.fire({
            title: "Updated!",
            text: `${selectedUser.name}'s role has been updated to ${selectedRole}.`,
            icon: "success",
            confirmButtonText: "OK",
            customClass: {
                confirmButton: 'bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600',
            },
        });
        closeEditModal();
    };

    // ฟังก์ชันยืนยันการลบ
    const confirmDelete = (name) => {
        Swal.fire({
            title: "Are you sure?",
            text: `Do you really want to delete ${name}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Delete",
            cancelButtonText: "Cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                console.log(`Deleted user: ${name}`);
                Swal.fire({
                    title: "Deleted!",
                    text: `${name} has been deleted.`,
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
                        Student Table
                    </Typography>
                </CardHeader>

                {/* Table Section */}
                <CardBody className="overflow-x-auto pt-0 pb-2">
                    <table className="w-full min-w-[640px] table-auto border-collapse">
                        <thead>
                            <tr>
                                {["Name", "Email", "Status", "Last Active", "", ""].map((header) => (
                                    <th
                                        key={header}
                                        className={`border-b border-blue-gray-50 px-5 py-2 ${header === "Name" ? "text-left" : "text-center"}`}
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
                            {authors.map(({ img, name, email, online, date, role }, key) => {
                                const isLast = key === authors.length - 1;
                                const rowClassName = `py-3 px-5 align-middle ${isLast ? "" : "border-b border-blue-gray-50"}`;

                                return (
                                    <tr key={name}>
                                        {/* Name */}
                                        <td className={`${rowClassName} text-left`}>
                                            <div className="flex items-center gap-4">
                                                <Avatar src={img} alt={name} size="sm" variant="rounded" />
                                                <Typography variant="small" color="blue-gray" className="font-semibold">
                                                    {name}
                                                </Typography>
                                            </div>
                                        </td>

                                        {/* Email */}
                                        <td className={`${rowClassName} text-center`}>
                                            <Typography className="text-xs font-normal text-blue-gray-500">
                                                {email}
                                            </Typography>
                                        </td>

                                        {/* Status */}
                                        <td className={`${rowClassName} text-center`}>
                                            <Chip
                                                variant="gradient"
                                                color={online ? "green" : "blue-gray"}
                                                value={online ? "ONLINE" : "OFFLINE"}
                                                className="py-0.5 px-2 text-[11px] font-medium w-fit mx-auto"
                                            />
                                        </td>

                                        {/* Last Active */}
                                        <td className={`${rowClassName} text-center`}>
                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                {date}
                                            </Typography>
                                        </td>

                                        {/* Edit Button */}
                                        <td className={`${rowClassName} text-center`}>
                                            <button
                                                onClick={() => openEditModal({ name, role })}
                                                className="text-blue-500 hover:text-blue-700"
                                            >
                                                <PencilSquareIcon className="h-5 w-5" />
                                            </button>
                                        </td>

                                        {/* Delete Button */}
                                        <td className={`${rowClassName} text-center`}>
                                            <button
                                                onClick={() => confirmDelete(name)}
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
                        <option value="Student">Student</option>
                        <option value="Teacher">Teacher</option>
                        <option value="Admin">Admin</option>
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

export default AuthorsTable;
