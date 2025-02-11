import React from "react";
import { Card, CardHeader, CardBody, Typography, Switch } from "@material-tailwind/react";
import Swal from "sweetalert2";
import { updatePracticeStatusAPI } from "@/data/change-status-practice";

function PracticeTable({ practice, onStatusChange, checkStatus}) {

  const switchCheck = (e, practiceItem) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      updatePracticeStatusAPI(practiceItem.practice_id, practiceItem.practice_status);
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
          updatePracticeStatusAPI(practiceItem.practice_id, practiceItem.practice_status);
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
            Practice Table
          </Typography>
        </CardHeader>

        <CardBody className="overflow-x-auto pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto border-collapse">
            <thead>
              <tr>
                {["No.", "Name", "Detail", "Create Date", "Status"].map((el) => (
                  <th
                    key={el}
                    className={`border-b border-blue-gray-50 px-5 py-2 ${el === "Name" || el === "Detail"
                      ? "text-left" 
                      : "text-center"
                    }`}
                  >
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-blue-gray-400"
                    >
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {practice.map((data, key) => {
                const isLast = key === practice.length - 1;
                const rowClassName = `py-3 px-5 align-middle ${isLast ? "" : "border-b border-blue-gray-50"}`;

                return (
                  <tr key={data.practice_id}>
                    <td className={`${rowClassName} text-center`}>
                      <div className="flex justify-center items-center gap-4">
                        <div>
                          <Typography variant="small" color="blue-gray" className="font-semibold">
                            {data.practice_id}
                          </Typography>
                        </div>
                      </div>
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
                        {data.create_date}
                      </Typography>
                    </td>

                    <td className={`${rowClassName}`}>
                      <Switch
                        checked={data.practice_status}
                        onClick={(e) => switchCheck(e, data)}
                      />
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
export default PracticeTable;