import { useMutation } from "@tanstack/react-query";
import supabase from "./supabase";
import type { CreatePost, UpdatePost } from "@/types/post";

export const useCreatePost = () => {
  return useMutation({
    mutationFn: async (post: CreatePost) => {
      const { data, error } = await supabase.from("posts").insert(post);
      if (error) {
        throw error;
      }
      return data;
    },
  });
};

export const useUpdatePost = (id: string) => {
  return useMutation({
    mutationFn: async (post: UpdatePost) => {
      const { data, error } = await supabase
        .from("posts")
        .update(post)
        .eq("id", id);
      if (error) {
        throw error;
      }
      return data;
    },
  });
};

export const useDeletePost = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase.from("posts").delete().eq("id", id);
      if (error) {
        throw error;
      }
      return data;
    },
  });
};
