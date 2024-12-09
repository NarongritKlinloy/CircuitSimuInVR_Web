import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Input, Button } from "@material-tailwind/react";

function authormodal({ isOpen, toggleModal, authorData, setAuthorData, onSave }) {
  if (!authorData) return null;

  return (
    <Dialog open={isOpen} handler={toggleModal}>
      <DialogHeader>{authorData.name ? "Edit Author" : "Add New Author"}</DialogHeader>
      <DialogBody>
        <div className="flex flex-col gap-4">
          <Input
            label="Name"
            value={authorData.name || ""}
            onChange={(e) =>
              setAuthorData({ ...authorData, name: e.target.value })
            }
          />
          <Input
            label="Email"
            value={authorData.email || ""}
            onChange={(e) =>
              setAuthorData({ ...authorData, email: e.target.value })
            }
          />
          <Input
            label="Job Title"
            value={authorData.job[0] || ""}
            onChange={(e) =>
              setAuthorData({ ...authorData, job: [e.target.value, authorData.job[1]] })
            }
          />
          <Input
            label="Department"
            value={authorData.job[1] || ""}
            onChange={(e) =>
              setAuthorData({ ...authorData, job: [authorData.job[0], e.target.value] })
            }
          />
          <Input
            label="Employed Date"
            value={authorData.date || ""}
            onChange={(e) =>
              setAuthorData({ ...authorData, date: e.target.value })
            }
          />
        </div>
      </DialogBody>
      <DialogFooter>
        <Button variant="text" color="red" onClick={toggleModal}>
          Cancel
        </Button>
        <Button variant="gradient" color="green" onClick={onSave}>
          {authorData.name ? "Save" : "Add"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

export default authormodal;
