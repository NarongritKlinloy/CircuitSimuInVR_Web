import React, { useState } from "react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Card, CardHeader, CardBody, Typography, Avatar, Chip, Dialog, DialogHeader, DialogBody, DialogFooter, Button } from "@material-tailwind/react";
import Swal from "sweetalert2";

function AuthorsTable({ authors, onEditClick, onDelete }) {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedRole, setSelectedRole] = useState("");

    const openEditModal = (user) => {
        setSelectedUser(user);
        setSelectedRole(user.role_id || "Student"); // กำหนดค่าเริ่มต้นจาก role_id
        setIsEditOpen(true);
    };

    const closeEditModal = () => {
        setIsEditOpen(false);
        setSelectedUser(null);
    };

    const handleSaveEdit = () => {
        console.log(`Updated role for ${selectedUser.name} to ${selectedRole}`);
        Swal.fire({
            title: "Updated!",
            text: `${selectedUser.name}'s role has been updated to ${selectedRole}.`,
            icon: "success",
            confirmButtonText: "OK",
            customClass: {
                confirmButton: "bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600",
            },
        });
        closeEditModal();
    };

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
                    icon: "success",
                    confirmButtonText: "OK",
                    customClass: {
                        confirmButton: "bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600",
                    },
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

                <CardBody className="overflow-x-auto pt-0 pb-2">
                    <table className="w-full min-w-[640px] table-auto border-collapse">
                        <thead>
                            <tr>
                                {["Name", "Email", "Status", "Last Active", "", ""].map((header, index) => (
                                    <th
                                        key={index} // ใช้ index เป็น key
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

                        <tbody>
                            {authors.map((user, key) => {
                                const isLast = key === authors.length - 1;
                                const rowClassName = `py-3 px-5 align-middle ${
                                    isLast ? "" : "border-b border-blue-gray-50"
                                }`;

                                return (
                                    <tr key={user.uid}> {/* ใช้ uid เป็น key */}
                                        <td className={`${rowClassName} text-left`}>
                                            <div className="flex items-center gap-4">
                                                <Avatar
                                                    src={user.img || "https://via.placeholder.com/150"} // ใช้รูปเริ่มต้นหากไม่มีรูป
                                                    alt={user.name}
                                                    size="sm"
                                                    variant="rounded"
                                                />
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-semibold"
                                                >
                                                    {user.name}
                                                </Typography>
                                            </div>
                                        </td>

                                        <td className={`${rowClassName} text-center`}>
                                            <Typography className="text-xs font-normal text-blue-gray-500">
                                                {user.uid}
                                            </Typography>
                                        </td>

                                        <td className={`${rowClassName} text-center`}>
                                            <Chip
                                                variant="gradient"
                                                color={user.online ? "green" : "blue-gray"}
                                                value={user.online ? "ONLINE" : "OFFLINE"}
                                                className="py-0.5 px-2 text-[11px] font-medium w-fit mx-auto"
                                            />
                                        </td>

                                        <td className={`${rowClassName} text-center`}>
                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                {user.last_active}
                                            </Typography>
                                        </td>

                                        <td className={`${rowClassName} text-center`}>
                                            <button
                                                onClick={() => openEditModal(user)}
                                                className="text-blue-500 hover:text-blue-700"
                                            >
                                                <PencilSquareIcon className="h-5 w-5" />
                                            </button>
                                        </td>

                                        <td className={`${rowClassName} text-center`}>
                                            <button
                                                onClick={() => confirmDelete(user.name)}
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
