import React from "react";
import {
  Typography,
  Alert,
  Card,
  CardHeader,
  CardBody,
  Avatar,
  Chip,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { ReportTableData } from "@/data/report-data";

export function Notifications() {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedDescription, setSelectedDescription] = React.useState("");
  const [report, setReport] = React.useState(ReportTableData);

  const handleDialogOpen = (description) => {
    setSelectedDescription(description);
    setDialogOpen(true);
  };


  return (
    <div className="mx-auto my-20 flex max-w-screen-lg flex-col gap-8">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Report
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Name", "Email", "Description", "Date", "Role", ""].map((el) => (
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
              {report.map(({ img, name, email, description, date, role }, key) => {
                const className = `py-3 px-5 ${key === report.length - 1 ? "" : "border-b border-blue-gray-50"
                  }`;

                return (
                  <tr key={name}>
                    <td className={className}>
                      <div className="flex items-center gap-3">
                        <Avatar src={img} alt={name} size="sm" variant="rounded" />
                        <div>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold"
                          >
                            {name}
                          </Typography>
                        </div>
                      </div>
                    </td>

                    <td className={className}>
                      <Typography className="text-xs font-normal text-blue-gray-500">
                        {email}
                      </Typography>
                    </td>

                    <td className={className}>
                      <Typography
                        className="text-xs font-normal text-blue-gray-500 truncate"
                        onClick={() => handleDialogOpen(description)}
                        style={{ cursor: "pointer" }}
                      >
                        {description.length > 50
                          ? `${description.slice(0, 50)}...`
                          : description}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {date}
                      </Typography>
                    </td>

                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {role}
                      </Typography>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
      </Card>

      <Dialog open={dialogOpen} handler={() => setDialogOpen(false)}>
        <DialogHeader>Detailed Description</DialogHeader>
        <DialogBody>
          <Typography>{selectedDescription}</Typography>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="gradient"
            color="blue"
            onClick={() => setDialogOpen(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default Notifications;