import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent} from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { getUserById, updateUser } from '@/services/Users/userActions'
import toast from 'react-hot-toast'

type User = {
  id: string;
  updatedAt: Date;
  email: string | null;
  phone: string;
  role: string;
  image: string;
  category: string;
  firstName: string;
  lastName: string;
  isVerifiedUser: boolean;
  isBlocked: boolean;
  allowEmailNotification: boolean;
};

type DialogMode = 'view' | 'edit';

export function UserProfileDialog({ 
  selectedUser, 
  setSelectedUser, 
  onUserUpdate,
  mode 
}: { 
  selectedUser: string | null, 
  setSelectedUser: (value: string | null) => void,
  onUserUpdate: () => void,
  mode: DialogMode 
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (selectedUser) {
      setIsLoading(true);
      getUserById(selectedUser)
        .then(setUser)
        .finally(() => setIsLoading(false));
    }
  }, [selectedUser]);

  const handleSave = async () => {
    if (user) {
      setIsSaving(true);
      try {
        await updateUser(user);
        onUserUpdate(); // Refresh the user list
        setSelectedUser(null); // Close the dialog
        toast.success("User updated successfully");

      } catch (error) {
        console.error('Failed to update user:', error);
        toast.error("Failed to update user. Please try again.");
      } finally {
        setIsSaving(false);
      }
    }
  };

  const isReadOnly = mode === 'view';

  return (
    <Dialog open={selectedUser !== null} onOpenChange={() => setSelectedUser(null)}>
      <DialogContent className="max-w-7xl">
        <DialogHeader>
          <DialogTitle>{isReadOnly ? 'User Profile' : 'Edit User'}</DialogTitle>
          <DialogDescription>
            {isReadOnly ? 'View user information' : 'Make changes to user profile'}
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-60" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </div>
        ) : user && (
          <Tabs defaultValue="overview" className="w-full">
            <TabsContent value="overview">
              <div className="grid gap-4 py-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={user.image} />
                    <AvatarFallback>{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-bold">{`${user.firstName} ${user.lastName}`}</h2>
                    <p className="text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>User ID</Label>
                    <Input value={user.id} readOnly />
                  </div>
                  <div>
                    <Label>Role</Label>
                    <Select 
                      value={user.role} 
                      onValueChange={(value) => !isReadOnly && setUser({ ...user, role: value })}
                      disabled={isReadOnly}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="moderator">Moderator</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Select
                      value={user.isVerifiedUser ? 'active' : user.isBlocked ? 'blocked' : 'inactive'}
                      onValueChange={(value) =>
                        !isReadOnly && setUser({
                          ...user,
                          isVerifiedUser: value === 'active',
                          isBlocked: value === 'blocked',
                        })
                      }
                      disabled={isReadOnly}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="blocked">Blocked</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Last Active</Label>
                    <Input value={new Date(user.updatedAt).toLocaleString()} readOnly />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => setSelectedUser(null)}>Close</Button>
          {!isReadOnly && (
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

