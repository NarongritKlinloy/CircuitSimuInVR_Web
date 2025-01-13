import React from "react";
import { Card, CardHeader, CardBody, Typography, Avatar, Switch } from "@material-tailwind/react";
import Swal from "sweetalert2";

function PracticeTable({ practice, onStatusChange }) {
  const switchCheck = (e, practiceItem) => {
    const isChecked = e.target.checked;

    if (isChecked) {
      Swal.fire({
        title: "Practice Status",
        text: "Practice is on",
        confirmButtonColor: "#3085d6",
        icon: "success",
      }).then(() => {
        onStatusChange(practiceItem.id, true); // Update status to true
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
          Swal.fire({
            title: "Practice Status",
            text: "Practice is closed",
            confirmButtonColor: "#3085d6",
            icon: "success",
          }).then(() => {
            onStatusChange(practiceItem.id, false); // Update status to false
          });
        } else if (result.isDismissed) {
          e.target.checked = true; // Keep the switch on
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

        <CardBody className="overflow-x-scroll pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Name", "Detail", "Create Date", "Status"].map((el) => (
                  <th
                    key={el}
                    className="border-b border-blue-gray-50 px-5 text-left"
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
              {practice.map(({ id, name, detail, date, status }, key) => {
                // const className = `py-3 px-5 ${
                //   key === practice.length - 1 ? "" : "border-b border-blue-gray-50"
                // }`;
                const isLast = key === practice.length - 1;
                const rowClassName = `py-3 px-5 align-middle ${isLast ? "" : "border-b border-blue-gray-50"}`;

                return (
                  <tr key={id}>
                    {/* <td className={className}> */}
                    <td className={`${rowClassName}`}>
                      <div className="flex items-center gap-4">
                        <Typography variant="small" color="blue-gray" className="font-semibold">
                          {id}
                        </Typography>
                        {name}
                      </div>
                    </td>

                    <td className={`${rowClassName}`}>
                      <Typography className="text-xs font-normal text-blue-gray-500">
                        {detail}
                      </Typography>
                    </td>
                    <td className={`${rowClassName}`}>
                      <Typography className="text-xs font-normal text-blue-gray-500">
                        {date}
                      </Typography>
                    </td>

                    <td className={`${rowClassName}`}>
                      <Switch
                        checked={status}
                        onClick={(e) => switchCheck(e, { id, name, detail, date, status })}
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
