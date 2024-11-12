"use client"

import { useEffect, useState } from "react"
import { toast } from "react-hot-toast";
import { deleteUser, getUsers, toggleUserBlock } from "@/services/Users/userActions"
import { EnhancedUserTable } from "@/components/users/UserTable"
import { UserProfileDialog } from "@/components/users/UserProfileDialog"
import AnalyticsCard from "@/components/common/moduleAnalyticscard"
import { User } from "@/types"


const UserManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [roleFilter, setRoleFilter] = useState('all')
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [dialogMode, setDialogMode] = useState<'view' | 'edit'>('view')
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [analytics, setAnalytics] = useState({
    total: 0,
    thisMonth: 0,
    recentUpdates: 0
  })


  const calculateAnalytics = () => {
    const total = users.length
    const thisMonth = users.filter(
      user => new Date(user.createdAt).getMonth() === new Date().getMonth()
    ).length
    const recentUpdates = users.filter(
      user => new Date(user.updatedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length

    setAnalytics({ total, thisMonth, recentUpdates })
  }

  useEffect(() => {
    loadUsers()
  }, [searchTerm, statusFilter, roleFilter])

  useEffect(() => {
    calculateAnalytics()
  }, [users])

  const loadUsers = async () => {
    setIsLoading(true)
    try {
      const { users: fetchedUsers } = await getUsers(1, searchTerm, statusFilter, roleFilter)
      setUsers(fetchedUsers as any)
    } catch (error) {
      console.error('Failed to load users:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = async () => {
    await loadUsers()
  }

  const handleAddUser = () => {
    setSelectedUser(null)
    setDialogMode('edit')
  }

  const handleDeleteUser = async (id: string) => {
    try {
      await deleteUser(id)
      toast.success("User Deleted successfully");
      await loadUsers()
    } catch (error) {
      console.error('Failed to delete user:', error)
      toast.error("Failed to delete user. Please try again.");
    }
  }

  const handleToggleBlock = async (id: string) => {
    try {
      await toggleUserBlock(id)
      toast.success("User Blocked successfully");
      await loadUsers()
    } catch (error) {
      console.error('Failed to toggle user block status:', error)
      toast.error("Failed to block user status");
    }
  }
   
  const openProfileDialog = (userId: string, mode: 'view' | 'edit') => {
    setSelectedUser(userId)
    setDialogMode(mode)
  }

  const handleCloseDialog = () => {
    setSelectedUser(null)
    setDialogMode('view')
  }
  
  return (
    <div className="p-8 space-y-6 w-full h-screen bg-slate-100">
      <div className="mb-6">
        <AnalyticsCard
          total={analytics.total}
          thisMonth={analytics.thisMonth}
          recentUpdates={analytics.recentUpdates}
        />
      </div>

      <EnhancedUserTable
        users={users}
        setSelectedUser={setSelectedUser}
        onDeleteUser={handleDeleteUser}
        onToggleBlock={handleToggleBlock}
        isLoading={isLoading}
        openProfileDialog={openProfileDialog}
        title="User Management"
        description="Manage and organize users in your system"
        onRefresh={handleRefresh}
      />
      
      <UserProfileDialog
        selectedUser={selectedUser}
        setSelectedUser={handleCloseDialog}
        onUserUpdate={loadUsers}
        mode={dialogMode}
      />
    </div>
  )
}

export default UserManagementPage