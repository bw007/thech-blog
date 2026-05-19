export interface Profile {
  id: string;
  username: string;
  full_name: string;
  bio: string | null;
  avatar_url: string;
  cover_url: string | null;
  website: string | null;
  location: string | null;
  github: string | null;
  telegram: string | null;
  twitter: string | null;
  followers_count: number;
  following_count: number;
  posts_count: number;
  created_at: string;
  updated_at: string;
}