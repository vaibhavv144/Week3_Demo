import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { CreatePostData, UpdatePostData, Post } from '@/types'

const API_URL = 'https://jsonplaceholder.typicode.com'

export const usePosts = (status?: 'draft' | 'published') => {
  return useQuery({
    queryKey: status ? ['posts', status] : ['posts'],
    queryFn: async (): Promise<Post[]> => {
      const params = status ? { status } : {}
      const response = await axios.get(`${API_URL}/posts`, { params })
      return response.data
    },
  })
}

export const usePost = (id: number) => {
  return useQuery({
    queryKey: ['posts', id],
    queryFn: async (): Promise<Post> => {
      const response = await axios.get(`${API_URL}/posts/${id}`)
      return response.data
    },
    enabled: !!id,
  })
}

export const useCreatePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (postData: CreatePostData): Promise<Post> => {
      const response = await axios.post(`${API_URL}/posts`, postData)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}

export const useUpdatePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (postData: UpdatePostData): Promise<Post> => {
      const { id, ...data } = postData
      const response = await axios.put(`${API_URL}/posts/${id}`, data)
      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      queryClient.setQueryData(['posts', data.id], data)
    },
  })
}

export const useDeletePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      await axios.delete(`${API_URL}/posts/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}