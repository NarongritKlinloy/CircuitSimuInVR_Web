import React from "react";
import { Card, Input } from "@material-tailwind/react";

function SearchAdmin({ searchTerm, setSearchTerm }) {
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
      </div>
    </Card>
  );
}

export default SearchAdmin;
