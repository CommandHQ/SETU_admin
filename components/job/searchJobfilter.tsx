import React from 'react';
import { Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface SearchAndFilterProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  searchFilter: "title" | "company" | "location";
  setSearchFilter: (value: "title" | "company" | "location") => void;
}

export function SearchAndFilter({
  searchTerm,
  setSearchTerm,
  searchFilter,
  setSearchFilter,
}: SearchAndFilterProps) {
  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-4 items-start sm:items-center">
        <div className="relative flex flex-col sm:flex-row w-full sm:w-auto gap-4 sm:gap-4">
          {/* Search Input with Icon */}
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Search by ${searchFilter}...`}
              className="w-full sm:w-[200px] pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Search Filter Select */}
          <Select 
            value={searchFilter} 
            onValueChange={(value) => setSearchFilter(value as "title" | "company" | "location")}
          >
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Search in..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title">Job Title</SelectItem>
              <SelectItem value="company">Company</SelectItem>
              <SelectItem value="location">Location</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

export default SearchAndFilter;