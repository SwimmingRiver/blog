export interface Tag {
  id: string;
  name: string;
  created_at: string;
}

export interface Post {
  id: string;
  created_at: string;
  updated_at: string | null;
  title: string;
  summary: string | null;
  content: string;
  view_count: number;
  tags?: Tag[];
}

export interface CreatePost {
  title: string;
  summary?: string | null;
  content: string;
  tags?: string[];
}

export interface UpdatePost {
  title?: string;
  summary?: string | null;
  content?: string;
  updated_at?: string;
  tags?: string[];
}

export interface PostRow {
  id: string;
  created_at: string;
  updated_at: string | null;
  title: string;
  summary: string | null;
  content: string;
  view_count: number;
}

export interface PostResponse {
  data: Post[];
  count?: number | null;
  error?: string;
}

export interface SinglePostResponse {
  data: Post | null;
  error?: string;
}

export interface DailyView {
  id: string;
  date: string;
  total_views: number;
  created_at: string;
}

export interface SiteVisit {
  id: string;
  date: string;
  total_visits: number;
  created_at: string;
}

export interface ViewStats {
  totalViews: number;
  todayViews: number;
}

export interface SiteStats {
  totalVisitors: number;
  todayVisitors: number;
}
