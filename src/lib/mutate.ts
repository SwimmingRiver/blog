import { useMutation } from "@tanstack/react-query";
import supabase from "./supabase";
import type {
  CreatePost,
  UpdatePost,
  SinglePostResponse,
} from "@/types/post";

export const useCreatePost = () => {
  return useMutation<SinglePostResponse, Error, CreatePost>({
    mutationFn: async (post: CreatePost) => {
      const { data, error } = await supabase.from("posts").insert(post).select();
      if (error) {
        throw error;
      }
      return { data: data[0], error: undefined };
    },
  });
};

export const useUpdatePost = (id: string) => {
  return useMutation<SinglePostResponse, Error, UpdatePost>({
    mutationFn: async (post: UpdatePost) => {
      const { data, error } = await supabase
        .from("posts")
        .update(post)
        .eq("id", id)
        .select();
      if (error) {
        throw error;
      }
      return { data: data[0], error: undefined };
    },
  });
};

export const useDeletePost = () => {
  return useMutation<SinglePostResponse, Error, string>({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase.from("posts").delete().eq("id", id);
      if (error) {
        throw error;
      }
      return { data, error: undefined };
    },
  });
};
