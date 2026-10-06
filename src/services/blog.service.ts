import { api } from './api'
import type { PaginatedResponse } from '@/types/paginated-response'
import type { Post } from '@/types/post'

export const blogService = {
  async getPosts(
    page: number,
    perPage: number,
    search?: string
  ): Promise<PaginatedResponse<Post>> {
    const response = await api.get<PaginatedResponse<Post>>('/blog/posts', {
      params: {
        page,
        perPage,
        search,
      }
    })
    return response.data
  },

  async getPostBySlug(slug: string): Promise<Post> {
    const response = await api.get<Post>(`/blog/posts/${slug}`)
    return response.data
  },
}
