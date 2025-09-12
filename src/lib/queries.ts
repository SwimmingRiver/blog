import { useQuery } from "@tanstack/react-query";
import type { PostResponse, SinglePostResponse } from "@/types/post";
import supabase from "./supabase";

const getPosts = async (): Promise<PostResponse> => {
  const { data, error } = await supabase.from("posts").select("*");
  if (error) {
    throw error;
  }
  return { data, count: data.length };
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

export const useGetPosts = () => {
  return useQuery<PostResponse>({
    queryKey: ["posts"],
    queryFn: getPosts,
  });
};

export const useGetPost = (id: string) => {
  return useQuery<SinglePostResponse>({
    queryKey: ["post", id],
    queryFn: () => getPost(id),
  });
};
