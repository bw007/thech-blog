export type ArticleStatus = 'draft' | 'published' | 'scheduled';

export interface Article {
  id: string;
  title: string;
  content: Record<string, any>;
  cover_image: string | null;
  slug: string | null;
  status: ArticleStatus;
  author_id: string;
  reading_time: number;
  views_count: number;
  likes_count: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  tags: string[];
}