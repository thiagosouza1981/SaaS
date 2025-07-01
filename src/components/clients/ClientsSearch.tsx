"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface ClientsSearchProps {
  onSearch: (query: string) => void;
  searchQuery: string;
}

export function ClientsSearch({ onSearch, searchQuery }: ClientsSearchProps) {
  const [localQuery, setLocalQuery] = useState(searchQuery);

  const handleSearch = () => {
    onSearch(localQuery);
  };

  const handleClear = () => {
    setLocalQuery("");
    onSearch("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="flex gap-2 mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Buscar por nome, email ou telefone..."
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="pl-10"
        />
      </div>
      <Button onClick={handleSearch} variant="outline">
        Buscar
      </Button>
      {searchQuery && (
        <Button onClick={handleClear} variant="outline" size="icon">
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}