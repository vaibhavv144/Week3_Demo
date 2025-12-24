import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { CreateUserData, UpdateUserData, User } from '@/types'

const API_URL = 'https://jsonplaceholder.typicode.com'

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async (): Promise<User[]> => {
      const response = await axios.get(`${API_URL}/users`)
      return response.data
    },
  })
}

export const useUser = (id: number) => {
  return useQuery({
    queryKey: ['users', id],
    queryFn: async (): Promise<User> => {
      const response = await axios.get(`${API_URL}/users/${id}`)
      return response.data
    },
    enabled: !!id,
  })
}

export const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (userData: CreateUserData): Promise<User> => {
      const response = await axios.post(`${API_URL}/users`, userData)
      console.log('✅ User created successfully:', response.data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: (error) => {
      console.error('❌ Failed to create user:', error)
    },
  })
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (userData: UpdateUserData): Promise<User> => {
      const { id, ...data } = userData
      const response = await axios.put(`${API_URL}/users/${id}`, data)
      console.log('✅ User updated successfully:', response.data)
      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.setQueryData(['users', data.id], data)
    },
    onError: (error) => {
      console.error('❌ Failed to update user:', error)
    },
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      await axios.delete(`${API_URL}/users/${id}`)
      console.log('✅ User deleted successfully, ID:', id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: (error) => {
      console.error('❌ Failed to delete user:', error)
    },
  })
}