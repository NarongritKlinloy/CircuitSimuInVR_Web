import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Input, Button } from "@material-tailwind/react";

function TeacherModal({ isOpen, toggleModal, teacherData, setTeacherData, onSave }) {
  if (!teacherData) return null;

  return (
    <Dialog open={isOpen} handler={toggleModal}>
      <DialogHeader>{teacherData.name ? "Edit Teacher" : "Add New Teacher"}</DialogHeader>
      <DialogBody>
        <div className="flex flex-col gap-4">
          <Input
            label="Name"
            value={teacherData.name || ""}
            onChange={(e) =>
              setTeacherData({ ...teacherData, name: e.target.value })
            }
          />
          <Input
            label="Email"
            value={teacherData.email || ""}
            onChange={(e) =>
              setTeacherData({ ...teacherData, email: e.target.value })
            }
          />
          <Input
            label="Department"
            value={teacherData.department || ""}
            onChange={(e) =>
              setTeacherData({ ...teacherData, department: e.target.value })
            }
          />
          <Input
            label="Employed Date"
            value={teacherData.date || ""}
            onChange={(e) =>
              setTeacherData({ ...teacherData, date: e.target.value })
            }
          />
        </div>
      </DialogBody>
      <DialogFooter>
        <Button variant="text" color="red" onClick={toggleModal}>
          Cancel
        </Button>
        <Button variant="gradient" color="green" onClick={onSave}>
          {teacherData.name ? "Save" : "Add"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

export default TeacherModal;
