import { useQuery } from "@tanstack/react-query";
import type { PostResponse, SinglePostResponse } from "@/types/post";
import supabase from "./supabase";

export const getPosts = async (page: number): Promise<PostResponse> => {
  const { data, error, count } = await supabase
    .from("posts")
    .select("*", { count: "exact" })
    .range(page * 10, (page + 1) * 10 - 1)
    .order("created_at", { ascending: false });
  if (error) {
    throw error;
  }
  return { data: data || [], count };
};
const getPost = async (id: string): Promise<SinglePostResponse> => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    throw error;
  }
  return { data };
};

export const useGetPost = (id: string) => {
  return useQuery<SinglePostResponse>({
    queryKey: ["post", id],
    queryFn: () => getPost(id),
  });
};
