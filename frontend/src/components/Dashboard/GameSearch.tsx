import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface GameSearchProps {
  onSearchChange: (query: string) => void;
}

const GameSearch: React.FC<GameSearchProps> = ({ onSearchChange }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    onSearchChange(event.target.value);
  };

  return (
    <div className="flex justify-between items-center mb-4">
      {/* Search Input with Icon */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input 
          className="w-64 bg-[#2A2C35]/80 backdrop-blur-sm border-none text-white pl-10" 
          placeholder="Search by providers"
          value={searchQuery}
          onChange={handleInputChange} 
        />
      </div>
      <Button className="bg-[#2A2C35]/80 backdrop-blur-sm text-white border-none hover:bg-[#3A3C45]/80">
        Sort by: Relevant
      </Button>
    </div>
  );
};

export default GameSearch;
