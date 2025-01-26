import React from "react";
import { Card, Input, Button } from "@material-tailwind/react";

function SearchAndAdd({ search, setSearch, toggleAddModal }) {
  return (
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
  );
}
export default SearchAndAdd;
