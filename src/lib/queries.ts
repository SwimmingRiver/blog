import { useQuery } from "@tanstack/react-query";
import type { PostResponse, SinglePostResponse } from "@/types/post";
import supabase from "./supabase";

export const getPosts = async (page: number, tag?: string): Promise<PostResponse> => {
  // If filtering by tag, use inner join
  const joinType = tag ? '!inner' : '';

  let query = supabase
    .from("posts")
    .select(`
      *,
      post_tags${joinType} (
        tags${joinType} (
          id,
          name,
          created_at
        )
      )
    `, { count: "exact" });

  if (tag) {
    query = query.eq('post_tags.tags.name', tag);
  }

  const { data, error, count } = await query
    .range(page * 10, (page + 1) * 10 - 1)
    .order("created_at", { ascending: false });

  if (error) {
    console.error('getPosts error:', error);
    throw error;
  }

  console.log('Raw posts data:', JSON.stringify(data, null, 2));

  // Transform the data to flatten tags
  const transformedData = data?.map((post: any) => {
    const tags = post.post_tags?.map((pt: any) => pt.tags).filter(Boolean) || [];
    console.log('Post tags:', post.id, tags);
    return {
      ...post,
      tags
    };
  }) || [];

  return { data: transformedData, count };
};
const getPost = async (id: string): Promise<SinglePostResponse> => {
  const { data, error } = await supabase
    .from("posts")
    .select(`
      *,
      post_tags (
        tags (
          id,
          name,
          created_at
        )
      )
    `)
    .eq("id", id)
    .single();
  if (error) {
    throw error;
  }

  // Transform the data to flatten tags
  const transformedData = data ? {
    ...data,
    tags: data.post_tags?.map((pt: any) => pt.tags).filter(Boolean) || []
  } : null;

  return { data: transformedData };
};

export const useGetPost = (id: string) => {
  return useQuery<SinglePostResponse>({
    queryKey: ["post", id],
    queryFn: () => getPost(id),
  });
};
