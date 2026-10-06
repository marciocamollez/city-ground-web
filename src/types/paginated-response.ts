import type { Pagination } from './pagination'

export interface PaginatedResponse<T> {
  items: T[]
  meta: Pagination
}
