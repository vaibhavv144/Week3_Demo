'use client'

import { useState } from 'react'
import { usePosts, useCreatePost, useUpdatePost, useDeletePost } from '@/hooks/use-posts'
import { LoadingSpinner, TableSkeleton, ErrorMessage } from '@/components/ui/loading'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CreatePostData, Post } from '@/types'

export function PostManagement() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [filter, setFilter] = useState<'all' | 'draft' | 'published'>('all')
  const [formData, setFormData] = useState<CreatePostData>({
    title: '',
    body: '',
    userId: 1,
    status: 'draft'
  })

  const { data: posts, isLoading, error, refetch } = usePosts(
    filter === 'all' ? undefined : filter
  )
  const createPost = useCreatePost()
  const updatePost = useUpdatePost()
  const deletePost = useDeletePost()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingPost) {
        await updatePost.mutateAsync({ ...formData, id: editingPost.id })
      } else {
        await createPost.mutateAsync(formData)
      }
      
      setFormData({ title: '', body: '', userId: 1, status: 'draft' })
      setIsFormOpen(false)
      setEditingPost(null)
    } catch (error) {
      console.error('Error saving post:', error)
    }
  }

  const handleEdit = (post: Post) => {
    setEditingPost(post)
    setFormData({
      title: post.title,
      body: post.body,
      userId: post.userId,
      status: post.status
    })
    setIsFormOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost.mutateAsync(id)
      } catch (error) {
        console.error('Error deleting post:', error)
      }
    }
  }

  if (isLoading) return <TableSkeleton />
  if (error) return <ErrorMessage message="Failed to load posts" onRetry={() => refetch()} />

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Post Management</h2>
        <div className="flex space-x-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'draft' | 'published')}
            className="px-3 py-2 border rounded-md"
          >
            <option value="all">All Posts</option>
            <option value="draft">Drafts</option>
            <option value="published">Published</option>
          </select>
          <Button onClick={() => setIsFormOpen(true)}>Add Post</Button>
        </div>
      </div>

      {isFormOpen && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-medium mb-4">
            {editingPost ? 'Edit Post' : 'Add New Post'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Content</label>
              <textarea
                value={formData.body}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                className="w-full p-2 border rounded-md h-32"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' })}
                className="w-full p-2 border rounded-md"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div className="flex space-x-2">
              <Button 
                type="submit" 
                disabled={createPost.isPending || updatePost.isPending}
              >
                {createPost.isPending || updatePost.isPending ? (
                  <LoadingSpinner />
                ) : (
                  editingPost ? 'Update' : 'Create'
                )}
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => {
                  setIsFormOpen(false)
                  setEditingPost(null)
                  setFormData({ title: '', body: '', userId: 1, status: 'draft' })
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Content</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {posts?.map((post) => (
                <tr key={post.id}>
                  <td className="px-6 py-4 text-sm text-gray-900">{post.id}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{post.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {post.body.length > 50 ? `${post.body.substring(0, 50)}...` : post.body}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(post)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(post.id)}
                      disabled={deletePost.isPending}
                    >
                      {deletePost.isPending ? <LoadingSpinner /> : 'Delete'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}