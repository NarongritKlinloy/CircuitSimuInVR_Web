import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Chip,
  Input,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { authorsTableData } from "@/data";

export function Tables() {
  const [search, setSearch] = useState(""); // คำค้นหา
  const [authors, setAuthors] = useState(authorsTableData); // เก็บรายชื่อผู้ใช้
  const [isAddOpen, setIsAddOpen] = useState(false); // สถานะ modal สำหรับเพิ่มข้อมูล
  const [isEditOpen, setIsEditOpen] = useState(false); // สถานะ modal สำหรับแก้ไขข้อมูล
  const [editingAuthor, setEditingAuthor] = useState(null); // ผู้ใช้ที่กำลังแก้ไข
  const [newAuthor, setNewAuthor] = useState({
    name: "",
    email: "",
    job: ["", ""],
    online: false,
    date: "",
  }); // รายละเอียดผู้ใช้ใหม่

  // ฟังก์ชันกรองข้อมูล Authors Table
  const filteredAuthors = authors.filter(({ name, email }) =>
    [name, email].some((field) =>
      field.toLowerCase().includes(search.toLowerCase())
    )
  );

  // ฟังก์ชันเปิด/ปิด modal สำหรับเพิ่ม
  const toggleAddModal = () => setIsAddOpen(!isAddOpen);

  // ฟังก์ชันเปิด/ปิด modal สำหรับแก้ไข
  const toggleEditModal = () => setIsEditOpen(!isEditOpen);

  // ฟังก์ชันเพิ่มผู้ใช้ใหม่
  const handleAddAuthor = () => {
    setAuthors([...authors, newAuthor]); // เพิ่มข้อมูลใหม่ในลิสต์
    setNewAuthor({ name: "", email: "", job: ["", ""], online: false, date: "" }); // รีเซ็ตฟอร์ม
    toggleAddModal(); // ปิด modal
  };

  // ฟังก์ชันเปิด modal พร้อมโหลดข้อมูลสำหรับแก้ไข
  const handleEditClick = (author) => {
    setEditingAuthor(author); // ตั้งค่าผู้ใช้ที่กำลังแก้ไข
    toggleEditModal(); // เปิด modal
  };

  // ฟังก์ชันอัปเดตข้อมูลผู้ใช้
  const handleEditAuthor = () => {
    setAuthors((prevAuthors) =>
      prevAuthors.map((author) =>
        author.name === editingAuthor.name ? editingAuthor : author
      )
    );
    toggleEditModal(); // ปิด modal
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      {/* ช่องค้นหาและปุ่ม Add */}
      <Card>
        <div className="flex items-center justify-between p-4">
          <div className="md:w-56">
            <Input
              label="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="gradient" color="green" onClick={toggleAddModal}>
            Add
          </Button>
        </div>
      </Card>

      {/* Authors Table */}
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Authors Table
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["author", "function", "status", "employed", ""].map((el) => (
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
              {filteredAuthors.map(
                ({ img, name, email, job, online, date }, key) => {
                  const className = `py-3 px-5 ${
                    key === filteredAuthors.length - 1
                      ? ""
                      : "border-b border-blue-gray-50"
                  }`;

                  return (
                    <tr key={name}>
                      <td className={className}>
                        <div className="flex items-center gap-4">
                          <Avatar src={img} alt={name} size="sm" variant="rounded" />
                          <div>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold"
                            >
                              {name}
                            </Typography>
                            <Typography className="text-xs font-normal text-blue-gray-500">
                              {email}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {job[0]}
                        </Typography>
                        <Typography className="text-xs font-normal text-blue-gray-500">
                          {job[1]}
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
                      <td className={className}>
                        <Typography
                          as="a"
                          href="#"
                          className="text-xs font-semibold text-blue-gray-600"
                          onClick={() =>
                            handleEditClick({
                              img,
                              name,
                              email,
                              job,
                              online,
                              date,
                            })
                          }
                        >
                          Edit
                        </Typography>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </CardBody>
      </Card>

      {/* Modal สำหรับเพิ่มข้อมูลใหม่ */}
      <Dialog open={isAddOpen} handler={toggleAddModal}>
        <DialogHeader>Add New Author</DialogHeader>
        <DialogBody>
          <div className="flex flex-col gap-4">
            <Input
              label="Name"
              value={newAuthor.name}
              onChange={(e) =>
                setNewAuthor({ ...newAuthor, name: e.target.value })
              }
            />
            <Input
              label="Email"
              value={newAuthor.email}
              onChange={(e) =>
                setNewAuthor({ ...newAuthor, email: e.target.value })
              }
            />
            <Input
              label="Job Title"
              value={newAuthor.job[0]}
              onChange={(e) =>
                setNewAuthor({ ...newAuthor, job: [e.target.value, newAuthor.job[1]] })
              }
            />
            <Input
              label="Department"
              value={newAuthor.job[1]}
              onChange={(e) =>
                setNewAuthor({ ...newAuthor, job: [newAuthor.job[0], e.target.value] })
              }
            />
            <Input
              label="Employed Date"
              value={newAuthor.date}
              onChange={(e) =>
                setNewAuthor({ ...newAuthor, date: e.target.value })
              }
            />
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" onClick={toggleAddModal}>
            Cancel
          </Button>
          <Button variant="gradient" color="green" onClick={handleAddAuthor}>
            Add
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Modal สำหรับแก้ไขข้อมูล */}
      <Dialog open={isEditOpen} handler={toggleEditModal}>
        <DialogHeader>Edit Author</DialogHeader>
        <DialogBody>
          <div className="flex flex-col gap-4">
            <Input
              label="Name"
              value={editingAuthor?.name || ""}
              onChange={(e) =>
                setEditingAuthor({ ...editingAuthor, name: e.target.value })
              }
            />
            <Input
              label="Email"
              value={editingAuthor?.email || ""}
              onChange={(e) =>
                setEditingAuthor({ ...editingAuthor, email: e.target.value })
              }
            />
            <Input
              label="Job Title"
              value={editingAuthor?.job[0] || ""}
              onChange={(e) =>
                setEditingAuthor({
                  ...editingAuthor,
                  job: [e.target.value, editingAuthor.job[1]],
                })
              }
            />
            <Input
              label="Department"
              value={editingAuthor?.job[1] || ""}
              onChange={(e) =>
                setEditingAuthor({
                  ...editingAuthor,
                  job: [editingAuthor.job[0], e.target.value],
                })
              }
            />
            <Input
              label="Employed Date"
              value={editingAuthor?.date || ""}
              onChange={(e) =>
                setEditingAuthor({ ...editingAuthor, date: e.target.value })
              }
            />
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" onClick={toggleEditModal}>
            Cancel
          </Button>
          <Button variant="gradient" color="green" onClick={handleEditAuthor}>
            Save
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default Tables;
