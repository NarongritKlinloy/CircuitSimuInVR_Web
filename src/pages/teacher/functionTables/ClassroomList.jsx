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
    UserPlusIcon,
    PlusCircleIcon,
} from "@heroicons/react/24/solid";

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { countStudentAPI } from "@/data/student-count";

function ClassroomList({ classrooms }) {

    //นับจำนวน student
    // const [studentCount, setStudentCount] = useState({});
    // useEffect(() => {
    //     const fetchStudentCounts = async () => {
    //         const countPromises = classrooms.map(async (classroom) => {
    //             const count = await countStudentAPI(classroom.class_id);
    //             return { [classroom.class_id]: count };
    //         });

    //         const counts = await Promise.all(countPromises);
    //         setStudentCount(Object.assign({}, ...counts));
    //     };

    //     fetchStudentCounts();
    // }, [classrooms]);

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
                                    "no.",
                                    "classname",
                                    "sec",
                                    "semester",
                                    "year",
                                    "practice",
                                    "open",
                                    "close",
                                    "edit practice"
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
                                                        {key + 1}
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
                                                    {/* {studentCount[class_id]} */}
                                                    -
                                                </Typography>
                                            </td>
                                            <td className={`${rowClassName} text-center`}>
                                                <Typography className="text-s font-normal text-blue-gray-500">
                                                    {/* {studentCount[class_id]} */}
                                                    -
                                                </Typography>
                                            </td>
                                            <td className={`${rowClassName} text-center`}>
                                                <Typography className="text-s font-normal text-blue-gray-500">
                                                    {/* {studentCount[class_id]} */}
                                                    -
                                                </Typography>
                                            </td>

                                            {/* edit classroom practice Button */}
                                            <td className={`${rowClassName} text-center`}>
                                                <Link
                                                    to={`/teacher/practice_classroom/${class_name} (${sec})`}
                                                    className="text-green-500 hover:text-green-700"
                                                    onClick={() => {
                                                        sessionStorage.setItem("class_id", class_id);
                                                    }}
                                                >
                                                    <PencilSquareIcon className="h-5 w-5 mx-auto" />
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                }
                            )}
                        </tbody>
                    </table>
                </CardBody>
            </Card>
        </div>
    );
}
export default ClassroomList;