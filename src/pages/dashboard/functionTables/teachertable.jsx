import React from "react";
import { Card, CardHeader, CardBody, Typography, Avatar, Chip } from "@material-tailwind/react";

function TeacherTable({ teachers, onEditClick }) {
  return (
    <Card>
      <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
        <Typography variant="h6" color="white">
          Teacher Table
        </Typography>
      </CardHeader>
      <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
        <table className="w-full min-w-[640px] table-auto">
          <thead>
            <tr>
              {["Name", "Email", "Department", "Status", "Last Active", ""].map((el) => (
                <th
                  key={el}
                  className="border-b border-blue-gray-50 py-3 px-5 text-left"
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
            {teachers.map(({ img, name, email, department, online, date }, key) => {
              const className = `py-3 px-5 ${
                key === teachers.length - 1 ? "" : "border-b border-blue-gray-50"
              }`;
              return (
                <tr key={name}>
                  <td className={className}>
                    <div className="flex items-center gap-4">
                      <Avatar src={img} alt={name} size="sm" variant="rounded" />
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-semibold"
                      >
                        {name}
                      </Typography>
                    </div>
                  </td>
                  <td className={className}>
                    <Typography className="text-xs font-normal text-blue-gray-500">
                      {email}
                    </Typography>
                  </td>
                  <td className={className}>
                    <Typography className="text-xs font-normal text-blue-gray-500">
                      {department}
                    </Typography>
                  </td>
                  <td className={className}>
                    <Chip
                      variant="gradient"
                      color={online ? "green" : "blue-gray"}
                      value={online ? "online" : "offline"}
                      className="py-0.5 px-2 text-[11px] font-medium w-fit"
                    />
                  </td>
                  <td className={className}>
                    <Typography className="text-xs font-semibold text-blue-gray-600">
                      {date}
                    </Typography>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </CardBody>
    </Card>
  );
}

export default TeacherTable;
