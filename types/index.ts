export interface User {
  id: number
  name: string
  email: string
  role: 'Admin' | 'User'
  createdAt?: string
  updatedAt?: string
}

export interface CreateUserData {
  name: string
  email: string
  role: 'Admin' | 'User'
}

export interface UpdateUserData extends Partial<CreateUserData> {
  id: number
}

export interface Post {
  id: number
  title: string
  body: string
  userId: number
  status: 'draft' | 'published'
  createdAt?: string
  updatedAt?: string
}

export interface CreatePostData {
  title: string
  body: string
  userId: number
  status: 'draft' | 'published'
}

export interface UpdatePostData extends Partial<CreatePostData> {
  id: number
}

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}