import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Loader2, RefreshCw, Plus, ArrowLeft, ArrowRight, MoreHorizontal, Eye, Edit, Ban, Trash, LucideEye, EyeClosed } from "lucide-react";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  role: string;
  isVerifiedUser: boolean;
  isBlocked: boolean;
  image?: string;
  updatedAt: string;
}

interface UserTableProps {
  users: User[];
  setSelectedUser: (id: string) => void;
  onDeleteUser: (id: string) => void;
  onToggleBlock: (id: string) => void;
  isLoading?: boolean;
  openProfileDialog: (id: string, mode: 'view' | 'edit') => void;
  title?: string;
  description?: string;
  itemsPerPage?: number;
  onRefresh?: () => Promise<void>;
  addButton?: {
    label: string;
    onClick: () => void;
  };
  analyticsCards?: React.ReactNode;
}

export function EnhancedUserTable({
  users,
  setSelectedUser,
  onDeleteUser,
  onToggleBlock,
  isLoading = false,
  openProfileDialog,
  title = "Users",
  description,
  itemsPerPage = 10,
  onRefresh,
  addButton,
  analyticsCards,
}: UserTableProps) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filteredUsers, setFilteredUsers] = React.useState<User[]>(users);
  const [refreshing, setRefreshing] = React.useState(false);

  React.useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter((user) => {
        const searchString = `${user.firstName} ${user.lastName} ${user.email} ${user.role}`.toLowerCase();
        return searchString.includes(searchTerm.toLowerCase());
      });
      setFilteredUsers(filtered);
      setCurrentPage(1);
    } else {
      setFilteredUsers(users);
    }
  }, [users, searchTerm]);

  const handleRefresh = async () => {
    if (onRefresh) {
      setRefreshing(true);
      await onRefresh();
      setRefreshing(false);
    }
  };

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  const renderLoadingSkeleton = () => (
    <TableRow>
      <TableCell colSpan={6} className="text-center py-12">
        <div className="flex items-center justify-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-muted-foreground">Loading users...</span>
        </div>
      </TableCell>
    </TableRow>
  );

  return (
    <div className="space-y-8">
      {analyticsCards && (
        <div className="grid gap-6 md:grid-cols-3">
          {analyticsCards}
        </div>
      )}

      <Card className="w-full bg-card shadow-lg border-0">
        {(title || description) && (
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                {title && (
                  <CardTitle className="text-2xl font-bold">
                    {title}
                  </CardTitle>
                )}
                {description && (
                  <CardDescription className="text-muted-foreground">
                    {description}
                  </CardDescription>
                )}
              </div>
              {onRefresh && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="hover:bg-primary/10"
                >
                  {refreshing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
          </CardHeader>
        )}

        <CardContent>
          <div className="flex justify-between items-center mb-6 gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-background/50 border-border/50 focus:border-primary"
              />
            </div>
            {addButton && (
              <Button 
                onClick={addButton.onClick}
                className="shadow-sm bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Plus className="mr-2 h-4 w-4" />
                {addButton.label}
              </Button>
            )}
          </div>

          <div className="rounded-lg border border-border/50 overflow-hidden bg-background/50">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-muted/50">
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  renderLoadingSkeleton()
                ) : currentItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      <span className="text-muted-foreground">No users found</span>
                    </TableCell>
                  </TableRow>
                ) : (
                  currentItems.map((user) => (
                    <TableRow key={user.id} className="group hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <Avatar>
                            <AvatarImage src={user.image} />
                            <AvatarFallback>{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
                          </Avatar>
                          <span>{`${user.firstName} ${user.lastName}`}</span>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>
                        <Badge variant={user.isVerifiedUser ? 'default' : user.isBlocked ? 'destructive' : 'secondary'}>
                          {user.isVerifiedUser ? 'Active' : user.isBlocked ? 'Blocked' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(user.updatedAt).toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <Eye className="mr-2 h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openProfileDialog(user.id, 'view')}>
                              <EyeClosed className="mr-2 h-4 w-4" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openProfileDialog(user.id, 'edit')}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onToggleBlock(user.id)}>
                              <Ban className="mr-2 h-4 w-4" />
                              {user.isBlocked ? 'Unblock User' : 'Block User'}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onDeleteUser(user.id)} className="text-red-600">
                              <Trash className="mr-2 h-4 w-4" />
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6">
              <span className="text-sm text-muted-foreground">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredUsers.length)} of {filteredUsers.length} users
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="gap-1"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <Button
                      key={pageNum}
                      variant={pageNum === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className="w-8 h-8 p-0"
                    >
                      {pageNum}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="gap-1"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default EnhancedUserTable;