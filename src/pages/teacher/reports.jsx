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
import { TeacherReportData } from "@/data/teacher-report";

export function TeacherReports() {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedDescription, setSelectedDescription] = React.useState("");
  const [report, setReport] = React.useState(TeacherReportData);
  // const [isAddReportOpen, setIsAddReportOpen] = useState(false);
  // const [newReport, setNewReport] = useState({
  //     title: "",
  //     detail: "",
  //     date: ""
  // });
  // const today = new Date();
  // const handleAddReport = () => {
  //   setReport([...reports, newReport]);
  //   setNewReport({ title: "", detail: "", date:today });
  //   setIsAddReportOpen(false);
  // };

  const handleDialogOpen = (detail) => {
    setSelectedDescription(detail);
    setDialogOpen(true);
  };


  return (
    <div className="mx-auto my-20 flex max-w-screen-lg flex-col gap-8">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6 flex justify-between items-center">
          <Typography variant="h6" color="white">
            Report
          </Typography>
          <Button variant="gradient" color="green" >
            new report
          </Button>
        </CardHeader>
        <CardBody className="overflow-x-scroll pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Title", "Detail", "date", "status", ""].map((el) => (
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
              {report.map(({ title, detail, date, status }, key) => {
                const className = `py-3 px-5 ${key === report.length - 1 ? "" : "border-b border-blue-gray-50"
                  }`;

                return (
                  <tr key={title}>
                    <td className={className}>
                      <div className="flex items-center gap-3">
                        <div>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold"
                          >
                            {title}
                          </Typography>
                        </div>
                      </div>
                    </td>

                    <td className={className}>
                      <Typography
                        className="text-xs font-normal text-blue-gray-500 truncate"
                        onClick={() => handleDialogOpen(detail)}
                        style={{ cursor: "pointer" }}
                      >
                        {detail.length > 50
                          ? `${detail.slice(0, 50)}...`
                          : detail}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {date}
                      </Typography>
                    </td>

                    <td className={className}>
                      <Typography
                        className={`text-xs font-semibold ${status?.toLowerCase() === 'success' ? 'text-green-500' : 'text-red-500'
                          }`}
                      >
                        {status}
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

export default TeacherReports;
