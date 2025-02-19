import React, { useState , useEffect } from "react";
import { useParams } from "react-router-dom";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Card, CardHeader, CardBody, Typography, Switch} from "@material-tailwind/react";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { updatePracticeStatusAPI } from "@/data/change-status-practice";

function ClassroomPracticeTable({ practices, checkStatus}) {
    const { classname } = useParams();

    const switchCheck = (e, practiceItem) => {
        const isChecked = e.target.checked;
        if (isChecked) {
          updatePracticeStatusAPI(practiceItem.class_id, practiceItem.practice_id, practiceItem.practice_status);
          checkStatus();
          Swal.fire({
            title: "Practice Status",
            text: "Practice is on",
            confirmButtonColor: "#3085d6",
            icon: "success",
          });
        } else {
          Swal.fire({
            title: "Are you sure?",
            text: "Close this practice",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Confirm",
          }).then((result) => {
            if (result.isConfirmed) {
              updatePracticeStatusAPI(practiceItem.class_id, practiceItem.practice_id, practiceItem.practice_status);
              checkStatus();
              Swal.fire({
                title: "Practice Status",
                text: "Practice is closed",
                confirmButtonColor: "#3085d6",
                icon: "success",
              });
            } else if (result.isDismissed) {
              e.target.checked = true;
              Swal.fire({
                title: "Practice Status",
                text: "Practice is on",
                confirmButtonColor: "#3085d6",
                icon: "warning",
              });
            }
          });
        }
      };

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
                                        className={`border-b border-blue-gray-50 px-5 py-2 
                                            ${header === "name" ? "text-left" : "text-center"}`}
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
                            {practices.map((data, key) => {
                                const isLast = key === practices.length - 1;
                                const rowClassName = `py-3 px-5 align-middle ${isLast ? "" : "border-b border-blue-gray-50"}`;

                                return (
                                    <tr key={data.practice_name}>
                                        <td className={`${rowClassName} text-center`}>
                                            <Typography className="text-s font-normal font-semibold">
                                                {key+1}
                                            </Typography>
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
                                                to={`/teacher/practice_score/${data.class_name} (${data.sec, data.practice_name})`}
                                                className="text-green-500 hover:text-green-700"
                                                onClick={() => {
                                                    sessionStorage.setItem("class_id", data.class_id);
                                                }}
                                            >
                                                <PencilSquareIcon className="h-5 w-5 mx-auto" />
                                            </Link>
                                        </td>
                                        <td className={`${rowClassName}`}>
                                            <div className="flex justify-center">
                                                <Switch
                                                    checked={data.practice_status}
                                                    onClick={(e) => switchCheck(e, data)}
                                                />
                                            </div>
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