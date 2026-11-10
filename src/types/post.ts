import type { Category } from './category';
export interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  date: string;
  featuredImage: string | null;
  categories: Category[];
}
