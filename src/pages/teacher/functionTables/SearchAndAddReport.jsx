import React from "react";
import { Card, Input, Button } from "@material-tailwind/react";

function SearchAndAddReport({  toggleAddModal, searchTerm, setSearchTerm }) {
  return (
    <Card>
      <div className="flex items-center justify-between p-4">
        <div className="md:w-56">
          <Input
              label="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Button variant="gradient" color="green" onClick={toggleAddModal}>
          New Feedback
          </Button>
        </div>
      </div>
    </Card>
  );
}
 
export default SearchAndAddReport;



