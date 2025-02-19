import React, { useState , useEffect } from "react";
import { useParams } from "react-router-dom";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Select, Option, Card, Input, CardHeader, CardBody, Typography, Dialog, DialogHeader, DialogBody, DialogFooter, Button, select } from "@material-tailwind/react";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";



function ClassroomPracticeTable({ practices }) {
    const { classname } = useParams();

    return (
        <div className="flex flex-col gap-8">
            <Card>
                <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
                    <Typography variant="h6" color="white">
                        Practice Table : { classname }
                    </Typography>
                </CardHeader>

                {/* Table Section */}
                <CardBody className="overflow-x-auto pt-0 pb-2">
                    <table className="w-full min-w-[640px] table-auto border-collapse">
                        <thead>
                            <tr>
                                {["no.", "name", "detail", "assign","submit", "score","status"].map((header) => (
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
                            {practices.map(({ practice_name, practice_detail ,sec, class_id, class_name}, key) => {
                                const isLast = key === practices.length - 1;
                                const rowClassName = `py-3 px-5 align-middle ${isLast ? "" : "border-b border-blue-gray-50"}`;

                                return (
                                    <tr key={practice_name}>
                                        <td className={`${rowClassName} text-center`}>
                                            <Typography className="text-s font-normal font-semibold">
                                                {key+1}
                                            </Typography>
                                        </td>
                                        <td className={`${rowClassName} text-left`}>
                                            <Typography className="text-s font-normal text-blue-gray-500">
                                                {practice_name}
                                            </Typography>
                                        </td>
                                        <td className={`${rowClassName} text-left`}>
                                            <Typography className="text-s font-normal text-blue-gray-500">
                                                {practice_detail}
                                            </Typography>
                                        </td>
                                        <td className={`${rowClassName} text-center`}>
                                            <Typography className="text-s font-normal text-blue-gray-500">
                                                -
                                            </Typography>
                                        </td>
                                        <td className={`${rowClassName} text-center`}>
                                            <Typography className="text-s font-normal text-blue-gray-500">
                                                -
                                            </Typography>
                                        </td>
                                        {/* link to score page */}
                                        <td className={`${rowClassName} text-left`}>
                                            <Link
                                                to={`/teacher/practice_score/${class_name} (${sec,practice_name})`}
                                                className="text-green-500 hover:text-green-700"
                                                onClick={() => {
                                                    sessionStorage.setItem("class_id", class_id);
                                                }}
                                            >
                                                <PencilSquareIcon className="h-5 w-5 mx-auto" />
                                            </Link>
                                        </td>
                                        <td className={`${rowClassName} text-center`}>
                                            <Typography className="text-s font-normal text-blue-gray-500">
                                                toggle
                                            </Typography>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </CardBody>
            </Card>
        </div>
    );
}

export default ClassroomPracticeTable;