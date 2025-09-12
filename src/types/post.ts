export interface Post {
  id: string;
  created_at: string;
  updated_at: string | null;
  title: string;
  summary: string | null;
  content: string;
}

export interface CreatePost {
  title: string;
  summary?: string | null;
  content: string;
}

export interface UpdatePost {
  title?: string;
  summary?: string | null;
  content?: string;
  updated_at?: string;
}

export interface PostRow {
  id: string;
  created_at: string;
  updated_at: string | null;
  title: string;
  summary: string | null;
  content: string;
}

export interface PostResponse {
  data: Post[];
  count?: number;
  error?: string;
}

export interface SinglePostResponse {
  data: Post | null;
  error?: string;
}
