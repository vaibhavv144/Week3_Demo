"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
  Users,
  FileText,
} from "lucide-react";
import { useState } from "react";
import { UserManagement } from "@/components/user-management";
import { PostManagement } from "@/components/post-management";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";

import { User } from "@/types";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "dashboard",
    icon: Home,
  },
  {
    title: "Users",
    url: "users",
    icon: Users,
  },
  {
    title: "Posts",
    url: "posts",
    icon: FileText,
  },
  {
    title: "Calendar",
    url: "calendar",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "search",
    icon: Search,
  },
  {
    title: "Settings",
    url: "settings",
    icon: Settings,
  },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const users = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "User" },
  ];

  const stats = [
    { title: "Total Users", value: "1,234", change: "+12%" },
    { title: "Revenue", value: "$45,678", change: "+8%" },
    { title: "Orders", value: "892", change: "+23%" },
    { title: "Growth", value: "18.2%", change: "+4%" },
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-100">
        {/* Navbar */}
        <nav className="bg-white shadow-sm border-b px-6 py-4 fixed top-0 left-0 right-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <SidebarTrigger />
              <h1 className="text-xl font-semibold">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome</span>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar>
                    <AvatarImage src="https://github.com/maxleiter.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Billing</DropdownMenuItem>
                  <DropdownMenuItem>Team</DropdownMenuItem>
                  <DropdownMenuItem>Subscription</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </nav>

        <div className="flex pt-16">
          {/* Sidebar */}
          <Sidebar
            collapsible="icon"
            className="fixed left-0 top-16 h-[calc(100vh-4rem)] "
          >
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Application</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          isActive={activeTab === item.url}
                        >
                          <button onClick={() => setActiveTab(item.url)}>
                            <item.icon />
                            <span>{item.title}</span>
                          </button>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>

          {/* Main Content */}
          <main className="p-8 bg-white">
            {activeTab === "dashboard" && (
              <>
                {/* Stats Cards */}
                {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {stats.map((stat, index) => (
                    <div
                      key={index}
                      className="bg-white p-6 rounded-lg shadow-sm"
                    >
                      <h3 className="text-sm font-medium text-gray-500">
                        {stat.title}
                      </h3>
                      <div className="mt-2 flex items-baseline">
                        <p className="text-2xl font-semibold text-gray-900">
                          {stat.value}
                        </p>
                        <span className="ml-2 text-sm font-medium text-green-600">
                          {stat.change}
                        </span>
                      </div>
                    </div>
                  ))}
                </div> */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {stats.map((stat, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          {stat.title}
                        </CardTitle>
                      </CardHeader>

                      <CardContent>
                        <div className="flex items-baseline gap-2">
                          <p className="text-2xl font-semibold">{stat.value}</p>

                          {stat.change && (
                            <span className="text-sm font-medium text-green-600">
                              {stat.change}
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Users</CardTitle>
                  </CardHeader>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Users</CardTitle>
                  </CardHeader>

                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>{user.id}</TableCell>
                            <TableCell className="font-medium">
                              {user.name}
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  user.role === "Admin"
                                    ? "secondary"
                                    : "outline"
                                }
                              >
                                {user.role}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
                {/* Data Table */}
                {/* <div className="bg-white rounded-lg shadow-sm">
                  <div className="px-6 py-4 border-b">
                    <h2 className="text-lg font-medium">Recent Users</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {users.map((user) => (
                          <tr key={user.id}>
                            <td className="px-6 py-4 text-sm text-gray-900">{user.id}</td>
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                            <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'Admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                {user.role}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div> */}
                <div className="bg-white rounded-lg shadow-sm mt-8 p-6">
                  <FieldSet>
                    <FieldLegend>Add new User</FieldLegend>
                    <FieldDescription>
                      Fill the form below to add a new user to the system.
                    </FieldDescription>
                    <FieldGroup>
                      <Field>
                        <FieldLabel htmlFor="street">Name </FieldLabel>
                        <Input id="street" type="text" placeholder="John Doe" />
                      </Field>
                      <div className="grid grid-cols-2 gap-4">
                        <Field>
                          <FieldLabel htmlFor="city">Email</FieldLabel>
                          <Input
                            id="city"
                            type="text"
                            placeholder="abc@gmail.com"
                          />
                        </Field>
                        <Field>
                          <FieldLabel htmlFor="zip">Role</FieldLabel>
                          <Input id="zip" type="text" placeholder="Admin" />
                        </Field>
                      </div>
                    </FieldGroup>
                  </FieldSet>
                </div>
              </>
            )}

            {activeTab === "users" && <UserManagement />}
            {activeTab === "posts" && <PostManagement />}

            {activeTab === "calendar" && (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-4">Calendar</h2>
                <p className="text-gray-600">
                  Calendar functionality coming soon...
                </p>
              </div>
            )}

            {activeTab === "search" && (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-4">Search</h2>
                <p className="text-gray-600">
                  Search functionality coming soon...
                </p>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-4">Settings</h2>
                <p className="text-gray-600">Settings panel coming soon...</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
