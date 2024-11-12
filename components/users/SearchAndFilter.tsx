import { Search } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'

interface SearchAndFilterProps {
  statusFilter: string
  setStatusFilter: (value: string) => void
  roleFilter: string
  setRoleFilter: (value: string) => void
  onFilter: () => void
  searchTerm: string
  setSearchTerm: (value: string) => void
}

export function SearchAndFilter({
  statusFilter,
  setStatusFilter,
  roleFilter,
  setRoleFilter,
  onFilter,
  searchTerm,
  setSearchTerm
}: SearchAndFilterProps) {
  return (
    <div className="w-full space-y-4 md:space-y-0 md:flex md:justify-between md:items-center mb-4">
      <div className="flex flex-col space-y-4 w-full md:flex-row md:space-y-0 md:space-x-2">
        <div className="relative w-full md:w-[300px]">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by Users Name or Email"
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="blocked">Blocked</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="moderator">Moderator</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

export default SearchAndFilter