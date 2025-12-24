'use client'

import { useState } from 'react'
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '@/hooks/use-users'
import { LoadingSpinner, TableSkeleton, ErrorMessage } from '@/components/ui/loading'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CreateUserData, User } from '@/types'
import { Card, CardContent } from './ui/card'
import { Badge } from "@/components/ui/badge"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Label } from './ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"



export function UserManagement() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState<CreateUserData>({
    name: '',
    email: '',
    role: 'User'
  })

  const { data: users, isLoading, error, refetch } = useUsers()
  const createUser = useCreateUser()
  const updateUser = useUpdateUser()
  const deleteUser = useDeleteUser()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingUser) {
        const result = await updateUser.mutateAsync({ ...formData, id: editingUser.id })
        alert('User updated successfully!')
      } else {
        const result = await createUser.mutateAsync(formData)
        alert('User created successfully!')
      }
      
      setFormData({ name: '', email: '', role: 'User' })
      setIsFormOpen(false)
      setEditingUser(null)
    } catch (error) {
      console.error('Error saving user:', error)
      alert('Failed to save user. Check console for details.')
    }
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role
    })
    setIsFormOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser.mutateAsync(id)
        alert('User deleted successfully!')
      } catch (error) {
        console.error('Error deleting user:', error)
        alert('Failed to delete user. Check console for details.')
      }
    }
  }

  if (isLoading) return <TableSkeleton />
  if (error) return <ErrorMessage message="Failed to load users" onRetry={() => refetch()} />

  // return (
  //   <div className="space-y-6">
  //     <div className="flex justify-between items-center">
  //       <h2 className="text-2xl font-bold">User Management</h2>
  //       <Button onClick={() => setIsFormOpen(true)}>Add User</Button>
  //     </div>

  //     {isFormOpen && (
  //       <div className="bg-white p-6 rounded-lg shadow-sm border">
  //         <h3 className="text-lg font-medium mb-4">
  //           {editingUser ? 'Edit User' : 'Add New User'}
  //         </h3>
  //         <form onSubmit={handleSubmit} className="space-y-4">
  //           <div>
  //             <label className="block text-sm font-medium mb-1">Name</label>
  //             <Input
  //               value={formData.name}
  //               onChange={(e) => setFormData({ ...formData, name: e.target.value })}
  //               required
  //             />
  //           </div>
  //           <div>
  //             <label className="block text-sm font-medium mb-1">Email</label>
  //             <Input
  //               type="email"
  //               value={formData.email}
  //               onChange={(e) => setFormData({ ...formData, email: e.target.value })}
  //               required
  //             />
  //           </div>
  //           <div>
  //             <label className="block text-sm font-medium mb-1">Role</label>
  //             <select
  //               value={formData.role}
  //               onChange={(e) => setFormData({ ...formData, role: e.target.value as 'Admin' | 'User' })}
  //               className="w-full p-2 border rounded-md"
  //             >
  //               <option value="User">User</option>
  //               <option value="Admin">Admin</option>
  //             </select>
  //           </div>
  //           <div className="flex space-x-2">
  //             <Button 
  //               type="submit" 
  //               disabled={createUser.isPending || updateUser.isPending}
  //             >
  //               {createUser.isPending || updateUser.isPending ? (
  //                 <LoadingSpinner />
  //               ) : (
  //                 editingUser ? 'Update' : 'Create'
  //               )}
  //             </Button>
  //             <Button 
  //               type="button" 
  //               variant="outline"
  //               onClick={() => {
  //                 setIsFormOpen(false)
  //                 setEditingUser(null)
  //                 setFormData({ name: '', email: '', role: 'User' })
  //               }}
  //             >
  //               Cancel
  //             </Button>
  //           </div>
  //         </form>
  //       </div>
  //     )}

  //     <div className="bg-white rounded-lg shadow-sm">
  //       <div className="overflow-x-auto">
  //         <table className="w-full">
  //           <thead className="bg-gray-50">
  //             <tr>
  //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
  //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
  //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
  //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
  //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
  //             </tr>
  //           </thead>
  //           <tbody className="divide-y divide-gray-200">
  //             {users?.map((user) => (
  //               <tr key={user.id}>
  //                 <td className="px-6 py-4 text-sm text-gray-900">{user.id}</td>
  //                 <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
  //                 <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
  //                 <td className="px-6 py-4">
  //                   <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
  //                     user.role === 'Admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
  //                   }`}>
  //                     {user.role}
  //                   </span>
  //                 </td>
  //                 <td className="px-6 py-4 text-sm space-x-2">
  //                   <Button
  //                     size="sm"
  //                     variant="outline"
  //                     onClick={() => handleEdit(user)}
  //                   >
  //                     Edit
  //                   </Button>
  //                   <Button
  //                     size="sm"
  //                     variant="destructive"
  //                     onClick={() => handleDelete(user.id)}
  //                     disabled={deleteUser.isPending}
  //                   >
  //                     {deleteUser.isPending ? <LoadingSpinner /> : 'Delete'}
  //                   </Button>
  //                 </td>
  //               </tr>
  //             ))}
  //           </tbody>
  //         </table>
  //       </div>
  //     </div>
  //   </div>
  // )
  return (
  <div className="space-y-6">
    {/* Header */}
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold">User Management</h2>
      <Button onClick={() => setIsFormOpen(true)}>Add User</Button>
    </div>

    {/* Form Dialog */}
    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingUser ? 'Edit User' : 'Add User'}
          </DialogTitle>
          <DialogDescription>
            Fill in the user details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Role</Label>
            <Select
              value={formData.role}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  role: value as 'Admin' | 'User',
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="User">User</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsFormOpen(false)
                setEditingUser(null)
                setFormData({ name: '', email: '', role: 'User' })
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createUser.isPending || updateUser.isPending}
            >
              {createUser.isPending || updateUser.isPending ? (
                <LoadingSpinner />
              ) : editingUser ? (
                'Update'
              ) : (
                'Create'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>

  
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {users?.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell className="font-medium">
                  {user.name}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      user.role === 'Admin' ? 'secondary' : 'outline'
                    }
                  >
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(user)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(user.id)}
                    disabled={deleteUser.isPending}
                  >
                    {deleteUser.isPending ? (
                      <LoadingSpinner />
                    ) : (
                      'Delete'
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
)

}